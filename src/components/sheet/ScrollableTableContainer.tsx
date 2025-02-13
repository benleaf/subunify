import { useContext, useEffect } from "react"
import { StateMachineDispatch } from "./SheetTabs"
import { TableContainer, Paper, Table } from "@mui/material"

type Props = {
    tableRef: React.RefObject<HTMLDivElement>,
    children: React.ReactNode
}

const ScrollableTableContainer = ({ tableRef, children }: Props) => {
    const dispatch = useContext(StateMachineDispatch)!

    const defaultCellDimension = { width: 100, height: 30 }
    const screenDimension = tableRef.current?.getBoundingClientRect() ?? { width: 0, height: 0 }

    useEffect(() => {
        tableRef.current!.onwheel = e => {
            e.preventDefault()
            const first = 100
            dispatch({ action: "scroll", data: { x: e.deltaX / first, y: e.deltaY / first } })
        }
    }, [tableRef])


    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        dispatch({ action: "mouseMoved", data: { x: e.clientX, y: e.clientY } })

        if (tableRef.current) {
            const { top, left, width, height } = tableRef.current.getBoundingClientRect()
            const mousePosProportionX = (e.clientX - left) / width
            const mousePosProportionY = (e.clientY - top) / height

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
        onMouseUp={_ => dispatch({ action: "mouseUp" })}
        onMouseLeave={_ => dispatch({ action: "mouseUp" })}
        onMouseMove={e => handleMouseMove(e)}
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