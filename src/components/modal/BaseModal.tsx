import { Close } from '@mui/icons-material'
import { Modal, Fab } from '@mui/material'
import React, { CSSProperties } from 'react'
import GlassCard from '../glassmorphism/GlassCard'


type Props = {
    children: React.ReactNode,
    state: "open" | "closed"
    close?: () => void
    maxWidth?: CSSProperties['maxWidth']
}

const BaseModal = ({ children, close, state, maxWidth = 500 }: Props) => {
    const style: CSSProperties = {
        position: 'absolute' as 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: "95%",
        maxWidth,
        backgroundColor: '#fff0'
    }

    return <Modal
        hideBackdrop
        open={state === "open"}
        onClose={close}
    >
        <>
            <div style={{ ...style, position: "relative" }}>
                {close && <Fab
                    color="primary"
                    onClick={close}
                    size='small'
                    style={{ position: "absolute", right: -5, top: -5 }}
                >
                    <Close />
                </Fab>}
                <GlassCard>
                    {children}
                </GlassCard>
            </div>
        </>
    </Modal>
}

export default BaseModal