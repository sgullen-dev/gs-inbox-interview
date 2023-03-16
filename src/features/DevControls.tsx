import data from "../../data.json";
import { useState } from "react";

const people = data.people
  .filter(({ self }) => !self)
  .sort((a, b) => a.lastName.localeCompare(b.lastName));

function DevControls() {
  const [selectedPersonId, setSelectedPersonId] = useState<string>(
    people[0].id
  );

  const handleMockMessage = () => {
    fetch(`${__WEBHOOKS_API_URL__}${selectedPersonId}`, {
      method: "POST",
    });
  };

  return (
    <form className="flex">
      <div className="flex flex-col">
        <label
          htmlFor="simulate-message-person-select"
          className="mb-2 font-medium text-gray-800"
        >
          Simulate message from
        </label>
        <div className="flex items-center">
          <select
            id="simulate-message-person-select"
            value={selectedPersonId}
            onChange={(e) => setSelectedPersonId(e.target.value)}
            className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 mr-2"
          >
            {people.map((person) => (
              <option key={`devtools-person-${person.id}`} value={person.id}>
                {person.firstName} {person.lastName}
              </option>
            ))}
          </select>
          <button
            type="button"
            onClick={handleMockMessage}
            className="text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg px-5 py-2.5"
          >
            Generate
          </button>
        </div>
      </div>
    </form>
  );
}

export default DevControls;
