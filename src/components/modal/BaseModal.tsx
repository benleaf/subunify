import { Close } from '@mui/icons-material'
import { Modal, Card, Fab } from '@mui/material'
import React, { CSSProperties } from 'react'

const style: CSSProperties = {
    position: 'absolute' as 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: "95%",
    maxWidth: 800,
}

type Props = {
    children: React.ReactNode,
    state: "open" | "closed"
    close: () => void
}

const BaseModal = ({ children, close, state }: Props) => {
    return <Modal
        open={state === "open"}
        onClose={close}
    >
        <>
            <div style={{ ...style, position: "relative" }}>
                <Fab
                    color="primary"
                    onClick={close}
                    size='small'
                    style={{ position: "absolute", right: -5, top: -5 }}
                >
                    <Close />
                </Fab>
                <Card style={{ padding: 30, maxHeight: '95vh', overflow: 'scroll' }}>
                    {children}
                </Card>
            </div>
        </>
    </Modal>
}

export default BaseModal