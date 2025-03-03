import { ReactNode } from "react"
import { Box, CssBaseline, IconButton, styled, SwipeableDrawer } from "@mui/material"
import { Global } from "@emotion/react"
import { grey } from "@mui/material/colors"
import React from "react"
import { ArrowUpward } from "@mui/icons-material"
import GlassText from "./GlassText"
import GlassSpace from "./GlassSpace"
import { ScreenWidths } from "@/constants/ScreenWidths"
import { useSize } from "@/hooks/useSize"

type Props = {
    children?: ReactNode | ReactNode[]
    drawLabel: string
}

const Root = styled('div')(({ theme }) => ({
    height: '100%',
    backgroundColor: grey[100],
    ...theme.applyStyles('dark', {
        backgroundColor: theme.palette.background.default,
    }),
}));

const StyledBox = styled('div')(({ theme }) => ({
    backgroundColor: '#fff',
    ...theme.applyStyles('dark', {
        backgroundColor: grey[800],
    }),
}));

const Puller = styled('div')(({ theme }) => ({
    width: 30,
    height: 6,
    backgroundColor: grey[300],
    borderRadius: 3,
    position: 'absolute',
    top: 8,
    left: 'calc(50% - 15px)',
    ...theme.applyStyles('dark', {
        backgroundColor: grey[900],
    }),
}));

const DynamicDrawer = ({ children, drawLabel }: Props) => {
    const drawerBleeding = 56;
    const { width } = useSize()
    const [open, setOpen] = React.useState(false);

    const toggleDrawer = (newOpen: boolean) => () => {
        setOpen(newOpen);
    };

    return width > ScreenWidths.Mobile ?
        <div>{children}</div> :
        <Root>
            <CssBaseline />
            <Global
                styles={{
                    '.MuiDrawer-root > .MuiPaper-root': {
                        height: `calc(90% - ${drawerBleeding}px)`,
                        overflow: 'visible',
                    },
                }}
            />
            <div style={{ textAlign: 'center', position: 'absolute', top: `calc(90% - ${drawerBleeding}px)`, left: 0, right: 0 }}>
                <Box>
                    <IconButton onClick={toggleDrawer(true)}><ArrowUpward /></IconButton>
                </Box>
            </div>
            <SwipeableDrawer
                anchor="bottom"
                open={open}
                onClose={toggleDrawer(false)}
                onOpen={toggleDrawer(true)}
                swipeAreaWidth={drawerBleeding}
                disableSwipeToOpen={false}
                keepMounted
            >
                <StyledBox
                    sx={{
                        position: 'absolute',
                        top: -drawerBleeding,
                        borderTopLeftRadius: 8,
                        borderTopRightRadius: 8,
                        visibility: 'visible',
                        right: 0,
                        left: 0,
                    }}
                >
                    <Puller />
                    <GlassSpace size="tiny">
                        <GlassText size="large">{drawLabel}</GlassText>
                    </GlassSpace>
                </StyledBox>
                {children}
            </SwipeableDrawer>
        </Root>
}

export default DynamicDrawer