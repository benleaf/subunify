import { Close } from '@mui/icons-material'
import { Modal, Fab } from '@mui/material'
import React, { CSSProperties } from 'react'
import GlassCard from '../glassmorphism/GlassCard'


type Props = {
    children: React.ReactNode,
    state: boolean
    close?: (e: {}, reason?: string) => void
    maxWidth?: CSSProperties['maxWidth']
}

const BaseModal = ({ children, close, state, maxWidth = 500 }: Props) => {
    const style: CSSProperties = {
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: "95%",
        position: "relative",
        maxWidth,
    }

    return <Modal
        open={state}
        onClose={close}
    >
        <div style={style}>
            {close && <Fab
                color="primary"
                onClick={close}
                size='small'
                style={{ position: "absolute", right: -5, top: -5 }}
            >
                <Close />
            </Fab>}
            <GlassCard>
                <div style={{ maxHeight: '95vh', overflowY: 'scroll', scrollbarWidth: 'none' }}>
                    {children}
                </div>
            </GlassCard>
        </div>
    </Modal>
}

export default BaseModal