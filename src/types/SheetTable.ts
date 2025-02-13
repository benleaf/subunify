import { BoundingBox } from "@/helpers/BoundingBox"

export type SheetTable = {
    name: string
    parentWorksheetId: number
    head?: BoundingBox
    body?: BoundingBox
}