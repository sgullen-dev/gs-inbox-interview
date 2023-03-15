import { ApolloClient, HttpLink, InMemoryCache, split } from "@apollo/client";

import { GraphQLWsLink } from "@apollo/client/link/subscriptions";
import { createClient } from "graphql-ws";
import { getMainDefinition } from "@apollo/client/utilities";

// Create HTTP transport link (for `query` and `mutation` operations)
const httpLink = new HttpLink({ uri: "http://localhost:4000/graphql/" });

// Create WebSocket transport link (for `subscription` operations)
const wsLink = new GraphQLWsLink(
  createClient({ url: "ws://localhost:4000/subscriptions" })
);

// If the operation type is `subscription`, use the WebSocket transport link.
// Otherwise, use the HTTP transport link.
const splitLink = split(
  ({ query }) => {
    const definition = getMainDefinition(query);
    return (
      definition.kind === "OperationDefinition" &&
      definition.operation === "subscription"
    );
  },
  wsLink,
  httpLink
);

// Initialize the client with an in-memory cache.
const client = new ApolloClient({
  link: splitLink,
  cache: new InMemoryCache(),
});

export default client;
