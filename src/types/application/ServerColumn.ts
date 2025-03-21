import { JsonLogicEquation } from "@/formulas";
import { DataFormat } from "../DataFormat";

export type ServerColumn = {
    id: string,
    type: Omit<DataFormat['type'], 'formula'>,
    name: string,
    options?: string,
} | {
    id: string,
    type: 'formula',
    name: string,
    options?: JsonLogicEquation,
}