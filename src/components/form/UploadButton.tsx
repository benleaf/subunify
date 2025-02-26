import { TableChart } from '@mui/icons-material';
import { Button } from '@mui/material';
import form from './form.module.css';

type Props = {
    onClick: (event: React.ChangeEvent<HTMLInputElement>) => void,
    children: string
}

const UploadButton = ({ onClick, children }: Props) => {
    return <Button
        component="label"
        role={undefined}
        variant="contained"
        style={{ color: 'white', width: '100%' }}
        tabIndex={-1}
        startIcon={<TableChart />}
    >
        {children}
        <input
            className={form.hiddeninput}
            type="file"
            onChange={onClick}
            multiple
        />
    </Button>
}

export default UploadButton