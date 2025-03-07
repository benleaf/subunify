import { StateMachineDispatch } from "@/App"
import { Snackbar, Alert } from "@mui/material"
import { useContext } from "react"

const UniversalAlert = () => {
    const { dispatch, state } = useContext(StateMachineDispatch)!

    const close = () => {
        dispatch({ action: 'popup' })
    }

    return <Snackbar
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        open={!!state.data.popup}
        autoHideDuration={4000}
        onClose={close}
    >
        <Alert
            severity={state.data.popup?.colour}
            onClose={close}
        >{state.data.popup?.message}</Alert>
    </Snackbar>
}

export default UniversalAlert