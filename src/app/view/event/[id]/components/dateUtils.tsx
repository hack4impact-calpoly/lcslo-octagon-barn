import { time } from "node:console";

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
  const [year, month, day] = newDateString.split("-").map(Number);
  return new Date(year, month - 1, day, currentDate.getHours(), currentDate.getMinutes(), currentDate.getSeconds());
};

// just ensure the time is good
export const updateTimePart = (currentDate: Date, newTimeString: string): Date => {
  if (!currentDate || !(currentDate instanceof Date) || isNaN(currentDate.getTime()) || !newTimeString) {
    return currentDate;
  }
  const [hour, minutes, seconds = 0] = newTimeString.split(":").map(Number);
  return new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate(), hour, minutes, seconds);
};
