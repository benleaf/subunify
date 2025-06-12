import { Snackbar, Alert, AlertColor } from "@mui/material"

type Props = {
    message?: string
    severity?: AlertColor,
    close?: () => void
}

const UniversalAlert = ({ message, close, severity }: Props) => {
    return <Snackbar
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        open={!!message}
        autoHideDuration={4000}
        onClose={close}
    >
        <Alert
            severity={severity}
            onClose={close}
        >{message}</Alert>
    </Snackbar>
}

export default UniversalAlert