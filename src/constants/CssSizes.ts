import { Sizes } from "@/types/Sizes";

export const CssSizes: { [key in Sizes]: string } = {
    fullscreen: 'min(12vw, 10em)',
    gigantic: 'min(10vw, 7em)',
    massive: 'min(8.5vw, 5em)',
    huge: 'min(7.5vw, 2.4em)',
    big: 'min(5vw, 1.7em)',
    large: '1.5em',
    moderate: 'min(5vw, 1em)',
    small: '0.8em',
    tiny: '0.5em',
    hairpin: '2px'
}