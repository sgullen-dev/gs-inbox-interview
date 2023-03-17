import { useQuery } from "@apollo/client";

import { GET_PEOPLE_QUERY } from "../../lib/queries";
import { PersonType } from "../../lib/types";
import { timeAgo } from "../../lib/utils";

import PeopleListSkeleton from "./components/PeopleListSkeleton";
import UnreadIndicator from "./components/UnreadIndicator";

interface PeopleProps {
  selectedPersonId?: string;
  setSelectedPersonId: React.Dispatch<React.SetStateAction<string | undefined>>;
}

const People = ({ selectedPersonId, setSelectedPersonId }: PeopleProps) => {
  const { data, loading } = useQuery(GET_PEOPLE_QUERY);
  const people = data?.people;

  if (loading || !people) {
    return <PeopleListSkeleton />;
  }

  return <PeopleList {...{ people, selectedPersonId, setSelectedPersonId }} />;
};

interface PeopleListProps {
  people: PersonType[];
  selectedPersonId?: string;
  setSelectedPersonId: React.Dispatch<React.SetStateAction<string | undefined>>;
}

const PeopleList = ({
  people,
  selectedPersonId,
  setSelectedPersonId,
}: PeopleListProps) => {
  return (
    <div
      role="tablist"
      aria-label="people list"
      className={"p-4 space-y-4 divide-y divide-gray-200"}
    >
      {/* TODO: determine correct sorting for the person list ... */}

      {people.map((person, index) => {
        const selected = person.id === selectedPersonId;

        return (
          <button
            key={`people-list-item-${person.id}`}
            className={`flex flex-col w-full justify-between cursor-pointer ${
              index !== 0 && "pt-4"
            }`}
            onClick={() => setSelectedPersonId(person.id)}
          >
            <div className="flex w-full justify-between items-center overflow-hidden">
              <div
                className={`text-gray-800 flex-grow text-left truncate ${
                  selected ? "font-semibold" : ""
                }`}
              >
                {person.firstName} {person.lastName}
              </div>
              <div className="text-gray-500 text-sm flex-shrink-0">
                {person.lastMessage && timeAgo(person.lastMessage.timestamp)}
              </div>
            </div>
            <div className="flex w-full justify-between items-center overflow-hidden">
              <div className="text-gray-500 text-sm truncate">
                {person.lastMessage && person.lastMessage.body}
              </div>

              {/* TODO: show <UnreadIndicator /> when there are unread messages ... */}
            </div>
          </button>
        );
      })}
    </div>
  );
};

export default People;
