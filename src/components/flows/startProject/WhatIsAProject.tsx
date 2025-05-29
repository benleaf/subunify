import GlassSpace from "../../glassmorphism/GlassSpace";
import GlassText from "../../glassmorphism/GlassText";

const WhatIsAProject = () => {
    return <>
        <GlassText size='massive' style={{}}>
            Unlocking <b>Power</b>
        </GlassText>
        <GlassText size='large' style={{}}>
            Projects allow you to share faster, collaborate sooner and deliver better.
        </GlassText>
        <GlassText size='moderate' style={{}}>
            <ol>
                <li>Name your project</li>
                <li>Invite collaborators</li>
                <li>Select a package and start sharing media today!</li>
            </ol>
        </GlassText>

        <GlassSpace size='small' />
    </>
}

export default WhatIsAProject