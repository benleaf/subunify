import { StateMachineDispatch } from "@/App"
import { useContext } from "react"
import { TextField } from "@mui/material"
import { isExcelImporter } from "@/stateManagement/stateMachines/getContext"

type Props = {
    defaultValue: string,
    selectedFieldId: number
}

const FieldEditor = ({ defaultValue, selectedFieldId }: Props) => {
    const context = useContext(StateMachineDispatch)!
    if (!isExcelImporter(context)) throw new Error("FieldEditor can only be used within the excelImporter context");
    const { dispatch } = context

    const renameColumn = (value: string) => {
        dispatch({
            action: "modifyColumn",
            data: { columnId: selectedFieldId, value }
        })
    }
    return <div>
        <TextField
            fullWidth
            label="Field Name"
            defaultValue={defaultValue}
            onChange={e => renameColumn(e.target.value)}
        />
    </div>
}

export default FieldEditor