import { DataField } from "@/types/DataField"
import { DataFormat } from "@/types/DataFormat"
import { StateMachineDispatch } from "../sheet/SheetTabs"
import { useContext } from "react"
import { Input, TextField } from "@mui/material"

type Props = {
    dataFormat: DataFormat,
    headderField: DataField,
    selectedFieldId: number
}

const FieldEditor = ({ dataFormat, headderField, selectedFieldId }: Props) => {
    const dispatch = useContext(StateMachineDispatch)!
    const renameColumn = (value: string) => {
        dispatch({
            action: "renameColumn",
            data: { columnId: selectedFieldId, value }
        })
    }
    switch (dataFormat.type) {
        case 'formula':
            return <div>formula</div>
        case 'number':
            return <div>number</div>
        case 'text':
            return <div>
                <TextField
                    label="Field Name"
                    defaultValue={headderField.name}
                    onChange={e => renameColumn(e.target.value)}
                />
            </div>
        case 'date':
            return <div>date</div>
        case 'boolean':
            return <div>boolean</div>
        default:
            return <div>unknown</div>
    }
}

export default FieldEditor