import GlassSpace from "../glassmorphism/GlassSpace"
import GlassText from "../glassmorphism/GlassText"
import { Divider } from "@mui/material";
import { Colours } from "@/constants/Colours";

const WhatWeAreFor = () => {
    return <div style={{ display: 'flex', justifyContent: 'center' }}>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
            <GlassSpace size="tiny" style={{ maxWidth: 800 }}>
                <GlassText size="big" style={{ textAlign: 'center' }}>
                    Hyper Fast File Storage And Sharing
                </GlassText>
            </GlassSpace>
        </div>
    </div>
}

export default WhatWeAreFor