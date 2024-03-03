import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Combines Tailwind CSS class names with additional class names.
 *
 * @param {ClassValue[]} inputs - An array of Tailwind CSS class names.
 * @returns {string} - A string containing the merged class names.
 */
export const cn = (...inputs: ClassValue[]): string => {
  return twMerge(clsx(inputs));
};

/**
 * Converts seconds to milliseconds.
 *
 * @param {number} seconds - The number of seconds to convert.
 * @returns {number} - The equivalent value in milliseconds.
 */
export const secondsToMilliseconds = (seconds: number): number => {
  return seconds * 1000;
};

/**
 * Converts minutes to milliseconds.
 *
 * @param {number} minutes - The number of minutes to convert.
 * @returns {number} - The equivalent value in milliseconds.
 */
export const minutesToMilliseconds = (minutes: number): number => {
  return minutes * 60 * 1000;
};

/**
 * Capitalizes the first letter of a string.
 * @param {string} value - The input string.
 * @returns {string} The string with the first letter capitalized.
 */
export const capitalizeFirstLetter = (value: string): string => {
  return value.charAt(0).toUpperCase() + value.slice(1);
};
