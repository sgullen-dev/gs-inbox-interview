import { v4 as uuid } from "uuid";
import { useQuery, useMutation, useSubscription } from "@apollo/client";

import { MARK_READ_MUTATION, SEND_MESSAGE_MUTATION } from "../../lib/mutations";
import { GET_PEOPLE_QUERY, GET_MESSAGES_QUERY } from "../../lib/queries";
import { MESSAGE_RECEIVED_SUBSCRIPTION } from "../../lib/subscriptions";
import { MessageType, PersonType } from "../../lib/types";

import MessagesButton from "./components/MessagesButton";
import MessagesEmpty from "./components/MessagesEmpty";
import MessagesInput from "./components/MessagesInput";
import MessagesListSkeleton from "./components/MessagesListSkeleton";
import MessagesNoPerson from "./components/MessagesNoPerson";
import Message from "./components/Message";

interface MessagesProps {
  selectedPerson?: PersonType;
}

const Messages = ({ selectedPerson }: MessagesProps) => {
  return (
    <div className="flex h-full flex-col">
      <div className="flex flex-1 overflow-y-auto">
        {/* TODO: If a person is not selected, show <MessagesNoPerson /> ... */}

        {/* TODO: If a person is selected, show <MessagesList /> ... */}
      </div>
      <div className="h-20 p-4">
        {/* TODO: If a person is selected, show <MessagesForm /> ... */}
      </div>
    </div>
  );
};

interface MessagesListProps {}

/** A component render a list of conversations with a single person. */
const MessagesList = ({}: MessagesListProps) => {
  // TODO: If the list is empty, show <MessagesEmpty /> ...

  return (
    <div className="p-4 pb-0 flex flex-col mt-auto w-full gap-4">
      {/* TODO: Show a list of messages, using the <Message /> component ... */}

      {/* Dummy node representing the end of the message list */}
      <div />
    </div>
  );
};

interface MessagesFormProps {}

/** Provides a form for sending a message to the currently selected person */
const MessagesForm = ({}: MessagesFormProps) => {
  return (
    <form className="flex gap-2">
      {/* TODO: Use <MessagesInput /> component for the message body ... */}

      {/* TODO: Use <MessagesButton /> component for the send button ... */}
    </form>
  );
};

export default Messages;
