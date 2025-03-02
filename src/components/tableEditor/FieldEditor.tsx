import { DataField } from "@/types/DataField"
import { DataFormat } from "@/types/DataFormat"
import { StateMachineDispatch } from "../sheet/SheetTabs"
import { useContext } from "react"
import { TextField } from "@mui/material"

type Props = {
    dataFormat: DataFormat,
    headderField: DataField,
    selectedFieldId: number
}

const FieldEditor = ({ headderField, selectedFieldId }: Props) => {
    const { dispatch } = useContext(StateMachineDispatch)!
    const renameColumn = (value: string) => {
        dispatch({
            action: "renameColumn",
            data: { columnId: selectedFieldId, value }
        })
    }
    return <div>
        <TextField
            fullWidth
            label="Field Name"
            defaultValue={headderField.name}
            onChange={e => renameColumn(e.target.value)}
        />
    </div>
}

export default FieldEditor