import { Direction } from "./Direction";

export type Corner = Extract<Direction, 'tl' | 'tr' | 'bl' | 'br'>