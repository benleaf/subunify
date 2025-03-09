import React, { useContext, useEffect } from "react"
import { TableContainer, Paper, Table } from "@mui/material"
import { Coordinate } from "@/types/spreadsheet/Coordinate"
import { StateMachineDispatch } from "@/App"
import { isExcelImporter } from "@/stateManagement/stateMachines/getContext"

type Props = {
    tableRef: React.RefObject<HTMLDivElement>,
    children: React.ReactNode
}

const ScrollableTableContainer = ({ tableRef, children }: Props) => {
    const context = useContext(StateMachineDispatch)!
    if (!isExcelImporter(context)) throw new Error("ScrollableTableContainer can only be used within the excelImporter context");
    const { dispatch } = context

    const defaultCellDimension = { width: 100, height: 30 }
    const screenDimension = tableRef.current?.getBoundingClientRect() ?? { width: 0, height: 0 }

    useEffect(() => {
        tableRef.current!.onwheel = e => {
            e.preventDefault()
            const first = 100
            dispatch({ action: "scroll", data: { x: e.deltaX / first, y: e.deltaY / first } })
        }
    }, [tableRef])


    const handleMouseMove = (coordinate: Coordinate) => {
        dispatch({ action: "mouseMoved", data: coordinate })

        if (tableRef.current) {
            const { top, left, width, height } = tableRef.current.getBoundingClientRect()
            const mousePosProportionX = (coordinate.x - left) / width
            const mousePosProportionY = (coordinate.y - top) / height

            if (mousePosProportionX < 0.2) dispatch({ action: "mouseNearEdge", data: 'l' })
            if (mousePosProportionX > 0.8) dispatch({ action: "mouseNearEdge", data: 'r' })
            if (mousePosProportionY < 0.2) dispatch({ action: "mouseNearEdge", data: 't' })
            if (mousePosProportionY > 0.8) dispatch({ action: "mouseNearEdge", data: 'b' })

            const activeEdges = [
                mousePosProportionX < 0.2,
                mousePosProportionX > 0.8,
                mousePosProportionY < 0.2,
                mousePosProportionY > 0.8,
            ].filter(Boolean).length

            if (activeEdges === 0 || activeEdges > 1) dispatch({ action: "mouseNearEdge", data: 'RemoveAcceleration' })
        }
    }

    return <TableContainer
        component={Paper}
        style={{
            position: 'relative',
            width: '100%',
            height: '100%',
            overflow: 'hidden',
            userSelect: 'none'
        }}
        ref={tableRef}
        onMouseDown={e => dispatch({ action: "mouseDown", data: { x: e.clientX, y: e.clientY } })}
        onTouchStart={e => dispatch({ action: "mouseDown", data: { x: e.touches[0].clientX, y: e.touches[0].clientY } })}
        onMouseUp={_ => dispatch({ action: "mouseUp" })}
        onTouchEnd={_ => dispatch({ action: "mouseUp" })}
        onMouseLeave={_ => dispatch({ action: "mouseUp" })}
        onMouseMove={e => handleMouseMove({ x: e.clientX, y: e.clientY })}
        onTouchMove={e => handleMouseMove({ x: e.touches[0].clientX, y: e.touches[0].clientY })}
    >
        <Table
            style={{
                width: screenDimension.width + defaultCellDimension.width,
                height: screenDimension.height + defaultCellDimension.height,
                position: 'absolute',
            }}
            stickyHeader
            size="small"
        >
            {children}
        </Table>
    </TableContainer>
}

export default ScrollableTableContainer