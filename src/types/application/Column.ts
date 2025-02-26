import { DataFormat } from "../DataFormat";

export type Column = {
    id: string,
    name: string,
    type: DataFormat['type'],
}