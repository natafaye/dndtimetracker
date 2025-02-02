import { SKY_COLORS } from "../shared/constants";
import type { TrackerTime } from "../shared/types";

/**
 * Mixes two colors based on a weight
 *
 * @param {string} color1 - the first color to mix
 * @param {string} color2 - the second color to mix
 * @param {number} weight1 - A weight for the first color from 0 to 100
 * @returns {string} A mix of the two colors according to the weight
 */
export const mixColors = function (
  color1: string,
  color2: string,
  weight1: number
): string {
  const decimalToHex = (d: number) => d.toString(16); // convert a decimal value to hex
  const hexToDecimal = (h: string) => parseInt(h, 16); // convert a hex value to decimal

  // Remove the hashtags
  color1 = color1.replace(/#/g, "");
  color2 = color2.replace(/#/g, "");
  // set the weight to 50%, if that argument is omitted
  weight1 = weight1 !== undefined ? weight1 : 50;

  let color = "#";

  // loop through each of the 3 hex pairs—red, green, and blue
  for (let i = 0; i <= 5; i += 2) {
    // extract the current pairs
    const v1 = hexToDecimal(color1.substring(i, i + 2));
    const v2 = hexToDecimal(color2.substring(i, i + 2));
    // combine the current pairs from each source color, according to the specified weight
    let val = decimalToHex(Math.round(v2 + (v1 - v2) * (weight1 / 100.0)));
    // prepend a '0' if val results in a single digit
    while (val.length < 2) {
      val = "0" + val;
    }
    // concatenate val to our new color string
    color += val;
  }

  return color;
};

/**
 * Returns the hex code sky color for a time
 */
export const getColorForTime = (time: TrackerTime): string => {
  if (time.minutes === 0) return SKY_COLORS[time.hour];
  return mixColors(
    SKY_COLORS[(time.hour + 1) % 24],
    SKY_COLORS[time.hour],
    (100 * time.minutes) / 60
  );
};
