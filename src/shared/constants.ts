import { faDiceD20, faDragon, faFire, faMeteor, faSkullCrossbones, faSquare, faStar } from "@fortawesome/free-solid-svg-icons";

export const requiredError = "${label} is required";
export const numberError = "${label} must be an integer number";
export const minError = "${label} can't be less than ${min}";
export const maxError = "${label} can't be more than ${max}";
export const minLengthError = "${label} can't be less than ${min} characters";
export const maxLengthError = "${label} can't be more than ${max} characters";
export const dayMaxError = "${label} can't be more than the number of days in the month";

export const EventIcon = {
    square: faSquare,
    star: faStar,
    dice: faDiceD20,
    fire: faFire,
    meteor: faMeteor,
    skull: faSkullCrossbones,
    dragon: faDragon
}

export const SKY_COLORS = [
    "#011126",
    "#011126",
    "#011126",
    "#011126",
    "#1d3273",
    "#464696",
    "#4f6ea0",
    "#567AA7", // "#5c96b3",
    "#5E86AD", // "#74abc0",
    "#6592B4", // "#78b6c2",
    "#6592B4", // "#78b6c2",
    "#6592B4", // "#78b6c2",
    "#6592B4", // "#78b6c2",
    "#6592B4", // "#78b6c2",
    "#6592B4", // "#78b6c2",
    "#6592B4", // "#78b6c2",
    "#5E86AD", // "#74abc0",
    "#567AA7", // "#5c96b3",
    "#4f6ea0",
    "#464696",
    "#1d3273",
    "#011126",
    "#011126",
    "#011126",
] as const