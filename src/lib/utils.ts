import { format, parseISO } from "date-fns";

export function formatDate(dateString: string): string {
  const date = parseISO(dateString);
  return format(date, "MMMM d, yyyy");
}
