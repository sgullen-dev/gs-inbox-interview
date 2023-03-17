import { v4 as uuid } from "uuid";
import {
  useQuery,
  useMutation,
  useSubscription,
  MutationResult,
} from "@apollo/client";

import {
  MARK_READ_MUTATION,
  SEND_MESSAGE_MUTATION,
  SendMessageData,
} from "../../lib/mutations";
import { GET_PEOPLE_QUERY, GET_MESSAGES_QUERY } from "../../lib/queries";
import { MESSAGE_RECEIVED_SUBSCRIPTION } from "../../lib/subscriptions";
import { MessageType, PersonType } from "../../lib/types";

import MessagesButton from "./components/MessagesButton";
import MessagesEmpty from "./components/MessagesEmpty";
import MessagesInput from "./components/MessagesInput";
import MessagesListSkeleton from "./components/MessagesListSkeleton";
import MessagesNoPerson from "./components/MessagesNoPerson";
import Message from "./components/Message";
import { useEffect, useRef, useState } from "react";

interface MessagesProps {
  selectedPerson?: PersonType;
}

const Messages = ({ selectedPerson }: MessagesProps) => {
  const [sendMessageFn, sendMessageResult] = useMutation(SEND_MESSAGE_MUTATION);
  return (
    <div className="flex h-full flex-col">
      <div className="flex flex-1 overflow-y-auto">
        {!selectedPerson ? (
          <MessagesNoPerson />
        ) : (
          <MessagesList
            selectedPerson={selectedPerson}
            outgoingMessage={sendMessageResult}
          />
        )}
      </div>
      <div className="h-20 p-4">
        <MessagesForm
          selectedPerson={selectedPerson}
          sendMessageLoading={sendMessageResult.loading}
          sendMessageFn={sendMessageFn}
        />
      </div>
    </div>
  );
};

interface MessagesListProps {
  selectedPerson?: PersonType;
  outgoingMessage?: MutationResult<SendMessageData>;
}

/** A component render a list of conversations with a single person. */
const MessagesList = ({
  selectedPerson,
  outgoingMessage,
}: MessagesListProps) => {
  const { data: messagesData, loading: messagesLoading } = useQuery(
    GET_MESSAGES_QUERY,
    {
      variables: { personId: selectedPerson.id },
    }
  );
  const { data: receivedData } = useSubscription(MESSAGE_RECEIVED_SUBSCRIPTION);
  const messageScrollToBottom = useRef(null);
  const [messages, setMessages] = useState();

  // Scroll to the bottom node in the messages list
  useEffect(() => {
    if (messageScrollToBottom.current) {
      messageScrollToBottom.current.scrollIntoView();
    }
  }, [messages, messageScrollToBottom]);

  // Set the messages state to fetched data
  useEffect(() => {
    if (messagesData) {
      setMessages(messagesData.messages.slice().reverse());
    }
  }, [messagesData]);

  // Add an outgoing message to the list of messages
  useEffect(() => {
    if (outgoingMessage.called && !outgoingMessage.loading) {
      setMessages([...messages, outgoingMessage.data.sendMessage.result]);
    }
  }, [outgoingMessage]);

  // Add an incoming message to the list of messages
  useEffect(() => {
    if (receivedData?.messageReceived.sender.id === selectedPerson.id) {
      setMessages([...messages, receivedData.messageReceived]);
    }
  }, [receivedData]);

  if (messagesLoading || !messages) {
    return <MessagesListSkeleton />;
  } else if (!messages.length) {
    return <MessagesEmpty person={selectedPerson} />;
  }

  return (
    <div className="p-4 pb-0 flex flex-col mt-auto w-full gap-4">
      {messages.map((message, i) => (
        <Message
          key={i}
          self={message.sender.self}
          body={message.body}
          timestamp={message.timestamp}
        />
      ))}
      <div ref={messageScrollToBottom} />
    </div>
  );
};

interface MessagesFormProps {
  selectedPerson?: PersonType;
  sendMessageLoading: boolean;
  sendMessageFn: ({ variables: SendMessageVariables }) => void;
}

/** Provides a form for sending a message to the currently selected person */
const MessagesForm = ({
  selectedPerson,
  sendMessageLoading,
  sendMessageFn,
}: MessagesFormProps) => {
  const [message, setMessage] = useState("");

  const submitMessage = () => {
    sendMessageFn({
      variables: {
        messageId: uuid(),
        recipientId: selectedPerson.id,
        body: message,
      },
    });
    setMessage("");
  };

  return (
    <form className="flex gap-2">
      <MessagesInput
        value={message}
        onChange={(event) => setMessage(event.target.value)}
      />
      <MessagesButton
        type="button"
        onClick={submitMessage}
        loading={sendMessageLoading}
      />
    </form>
  );
};

export default Messages;
