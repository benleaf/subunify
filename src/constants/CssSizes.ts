import { Sizes } from "@/types/Sizes";

export const CssSizes: { [key in Sizes]: string } = {
    fullscreen: '10vw',
    gigantic: 'min(15vw, 5em)',
    huge: 'min(10vw, 3em)',
    big: 'min(5vw, 1.7em)',
    large: '1.5em',
    moderate: '1em',
    small: '0.8em',
    tiny: '0.5em',
    hairpin: '1px'
}