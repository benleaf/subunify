import { StateMachineDispatch } from "@/App"
import { Snackbar, Alert } from "@mui/material"
import { useContext, useEffect } from "react"

const UniversalAlert = () => {
    const { dispatch, state } = useContext(StateMachineDispatch)!

    const close = () => {
        dispatch({ action: 'popup' })
    }

    useEffect(() => {
        setTimeout(() => {
            close()
        }, 5000)
    }, [state.data.popup?.message])


    return <Snackbar
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        open={!!state.data.popup?.message}
        autoHideDuration={2000}
        onClose={close}
    >
        <Alert
            severity={state.data.popup?.colour}
            onClose={close}
        >{state.data.popup?.message}</Alert>
    </Snackbar>
}

export default UniversalAlert