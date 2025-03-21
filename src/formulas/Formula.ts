import { Operation } from "./Operation";

export type Formula = Operation | number | { var: string } | undefined