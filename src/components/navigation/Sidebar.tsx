import { useSize } from "../../hooks/useSize"
import { FileUpload, ListAlt } from "@mui/icons-material"
import { List, ListItem, ListItemButton, ListItemIcon, Stack } from "@mui/material"
import GlassText from "../glassmorphism/GlassText"
import { ComponentSizes } from "@/constants/ComponentSizes"
import { CssSizes } from "@/constants/CssSizes"

const Sidebar = () => {
    const { height } = useSize()

    return <div style={{
        height: height - ComponentSizes.topBar,
        width: ComponentSizes.sideBar,
        overflow: 'scroll',
        scrollbarWidth: 'none'
    }}>
        <Stack margin={CssSizes.moderate}>
            <GlassText size="moderate">File Management</GlassText>
            <List dense>
                <ListItem disablePadding>
                    <ListItemButton href="/deep-storage">
                        <ListItemIcon>
                            <ListAlt />
                        </ListItemIcon>
                        <GlassText size="small">File Download</GlassText>
                    </ListItemButton>
                </ListItem>
                <ListItem disablePadding>
                    <ListItemButton href="/file-upload">
                        <ListItemIcon>
                            <FileUpload />
                        </ListItemIcon>
                        <GlassText size="small">File Upload</GlassText>
                    </ListItemButton>
                </ListItem>
            </List>
        </Stack>
    </div>
}

export default Sidebar