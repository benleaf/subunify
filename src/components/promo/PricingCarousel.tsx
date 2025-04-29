import { ScreenWidths } from "@/constants/ScreenWidths"
import { Divider, Button, Stack } from "@mui/material"
import GlassCard from "../glassmorphism/GlassCard"
import GlassSpace from "../glassmorphism/GlassSpace"
import GlassText from "../glassmorphism/GlassText"
import { useSize } from "@/hooks/useSize"
import { Delete, Download, List, Upload } from "@mui/icons-material"
import GlassIconText from "../glassmorphism/GlassIconText"
import { useState } from "react"
import Carousel, { ResponsiveType } from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";

const StorageTitle = <GlassIconText size={"big"} icon={<List style={{ fontSize: '2rem' }} color="primary" />}>
    <b>Storage</b>
</GlassIconText>

const StorageText = <Stack spacing={3} margin='1em'>
    <GlassText size="large">
        Only what you use
    </GlassText>
    <GlassText size="moderate" color="primaryLight">
        Your monthly subscription adjusts automatically as you add files.
        Pay only for what you have in you're archive, no need to plan for the future!
    </GlassText>
    <GlassText size="moderate" color="primaryLight">
        If you only have a few files archived your monthly subscription will bottom out at $0.60.
    </GlassText>
    <Button variant="outlined" href='/pricing#storage'>Storage Pricing</Button>
</Stack>

const UploadTitle = <GlassIconText size="big" icon={<Upload style={{ fontSize: '2rem' }} color="primary" />}>
    <b>Upload</b>
</GlassIconText>

const UploadText = <Stack spacing={3} margin='1em'>
    <GlassText size="large">
        Once on upload
    </GlassText>
    <GlassText size="moderate" color="primaryLight">
        Archiving a file has a small fee associated with it, behind the scenes, this is used to cover
        several of our merchants costs most notably the delete fee. Like our monthly subscription there is a minimum upload
        fee.
    </GlassText>
    <Button variant="outlined" href='/pricing#upload'>Upload Pricing</Button>
</Stack>

const DownloadTitle = <GlassIconText size={"big"} icon={<Download style={{ fontSize: '2rem' }} color="primary" />}>
    <b>Download</b>
</GlassIconText>

const DownloadText = <Stack spacing={3} margin='1em'>
    <GlassText size="large">
        Only when needed
    </GlassText>
    <GlassText size="moderate" color="primaryLight">
        Given how little files are downloaded from the archive, we decided not to
        Each time you wish to make a download, a small fee is added to your next subscription payment.
    </GlassText>
    <GlassText size="moderate" color="primaryLight">
        This saves you from paying monthly for something you may never need.
    </GlassText>
    <Button variant="outlined" href='/pricing#download'>Download Pricing</Button>
</Stack>

const DeleteTitle = <GlassIconText size={"big"} icon={<Delete style={{ fontSize: '2rem' }} color="primary" />}>
    <b>Delete</b>
</GlassIconText>

const DeleteText = <Stack spacing={3} margin='1em'>
    <GlassText size="large">
        Always free
    </GlassText>
    <GlassText size="moderate" color="primaryLight">
        Deletions are free of charge and can be performed at any time. If a file is deleted mid-way
        through the month, it will be charged for the time it was in storage during that month on a pro rata basis.
    </GlassText>
    <Button variant="outlined" href='/pricing#delete'>Delete Pricing</Button>
</Stack>

const messages = [
    { title: StorageTitle, text: StorageText },
    { title: UploadTitle, text: UploadText },
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
            partialVisibilityGutter: 40,
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
                    {messages.map(message => <GlassSpace size="tiny">
                        <GlassCard>
                            <GlassSpace size={width > ScreenWidths.Tablet ? "big" : 'small'}>
                                {message.title}
                                {message.text}
                            </GlassSpace>
                        </GlassCard>
                    </GlassSpace>)}
                </Carousel>
            </GlassSpace>
        </div>
    </>
}

export default PricingCarousel