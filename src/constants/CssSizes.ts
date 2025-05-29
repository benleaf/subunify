import { Sizes } from "@/types/Sizes";

export const CssSizes: { [key in Sizes]: string } = {
    fullscreen: '10vw',
    gigantic: 'min(15vw, 5em)',
    massive: 'min(10vw, 3em)',
    huge: 'min(7.5vw, 2.4em)',
    big: 'min(5vw, 1.7em)',
    large: '1.5em',
    moderate: '1em',
    small: '0.8em',
    tiny: '0.5em',
    hairpin: '1px'
}