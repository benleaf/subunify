import ColorGlassCard from "@/components/glassmorphism/ColorGlassCard"
import GlassText from "@/components/glassmorphism/GlassText"
import { CssSizes } from "@/constants/CssSizes"
import { useDashboard } from "@/contexts/DashboardContext"
import { useThumbnail } from "@/contexts/ThumbnailContext"
import { ClusterManager } from "@/helpers/ClusterManager"
import { ClusterResult, StoredFile } from "@/types/server/ProjectResult"
import { Stack, Divider, Button } from "@mui/material"
import Carousel, { ResponsiveType } from "react-multi-carousel"

type Props = {
    files: StoredFile[]
}

const CAROUSEL_HEIGHT = 300

const ClusterLayout = ({ files }: Props) => {
    const { getUrl } = useThumbnail()
    const { updateProperties } = useDashboard()

    const clusters: ClusterResult[] = ClusterManager.getClusters(files)
    const responsive: ResponsiveType = {
        desktop: {
            breakpoint: { max: Infinity, min: 0 },
            items: 1,
        }
    };

    const getCarosellFiles = (files: StoredFile[]) => {
        return files.filter(file => file.proxyState == 'COMPLETE')
    }

    return (
        <>
            {clusters!.map(cluster =>
                <ColorGlassCard style={{ minWidth: 'max(30%, 300px)' }} paddingSize="small" marginSize="tiny" flex={1}>
                    <div style={{ position: 'absolute', left: 0, top: -5, right: 0, height: CAROUSEL_HEIGHT }}>
                        <div style={{ overflow: 'hidden', backgroundColor: 'black', height: CAROUSEL_HEIGHT, objectFit: 'contain' }}>
                            <Carousel
                                showDots={cluster.fileCount <= 10}
                                responsive={responsive}
                                infinite={true}
                                removeArrowOnDeviceType={["tablet", "mobile"]}
                            >
                                {getCarosellFiles(cluster.files).map(file =>
                                    <div style={{ height: CAROUSEL_HEIGHT, width: '100%' }} key={file.id}>
                                        <GlassText
                                            size="moderate"
                                            color="white"
                                            style={{ position: 'absolute', top: CssSizes.tiny, left: CssSizes.hairpin, backgroundColor: 'rgba(0, 0, 0, 0.5)', paddingInline: CssSizes.tiny, borderRadius: CssSizes.tiny }}
                                        >{file.name}</GlassText>
                                        {getUrl(file) && <img src={getUrl(file)} loading="lazy" height={CAROUSEL_HEIGHT} width='100%' style={{ objectFit: 'cover' }} />}
                                    </div>
                                )}
                                <Stack style={{ height: CAROUSEL_HEIGHT, width: '100%', padding: CssSizes.tiny }} key='preview'>
                                    {cluster.files.map(file =>
                                        <GlassText
                                            size="moderate"
                                            color="white"
                                            style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)', paddingInline: CssSizes.tiny, borderRadius: CssSizes.tiny }}
                                        >{file.name}</GlassText>
                                    )}
                                </Stack>
                            </Carousel>
                        </div>
                    </div>

                    <div style={{ height: CAROUSEL_HEIGHT }} />
                    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', flex: 1 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div>
                                <GlassText size="large">{cluster.name}</GlassText>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <Divider orientation="vertical" style={{ height: 50, marginInline: 10 }} />
                                <div style={{ width: 40 }}>
                                    <GlassText size="large">{cluster.fileCount}</GlassText>
                                    <GlassText size="small">Files</GlassText>
                                </div>
                            </div>
                        </div>
                        <Button variant="outlined" fullWidth onClick={() => updateProperties({ page: 'cluster', selectedCluster: cluster })}>View</Button>
                    </div>
                </ColorGlassCard>
            )}
            {clusters?.length > 0 && <div style={{ flex: 1, minWidth: 'max(30%, 300px)', display: 'flex', height: 300, margin: 20 }} />}
            {clusters?.length > 0 && <div style={{ flex: 1, minWidth: 'max(30%, 300px)', display: 'flex', height: 300, margin: 20 }} />}
            {clusters?.length > 0 && <div style={{ flex: 1, minWidth: 'max(30%, 300px)', display: 'flex', height: 300, margin: 20 }} />}
        </>
    )
}

export default ClusterLayout