import { useQuery } from "@apollo/client";
import { useState } from "react";

import { GET_PEOPLE_QUERY } from "./lib/queries";

import DevControls from "./features/DevControls";
import Messages from "./features/Messages";
import People from "./features/People";

function App() {
  const { data } = useQuery(GET_PEOPLE_QUERY);
  const people = data?.people;

  const [selectedPersonId, setSelectedPersonId] = useState<string | undefined>(
    undefined
  );
  const selectedPerson = people?.find(({ id }) => id === selectedPersonId);

  return (
    <main className="flex flex-col h-screen">
      <header className="py-6 px-4 text-white bg-gray-800 border-b shadow-sm text-md">
        Inbox
      </header>
      <div className="grid flex-1 grid-cols-4 overflow-hidden">
        <div className="col-span-1 overflow-y-auto border-r">
          <People {...{ selectedPersonId, setSelectedPersonId }} />
        </div>
        <div className="col-span-3 overflow-y-auto">
          <Messages {...{ selectedPerson }} />
        </div>
      </div>
      <footer className="py-6 px-4 border-t">
        <DevControls />
      </footer>
    </main>
  );
}

export default App;
