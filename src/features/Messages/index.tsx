import { MessageType, PersonType } from "../../lib/types";

import MessagesButton from "./components/MessagesButton";
import MessagesEmpty from "./components/MessagesEmpty";
import MessagesInput from "./components/MessagesInput";
import MessagesListSkeleton from "./components/MessagesListSkeleton";
import MessagesNoPerson from "./components/MessagesNoPerson";

interface MessagesProps {
  selectedPerson?: PersonType;
}

const Messages = ({ selectedPerson }: MessagesProps) => {
  return (
    <div className="flex h-full flex-col">
      <div className="flex flex-1 overflow-y-auto">
        {/* TODO: If no person is selected, render <MessagesNoPerson /> */}

        {/* TODO: If a person is selected but messages are still loading, render <MessagesListSkeleton /> */}

        {/* TODO: If a person is selected and messages are loaded, render <MessagesList /> */}
      </div>
      <div className="h-20 p-4">
        {/* TODO: If a person is selected, render <MessagesForm /> */}
      </div>
    </div>
  );
};

interface MessagesListProps {}

/** A component render a list of conversations with a single person. */
const MessagesList = ({}: MessagesListProps) => {
  // TODO: if the list is empty, the <MessagesEmpty /> component should be rendered

  return (
    <div className="p-4 pb-0 flex flex-col mt-auto w-full gap-4">
      {/* TODO: render a list of messages, using the <Message /> component */}

      {/* dummy node representing the end of the message list */}
      <div />
    </div>
  );
};

interface MessagesFormProps {}

/** Provides a form for sending a message to the currently selected person */
const MessagesForm = ({}: MessagesFormProps) => {
  return (
    <form className="flex gap-2">
      {/* TODO: render a message input, using the <MessagesInput /> component */}

      {/* TODO: render a send button, using the <MessagesButton /> component */}
    </form>
  );
};

export default Messages;
