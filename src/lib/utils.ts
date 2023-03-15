import { format, formatDistanceStrict, isToday } from "date-fns";

export const timeAgo = (date: Date | string) => {
  if (typeof date === "string") date = new Date(date);
  if (isToday(date)) return format(date, "h:mm a");
  return formatDistanceStrict(date, new Date());
};
