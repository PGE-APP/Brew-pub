/**
 * Converts a date string to "DD/MM/YYYY HH:mm:ss" format.
 * Validates and handles various input formats including "M/D/YYYY, h:mm:ss A".
 * 
 * @param dateString The date string to format
 * @returns The formatted date string in 'DD/MM/YYYY HH:mm:ss' format, or the original string if parsing fails.
 */
export function formatDate(dateString: string | undefined | null): string {
  if (!dateString) return "";

  const date = new Date(dateString);

  // Check if date is valid
  if (!isNaN(date.getTime())) {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    
    return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
  }

  return dateString;
}
