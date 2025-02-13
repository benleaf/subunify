import { Orientation } from "@/types/Orientation";
import { Direction } from "../types/Direction";
import { Coordinate } from "@/types/Coordinate";
import { CSSProperties } from "react";

export type Box = {
    ['bl']: Coordinate,
    ['br']: Coordinate,
    ['tl']: Coordinate,
    ['tr']: Coordinate,
}

export class BoundingBox {
    public box: Box
    constructor(box: Box) {
        this.box = box
    }

    public inBoundingBox(possition: Coordinate) {
        const withinX = possition.x >= this.box.tl.x && possition.x <= this.box.tr.x
        const withinY = possition.y >= this.box.tl.y && possition.y <= this.box.bl.y
        return withinX && withinY
    }

    public getCorner(possition: Coordinate) {
        if (possition.x == this.box.tl.x && possition.y == this.box.tl.y) {
            return 'tl'
        } else if (possition.y == this.box.tr.y && possition.x - 1 == this.box.tr.x) {
            return 'tr'
        } else if (possition.y - 1 == this.box.bl.y && possition.x == this.box.bl.x) {
            return 'bl'
        } else if (possition.y - 1 == this.box.br.y && possition.x - 1 == this.box.br.x) {
            return 'br'
        }
    }

    public getEdge(possition: Coordinate) {
        if (possition.y == this.box.tl.y && possition.x < this.box.tr.x && possition.x >= this.box.tl.x) {
            return 't'
        } else if (possition.y == this.box.bl.y && possition.x < this.box.tr.x && possition.x >= this.box.tl.x) {
            return 'b'
        } else if (possition.x == this.box.tl.x && possition.y <= this.box.tl.y && possition.y > this.box.bl.y) {
            return 'l'
        } else if (possition.x == this.box.tr.x && possition.y <= this.box.tr.y && possition.y > this.box.br.y) {
            return 'r'
        }
    }

    public getCellIndex(possition: Coordinate) {
        const x = possition.x - this.box.tl.x
        const y = possition.y - this.box.tl.y

        return BoundingBox.getOrientation(this) == 'x' ? x : y
    }

    public static getResizedBoxViaAnchor(newPossition: Coordinate, anchorPossition: Coordinate) {
        const safeNewPos = {
            minX: Math.min(newPossition.x, anchorPossition.x),
            minY: Math.min(newPossition.y, anchorPossition.y),
            maxX: Math.max(newPossition.x, anchorPossition.x),
            maxY: Math.max(newPossition.y, anchorPossition.y),
        }

        return new BoundingBox({
            'tl': { x: safeNewPos.minX, y: safeNewPos.minY },
            'tr': { x: safeNewPos.maxX, y: safeNewPos.minY },
            'bl': { x: safeNewPos.minX, y: safeNewPos.maxY },
            'br': { x: safeNewPos.maxX, y: safeNewPos.maxY },
        })
    }

    public static moveEdge(box: BoundingBox, edge: Direction, newPossition: Coordinate) {
        const newBox = BoundingBox.clone(box)
        const opositeCorner = this.getOpositeDirection(edge) as keyof typeof newBox.box
        const safeNewPos = {
            minX: Math.min(newPossition.x, newBox.box[opositeCorner].x),
            minY: Math.min(newPossition.y, newBox.box[opositeCorner].y),
            maxX: Math.max(newPossition.x, newBox.box[opositeCorner].x),
            maxY: Math.max(newPossition.y, newBox.box[opositeCorner].y),
        }

        if (edge == 'tl') {
            newBox.box.tl = { x: safeNewPos.minX, y: safeNewPos.minY }
            newBox.box.tr.y = safeNewPos.minY
            newBox.box.bl.x = safeNewPos.minX
        } else if (edge == 'tr') {
            newBox.box.tr = { x: safeNewPos.maxX, y: safeNewPos.minY }
            newBox.box.tl.y = safeNewPos.minY
            newBox.box.br.x = safeNewPos.maxX
        } else if (edge == 'bl') {
            newBox.box.bl = { x: safeNewPos.minX, y: safeNewPos.maxY }
            newBox.box.tl.x = safeNewPos.minX
            newBox.box.br.y = safeNewPos.maxY
        } else if (edge == 'br') {
            newBox.box.br = { x: safeNewPos.maxX, y: safeNewPos.maxY }
            newBox.box.tr.x = safeNewPos.maxX
            newBox.box.bl.y = safeNewPos.maxY
        }

        return newBox
    }

