import { forwardRef } from "react";

/** An <input/> element wrapper that accepts a forwarded ref and has pre-set styles */
const MessageInput = forwardRef<
  HTMLInputElement,
  React.ComponentPropsWithoutRef<"input">
>(function MessageInputComponent(props, ref) {
  return (
    <input
      {...{ ...props, ref }}
      className="p-3 w-full text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500"
    />
  );
});

export default MessageInput;
