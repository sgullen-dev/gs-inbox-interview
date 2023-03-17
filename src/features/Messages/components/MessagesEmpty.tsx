import { PersonType } from "../../../lib/types";

interface MessagesEmptyProps {
  person: PersonType;
}

/** Displays a message informing the user that the message list is empty */
const MessagesEmpty = ({ person }: MessagesEmptyProps) => {
  return (
    <div className="h-full w-full text-lg text-gray-800 font-semibold flex items-center justify-center">
      <p>{`You don't have any messages with ${person.firstName} ${person.lastName}.`}</p>
    </div>
  );
};

export default MessagesEmpty;
