import { CssSizes } from '@/constants/CssSizes'
import { FormControlLabel, Checkbox, FormGroup, TextField, Button, Stack } from '@mui/material'
import { GridColDef } from '@mui/x-data-grid'
import { useState } from 'react'

type Props = {
    columns: GridColDef[]
    onSubmit: (values: { [key: string]: any }) => any
}


const ColumnForm = ({ columns, onSubmit }: Props) => {
    const [values, setValues] = useState({})
    const handleChange = (field: string) => (value: any) => {
        setValues({ ...values, [field]: value })
    }

    const getInputComponent = (column: GridColDef, onChange: (value: any) => void) => {
        switch (column.type) {
            case 'boolean':
                return <FormControlLabel
                    label={column.headerName}
                    control={<Checkbox onChange={e => onChange(e.target.checked)} />}
                />
            case 'number':
                return <TextField
                    type='number'
                    label={column.headerName}
                    variant="outlined"
                    onChange={e => onChange(e.target.value)}
                />
            default:
                return <TextField
                    multiline
                    label={column.headerName}
                    variant="outlined"
                    onChange={e => onChange(e.target.value)}
                />
        }
    }

    return <FormGroup>
        <div style={{ maxHeight: '60vh', overflowY: 'scroll', paddingBottom: CssSizes.small }}>
            <Stack spacing={1}>
                {columns.filter(column => column.editable).map((column, id) =>
                    <div key={id} style={{ display: 'flex', flexDirection: 'column' }}>
                        {getInputComponent(column, handleChange(column.field))}
                    </div>
                )}
            </Stack>
        </div>
        <Button variant='contained' onClick={() => onSubmit(values)}>Submit</Button>
    </FormGroup>
}

export default ColumnForm