    private static getOpositeDirection(direction: Direction) {
        return {
            'b': 't',
            'bl': 'tr',
            'br': 'tl',
            'l': 'r',
            'r': 'l',
            't': 'b',
            'tl': 'br',
            'tr': 'bl',
        }[direction] as Direction
    }

    public static clone(box: BoundingBox): BoundingBox {
        return new BoundingBox(JSON.parse(JSON.stringify(box.box)))
    }

    public static getOrientation(box: BoundingBox): Orientation {
        const width = box.box.tr.x - box.box.tl.x
        const height = box.box.br.y - box.box.tr.y
        return width > height ? "x" : "y"
    }

    public static swapOrientation(orientation: Orientation) {
        return orientation == "x" ? "y" : "x"
    }

    public static getOriantationAlignedOffset(box: BoundingBox, possition: Coordinate) {
        const orientation = BoundingBox.getOrientation(box)
        const alignment = BoundingBox.swapOrientation(orientation)
        const newBox = BoundingBox.clone(box)
        for (const direction of Object.keys(newBox.box)) {
            newBox.box[direction as keyof typeof newBox.box][alignment] = possition[alignment]
        }
        return newBox
    }

    public static getResizedBoxViaAnchorAndAxis(newPossition: Coordinate, anchorPossition: Coordinate, box: BoundingBox, orientation: Orientation) {
        const newBox = BoundingBox.clone(box)
        const staticOrientation = BoundingBox.swapOrientation(orientation)

        const newTl = {
            [orientation]: anchorPossition[orientation] < newPossition[orientation] ? box.box.tl[orientation] : newPossition[orientation],
            [staticOrientation]: newBox.box.tl[staticOrientation]
        } as Coordinate

        const newBr = {
            [orientation]: anchorPossition[orientation] > newPossition[orientation] ? box.box.br[orientation] : newPossition[orientation],
            [staticOrientation]: newBox.box.br[staticOrientation]
        } as Coordinate

        newBox.box = {
            tl: newTl,
            tr: { x: newBr.x, y: newTl.y },
            bl: { x: newTl.x, y: newBr.y },
            br: newBr,
        }

        return newBox
    }

    public getCellStyles(cell: Coordinate, selected: boolean): CSSProperties {
        const cellEdge = {
            t: this.inBoundingBox(cell) && cell.y == this.box.tl.y,
            r: this.inBoundingBox(cell) && cell.x == this.box.tr.x,
            b: this.inBoundingBox(cell) && cell.y == this.box.bl.y,
            l: this.inBoundingBox(cell) && cell.x == this.box.tl.x
        }

        return {
            borderTopColor: cellEdge.t ? '#f00' : 'lightgray',
            borderRightColor: cellEdge.r ? '#f00' : 'lightgray',
            borderBottomColor: cellEdge.b ? '#f00' : 'lightgray',
            borderLeftColor: cellEdge.l ? '#f00' : 'lightgray',
            borderTopWidth: cellEdge.t ? 2 : 1,
            borderRightWidth: cellEdge.r ? 2 : 1,
            borderBottomWidth: cellEdge.b ? 2 : 1,
            borderLeftWidth: cellEdge.l ? 2 : 1,
            borderTopStyle: cellEdge.t && selected ? 'dashed' : 'solid',
            borderRightStyle: cellEdge.r && selected ? 'dashed' : 'solid',
            borderBottomStyle: cellEdge.b && selected ? 'dashed' : 'solid',
            borderLeftStyle: cellEdge.l && selected ? 'dashed' : 'solid',
            backgroundColor: this.inBoundingBox(cell) ? '#f001' : '#0000',
        }
    }
}