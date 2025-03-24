import { DataFormat } from "@/types/DataFormat";
import { Formula } from "./Formula";

export type JsonLogicEquation = {
    formula: Formula,
    variables: string[],
    resultType: DataFormat['type']
}