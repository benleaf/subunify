import { CloudUpload } from '@mui/icons-material';
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
        tabIndex={-1}
        startIcon={<CloudUpload />}
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