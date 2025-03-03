import { ElementRef } from "react"
import tableStyle from './table.module.css';
import GlassText from "../glassmorphism/GlassText";
import { Colours } from "@/constants/Colours";

type Props = {
    cornerVisible?: boolean,
    innerRef?: React.Ref<ElementRef<'td'>> | undefined,
    value?: string,
    style?: React.CSSProperties,
    onMouseEnter?: React.MouseEventHandler<HTMLTableCellElement> | undefined,
    onCornerMouseDown?: () => void,
}

const SheetCell = ({ cornerVisible, innerRef, value, style, onMouseEnter, onCornerMouseDown }: Props) => {
    return <td
        style={{
            ...style,
            padding: '0.5em',
            position: "relative",
            overflow: 'hidden'
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
                onTouchStart={onCornerMouseDown}
            >
                <div style={{
                    width: '50%',
                    height: '50%',
                    backgroundColor: Colours.primary,
                }} />
            </div>
        }
        <GlassText size="small">
            {value}
        </GlassText>
    </td >
}

export default SheetCell