import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import { ApolloServerPluginDrainHttpServer } from "@apollo/server/plugin/drainHttpServer";
import { faker } from "@faker-js/faker";
import { loadFiles } from "@graphql-tools/load-files";
import { makeExecutableSchema } from "@graphql-tools/schema";
import bodyParser from "body-parser";
import cors from "cors";
import express from "express";
import { DateTimeResolver } from "graphql-scalars";
import { PubSub } from "graphql-subscriptions";
import { useServer } from "graphql-ws/lib/use/ws";
import { createServer } from "http";
import pinoHttp from "pino-http";
import { WebSocketServer } from "ws";
import data from "../data.json" assert { type: "json" };

/* IN-MEMORY DB */

const people = data.people.sort((a, b) => a.lastName.localeCompare(b.lastName));

const messages = generateMessages();

/* IN-MEMORY PUBSUB */
const pubsub = new PubSub();

/* SCHEMA, RESOLVERS */

// load type defs
const typeDefs = await loadFiles("./typeDefs.graphql");

// define resolvers
const resolvers = {
  DateTime: DateTimeResolver,
  Query: {
    self: getSelf,
    people: () => {
      const filtered = people
        .filter(({ self }) => !self)
        .map((person) => ({
          ...person,
          lastMessage: getLastMessage(person.id),
        }));

      return filtered;
    },
    messages: async (_, args) => {
      const filtered = args?.personId
        ? sortedMessages().filter(
            (message) =>
              message.recipient.id === args.personId ||
              message.sender.id === args.personId
          )
        : sortedMessages();

      return filtered;
    },
  },
  Mutation: {
    sendMessage: (_, args) => {
      if (!args.messageId) {
        return invalidRequest("messageId cannot be blank");
      }

      if (messages.some((message) => args.messageId === message.id)) {
        return invalidRequest("messageId must be unique");
      }

      if (!args.recipientId) {
        return invalidRequest("recipientId cannot be blank");
      }

      if (args.recipientId === getSelf().id) {
        return invalidRequest("recipientId cannot be your own id");
      }

      if (!people.find((person) => person.id === args.recipientId)) {
        return invalidRequest("recipientId must match an existing person");
      }

      if (!args.body) {
        return invalidRequest("body cannot be blank");
      }

      return {
        code: "201",
        success: true,
        message: "Message sent successfully",
        result: sendMessage(args.messageId, args.recipientId, args.body),
      };
    },
    markRead: (_, args) => {
      if (!args.personId) {
        return invalidRequest("personId cannot be blank");
      }

      if (args.personId === getSelf().id) {
        return invalidRequest("personId cannot be your own id");
      }

      if (!people.find((person) => person.id === args.personId)) {
        return invalidRequest("personId must match an existing person");
      }

      if (!args.lastRead) {
        return invalidRequest("lastRead cannot be blank");
      }

      return {
        code: "201",
        success: true,
        message: "Last read updated successfully",
        result: setLastRead(args.personId, args.lastRead),
      };
    },
  },
  Subscription: {
    messageReceived: {
      subscribe: () => pubsub.asyncIterator(["MESSAGE_RECEIVED"]),
    },
  },
};

// Create the schema, which will be used separately by ApolloServer and
// the WebSocket server.
const schema = makeExecutableSchema({ typeDefs, resolvers });

/** INITIALIZE SERVER */

// Create an Express app and HTTP server; we will attach both the WebSocket
// server and the ApolloServer to this HTTP server.
const app = express();
// init logger
app.use(
  pinoHttp({
    transport: {
      target: "pino-pretty",
      options: { singleLine: true, colorize: true },
    },
  })
);
const httpServer = createServer(app);

// Create our WebSocket server using the HTTP server we just set up.
const wsServer = new WebSocketServer({
  server: httpServer,
  path: "/subscriptions",
});
// Save the returned server's info so we can shutdown this server later
const serverCleanup = useServer({ schema }, wsServer);

