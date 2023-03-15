import { timeAgo } from "../../../lib/utils";

interface MessageProps {
  self: boolean;
  body: string;
  timestamp: string;
}

/** A component rendering a single message */
const Message = ({ self = false, body, timestamp }: MessageProps) => {
  return (
    <div className={`flex ${self ? "justify-end" : ""}`}>
      <div className="flex flex-col gap-1">
        <div
          className={`flex rounded-lg p-2 border ${
            self ? "bg-blue-100 border-blue-300" : "bg-gray-100 border-gray-300"
          }`}
        >
          {body}
        </div>
        <div className={`text-gray-500 ${self ? "text-end" : ""}`}>
          {timeAgo(timestamp)}
        </div>
      </div>
    </div>
  );
};

export default Message;
