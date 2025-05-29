import { TextField, InputAdornment } from '@mui/material'

type Props = {
    onChange: (value: string) => void,
    value?: string,
    limit: number,
    label?: string
}

const LimitedText = ({ onChange, value = '', limit = 64, label }: Props) => {
    return <TextField
        fullWidth
        multiline
        value={value}
        minRows={Math.floor(limit / 100)}
        defaultValue={value}
        onChange={(e) => onChange(e.target.value.length > limit ? value : e.target.value)}
        label={label}
        slotProps={{
            input: {
                endAdornment: <InputAdornment position="end">
                    {value.length} / {limit}
                </InputAdornment>
            },
        }}
    />
}

export default LimitedText