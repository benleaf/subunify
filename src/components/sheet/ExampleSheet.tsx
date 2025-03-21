import React from 'react'
import SheetCell from './SheetCell'
import { Colours } from '@/constants/Colours'

type Props = {
    highlights?: boolean[][],
    gridData: string[][],
    style?: React.CSSProperties
}

const defaultCellStyles: React.CSSProperties = {
    borderWidth: 1,
    borderColor: 'lightgray',
    borderStyle: 'solid',
}

const ExampleSheet = ({ highlights, gridData, style }: Props) => {
    return <table style={{ ...style, maxWidth: '100%' }}>
        <tbody>
            {gridData?.map((rows, y) =>
                <tr key={y}>
                    {rows.map((cellDisplayData, x) => <SheetCell
                        key={x}
                        style={{ ...defaultCellStyles, backgroundColor: highlights && highlights[x][y] ? Colours.primaryLight : Colours.white }}
                        cornerVisible={false}
                        value={cellDisplayData}
                    />)}
                </tr>
            )}
        </tbody>
    </table>
}

export default ExampleSheet