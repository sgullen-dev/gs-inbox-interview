/** A skeleton loading indicator for the message list */
const MessagesListSkeleton = () => {
  return (
    <div
      role="status"
      className="p-4 pb-0 flex mt-auto animate-pulse w-full flex-col gap-4"
    >
      <MessageSkeleton self />
      <MessageSkeleton />
      <MessageSkeleton self />
      <span className="sr-only">Loading...</span>
    </div>
  );
};

interface MessageSkeletonProps {
  self?: boolean;
}

/** A message skeleton used by MessageListSkeleton */
const MessageSkeleton = ({ self = false }: MessageSkeletonProps) => {
  return (
    <div className={`flex ${self ? "justify-end" : ""}`}>
      <div className="flex flex-col gap-1">
        <div
          className={`rounded-lg p-2 h-12 w-80 ${
            self ? "bg-gray-300" : "bg-gray-200"
          }`}
        />
        <div
          className={`bg-gray-200 rounded-full mt-2 h-2.5 w-12 ${
            self ? "self-end" : ""
          }`}
        />
      </div>
    </div>
  );
};

export default MessagesListSkeleton;
