// date formatting
export const formatDateForInput = (date: Date): string => {
  if (!date || !(date instanceof Date) || isNaN(date.getTime())) {
    return "";
  }
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const day = date.getDate().toString().padStart(2, "0");
  return `${year}-${month}-${day}`;
};

// time formatting
export const formatTimeForInput = (date: Date): string => {
  if (!date || !(date instanceof Date) || isNaN(date.getTime())) {
    return "";
  }
  const hours = date.getHours().toString().padStart(2, "0");
  const minutes = date.getMinutes().toString().padStart(2, "0");
  return `${hours}:${minutes}`;
};

// just ensure the time is good
export const updateDatePart = (currentDate: Date, newDateString: string): Date => {
  if (!currentDate || !(currentDate instanceof Date) || isNaN(currentDate.getTime()) || !newDateString) {
    return currentDate;
  }
  const timePart = currentDate.toTimeString().split(" ")[0]; // HH:MM:SS
  const [hours, minutes, seconds] = (timePart + ":00").split(":");
  const formattedTime = `${hours}:${minutes}:${seconds}`;
  return new Date(`${newDateString}T${formattedTime}`);
};

// just ensure the time is good
export const updateTimePart = (currentDate: Date, newTimeString: string): Date => {
  if (!currentDate || !(currentDate instanceof Date) || isNaN(currentDate.getTime()) || !newTimeString) {
    return currentDate;
  }
  const datePart = currentDate.toISOString().split("T")[0];
  const timeWithSeconds = newTimeString.split(":").length === 2 ? `${newTimeString}:00` : newTimeString;
  return new Date(`${datePart}T${timeWithSeconds}`);
};