// Set up ApolloServer.
const server = new ApolloServer({
  schema,
  plugins: [
    // Proper shutdown for the HTTP server.
    ApolloServerPluginDrainHttpServer({ httpServer }),

    // Proper shutdown for the WebSocket server.
    {
      async serverWillStart() {
        return {
          async drainServer() {
            await serverCleanup.dispose();
          },
        };
      },
    },
  ],
});

await server.start();
app.use(
  "/graphql",
  randomDelay,
  cors(),
  bodyParser.json(),
  expressMiddleware(server)
);

// Set up router for mock message received webhook
const webhooksRouter = express.Router();

webhooksRouter.post("/", (req, res, next) => {
  const filtered = people.filter(({ self }) => !self);
  const random = filtered[Math.floor(Math.random() * filtered.length)];
  receiveMessage(random.id);
  res.send();
});

webhooksRouter.post("/:senderId", (req, res, next) => {
  receiveMessage(req.params.senderId);
  res.send();
});

app.use("/webhooks", cors(), webhooksRouter);

const PORT = process.env["PORT"] || 4000;

// Now that our HTTP server is fully set up, we can listen to it.
httpServer.listen(PORT, () => {
  console.log(`GQL server ready at http://localhost:${PORT}/graphql`);
  console.log(`WebSocket server ready at ws://localhost:${PORT}/graphql`);
  console.log(`Webhooks server ready at http://localhost:${PORT}/webhooks`);
});

/* UTILITY FUNCTIONS */

/** Find own person in state */
function getSelf() {
  return people.find(({ self }) => self);
}

/** Find a person in state. */
function getPerson(personId) {
  return people.find(({ id }) => id === personId);
}

/** Given a person, get their most recent message. */
function getLastMessage(personId) {
  return sortedMessages().find(
    (message) =>
      message.recipient.id === personId || message.sender.id === personId
  );
}

/** A comparator for sorting dates in descending order. */
function messageComparator(a, b) {
  return b.timestamp - a.timestamp;
}

/** Sort messages in descending order. */
function sortedMessages() {
  return messages.sort(messageComparator);
}

/** Simulate generating and broadcasting receipt of a new message. */
function receiveMessage(senderId) {
  const newMessage = {
    id: faker.datatype.uuid(),
    sender: getPerson(senderId),
    recipient: getSelf(),
    body: faker.lorem.sentence(),
    timestamp: new Date(),
  };
  messages.push(newMessage);
  pubsub.publish("MESSAGE_RECEIVED", {
    messageReceived: newMessage,
  });
}

/** Convenience function for generating a GraphQL mutation error payload. */
function invalidRequest(message) {
  return {
    code: "400",
    success: false,
    message,
  };
}

/** Create a new message in state. */
function sendMessage(messageId, recipientId, body) {
  const newMessage = {
    id: messageId,
    sender: getSelf(),
    recipient: getPerson(recipientId),
    body: body,
    timestamp: new Date(),
  };
  messages.push(newMessage);
  return newMessage;
}

/** Update the lastRead property for a person in state. */
function setLastRead(personId, timestamp) {
  const personIndex = people.findIndex((person) => person.id === personId);
  people[personIndex] = { ...people[personIndex], lastRead: timestamp };
  return people[personIndex];
}

/** An express.js middleware function that introduces a random delay to a
 * request.
 */
function randomDelay(req, res, next) {
  return setTimeout(next, Math.random() * 1_000);
}

/** Seed random messages in state. */
function generateMessages() {
  const messages = [];
  const self = getSelf();
  const others = people.filter(({ self }) => !self);
  for (const [index, person] of others.entries()) {
    // don't generate any messages for the last 2 candidates
    if (index < others.length - 2) {
      // generate at least 2 messages per candidate
      for (let i = 0; i < Math.floor(Math.random() * 20) + 2; i++) {
        const recipient = Math.round(Math.random()) ? self : person;
        const sender = recipient.id === self.id ? person : self;

        messages.push({
          id: faker.datatype.uuid(),
          sender,
          recipient,
          body: faker.lorem.sentence(),
          timestamp: faker.date.recent(3),
        });
      }
    }
  }

  return messages.sort(messageComparator);
}
