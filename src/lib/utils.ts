import {
  AZURE_COLOR,
  EMERALD_COLOR,
  GOLDEN_COLOR,
  LAVENDER_COLOR,
  SCARLET_COLOR,
  SILVER_COLOR,
  SUNSET_COLOR,
} from "@/config";
import { TxKeyPath, translate } from "@/i18n";
import { Color } from "@/stores";
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

/**
 * Generates an array of quotes for a given color.
 * @param {Color} color - The color for which quotes are generated.
 * @returns {string[]} An array of quotes for the specified color.
 */
export const generateColorQoutes = (color: Color): string[] => {
  const colorQoutes: string[] = [];

  for (let i = 1; i <= 10; i++) {
    let quoteKey = `settings.color.options.${color}.quotes.${String(i).padStart(
      2,
      "0"
    )}`;
    let quoteText: string = translate(quoteKey as TxKeyPath);

    colorQoutes.push(quoteText);
  }

  return colorQoutes;
};

/**
 * Returns a randomly selected quote from the provided array of color quotes.
 * @param {string[]} colorQoutes - An array of color quotes.
 * @returns {string} A randomly selected quote from the array.
 */
export const getRandomGeneratedColorQoutes = (
  colorQoutes: string[]
): string => {
  const randomIndex = Math.floor(Math.random() * colorQoutes.length);
  return colorQoutes[randomIndex];
};

export const getColor = (colorSelected: string) => {
  switch (colorSelected) {
    case "azure":
      return AZURE_COLOR;
    case "emerald":
      return EMERALD_COLOR;
    case "golden":
      return GOLDEN_COLOR;
    case "sunset":
      return SUNSET_COLOR;
    case "lavender":
      return LAVENDER_COLOR;
    case "scarlet":
      return SCARLET_COLOR;
    case "silver":
      return SILVER_COLOR;
    default:
      return EMERALD_COLOR;
  }
};
