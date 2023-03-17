interface PeopleListSkeletonProps {
  count?: number;
}

const PeopleListSkeleton = ({ count = 5 }: PeopleListSkeletonProps) => {
  return (
    <div
      role="status"
      className="p-4 space-y-4 divide-y divide-gray-200 animate-pulse"
    >
      {[...Array(count)].map((_, index) => (
        <div
          key={`people-list-loader-${index}`}
          className={`flex flex-col justify-between ${index !== 0 && "pt-4"}`}
        >
          <div className="flex justify-between pt-1.5">
            <div className="h-2.5 bg-gray-300 rounded-full w-24 mb-2.5"></div>
            <div className="h-2.5 bg-gray-200 rounded-full w-12"></div>
          </div>
          <div className="w-32 h-2 bg-gray-200 rounded-full mb-2"></div>
        </div>
      ))}
      <span className="sr-only">Loading...</span>
    </div>
  );
};

export default PeopleListSkeleton;
