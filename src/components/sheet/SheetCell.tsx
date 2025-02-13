import { ElementRef } from "react"
import tableStyle from './table.module.css';

type Props = {
    cornerVisible?: boolean,
    innerRef?: React.Ref<ElementRef<'td'>> | undefined,
    value?: string,
    style?: React.CSSProperties,
    onMouseEnter?: React.MouseEventHandler<HTMLTableCellElement> | undefined,
    onCornerMouseDown?: React.MouseEventHandler<HTMLDivElement>,
}

const SheetCell = ({ cornerVisible, innerRef, value, style, onMouseEnter, onCornerMouseDown }: Props) => {
    return <td
        style={{
            ...style,
            padding: '0.2em',
            position: "relative",
            overflow: 'hidden',
        }}
        className={tableStyle.tableCell}
        ref={innerRef}
        onMouseEnter={onMouseEnter}
    >
        {cornerVisible &&
            <div
                style={{
                    width: '2em',
                    height: '2em',
                    top: '-1em',
                    left: '-1em',
                    position: "absolute",
                    justifyContent: 'center',
                    alignItems: 'center',
                    display: 'flex',
                }}
                onMouseDown={onCornerMouseDown}
            >
                <div style={{
                    width: '50%',
                    height: '50%',
                    backgroundColor: 'red',
                }} />
            </div>
        }
        {value}
    </td >
}

export default SheetCell