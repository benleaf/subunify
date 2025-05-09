import { ScreenWidths } from "@/constants/ScreenWidths"
import { Button, Stack } from "@mui/material"
import GlassCard from "../glassmorphism/GlassCard"
import GlassSpace from "../glassmorphism/GlassSpace"
import GlassText from "../glassmorphism/GlassText"
import { useSize } from "@/hooks/useSize"
import { Looks3, Looks4, LooksOne, LooksTwo } from "@mui/icons-material"
import GlassIconText from "../glassmorphism/GlassIconText"
import Carousel, { ResponsiveType } from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";

const UploadTitle = <>
    <GlassIconText size="big" icon={<LooksOne style={{ fontSize: '2rem' }} color="primary" />}>
        <b>Upload</b>
    </GlassIconText>
    <GlassText size="large">
        Once on upload
    </GlassText>
</>

const UploadText = <Stack spacing={3} margin='1em'>
    <GlassText size="moderate" color="primaryLight">
        Archiving a file has a small fee associated with it, behind the scenes, this is used to cover
        several of our merchants costs most notably the delete fee. Like our monthly subscription there is a minimum upload
        fee.
    </GlassText>
    <Button variant="outlined" href='/pricing#upload'>Upload Pricing</Button>
</Stack>

const StorageTitle = <>
    <GlassIconText size={"big"} icon={<LooksTwo style={{ fontSize: '2rem' }} color="primary" />}>
        <b>Storage</b>
    </GlassIconText>
    <GlassText size="large">
        Only what you use
    </GlassText>
</>

const StorageText = <Stack spacing={3} margin='1em'>
    <GlassText size="moderate" color="primaryLight">
        Your monthly subscription adjusts automatically as you add and remove files.
        Pay only for what you have in your archive, for the time it is there.
    </GlassText>
    <GlassText size="moderate" color="primaryLight">
        Your monthly subscription starts at $0.60.
    </GlassText>
    <Button variant="outlined" href='/pricing#storage'>Storage Pricing</Button>
</Stack>

const DownloadTitle = <>
    <GlassIconText size={"big"} icon={<Looks3 style={{ fontSize: '2rem' }} color="primary" />}>
        <b>Download</b>
    </GlassIconText>
    <GlassText size="large">
        Only when needed
    </GlassText>
</>

const DownloadText = <Stack spacing={3} margin='1em'>
    <GlassText size="moderate" color="primaryLight">
        Given how infrequently files are downloaded from the archive, it made sense to make them a one
        time fee rather then hiding the cost in the subscription.
    </GlassText>
    <GlassText size="moderate" color="primaryLight">
        This saves you from paying monthly for something you may never need.
    </GlassText>
    <Button variant="outlined" href='/pricing#download'>Download Pricing</Button>
</Stack>

const DeleteTitle = <>
    <GlassIconText size={"big"} icon={<Looks4 style={{ fontSize: '2rem' }} color="primary" />}>
        <b>Delete</b>
    </GlassIconText>
    <GlassText size="large">
        Always free
    </GlassText>
</>

const DeleteText = <Stack spacing={3} margin='1em'>
    <GlassText size="moderate" color="primaryLight">
        There is one action we refuse to charge for, that we believe should always be free and have no strings attached.
        Deletions are free of charge and can be performed at any time.

    </GlassText>
</Stack>

const messages = [
    { title: UploadTitle, text: UploadText },
    { title: StorageTitle, text: StorageText },
    { title: DownloadTitle, text: DownloadText },
    { title: DeleteTitle, text: DeleteText },
]

const PricingCarousel = () => {
    const { width } = useSize()
    const responsive: ResponsiveType = {
        desktop: {
            partialVisibilityGutter: 30,
            breakpoint: { max: 3000, min: ScreenWidths.Tablet },
            items: 2,
        },
        tablet: {
            partialVisibilityGutter: 50,
            breakpoint: { max: ScreenWidths.Tablet, min: ScreenWidths.Mobile },
            items: 1,
        },
        mobile: {
            partialVisibilityGutter: 20,
            breakpoint: { max: ScreenWidths.Mobile, min: 0 },
            items: 1,
        }
    };

    return <>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }}>
            <GlassSpace size="large" style={{ height: '100%', maxWidth: ScreenWidths.Mobile, width: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <GlassText size="huge">We do subscriptions <i>different</i></GlassText>
                <Stack spacing={3} margin='1em'>
                    <GlassText size="big" color="primaryLight">
                        We've built our subscription model from the ground up to work best for you. A mix of pay monthly and pay as you go
                        puts you in control.
                    </GlassText>
                </Stack>
                <Carousel
                    partialVisible={true}
                    showDots={true}
                    responsive={responsive}
                    infinite={true}
                    removeArrowOnDeviceType={["tablet", "mobile"]}
                >
                    {messages.map((message, index) => <GlassSpace size="tiny" key={index}>
                        <GlassCard>
                            <GlassSpace size={width > ScreenWidths.Tablet ? "big" : 'small'}>
                                {message.title}
                                <div style={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    height: width > ScreenWidths.Mobile ? 300 : 400,
                                    justifyContent: 'center'
                                }}>
                                    {message.text}
                                </div>
                            </GlassSpace>
                        </GlassCard>
                    </GlassSpace>)}
                </Carousel>
            </GlassSpace>
        </div>
    </>
}

export default PricingCarousel