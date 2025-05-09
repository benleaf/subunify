import { DataGridPro, GridColDef, GridRowSelectionModel, useGridApiRef } from "@mui/x-data-grid-pro"
import { CssSizes } from "@/constants/CssSizes"
import { Button, Checkbox, Chip, CircularProgress, LinearProgress, Stack } from "@mui/material"
import DynamicStack from "../glassmorphism/DynamicStack"
import GlassCard from "../glassmorphism/GlassCard"
import { useEffect, useMemo, useState } from "react"
import { TaggedFile } from "@/pages/FileUpload"
import TagAdder from "../form/TagAdder"
import { Circle, InsertDriveFile } from "@mui/icons-material"
import GlassText from "../glassmorphism/GlassText"
import { useSize } from "@/hooks/useSize"
import { ScreenWidths } from "@/constants/ScreenWidths"
import { generateThumbnail } from "@/images/FilePreview"
import TutorialModal from "../modal/TutorialModal"

type Row = {
    id: number,
    name: string,
    tags: string[],
    findability?: number,
    file: File,
    thumbnail?: string
}

type Props = {
    taggedFiles: TaggedFile[]
    setFiles: React.Dispatch<React.SetStateAction<TaggedFile[]>>
    done: () => void
}

const FileTagger = ({ taggedFiles, setFiles, done }: Props) => {
    const { width } = useSize()
    const apiRef = useGridApiRef();
    const [selected, setSelected] = useState<number[]>([-1])
    useEffect(() => {
        if (!taggedFiles.length) {
            setFiles([
                { file: { name: 'test.png' } as File, tags: ['png', 'Q1'] },
                { file: { name: 'test2.png' } as File, tags: ['png', 'Q2'] },
                { file: { name: 'test3.png' } as File, tags: ['jpg', 'Q3'] },
                { file: { name: 'test4.png' } as File, tags: ['png', 'Q4'] },
            ])
        }
    }, [])

    useEffect(() => {
        const updatePreviews = async () => {
            for (const taggedFile of taggedFiles) {
                const thumbnailPromise = generateThumbnail(taggedFile.file)
                thumbnailPromise.then(thumbnail => setFiles(oldTaggedFiles => {
                    return oldTaggedFiles.map(old => ({
                        ...old,
                        thumbnail: old.file.name == taggedFile.file.name ?
                            thumbnail :
                            old.thumbnail
                    }))
                }))
            }
        }
        updatePreviews()
    }, [])

    const selectedTags = selected.map(index => taggedFiles[index]?.tags)

    const commonSelectedTags = selectedTags.length ? selectedTags.reduce((acc, curr) =>
        acc.filter(item => curr.includes(item))
    ) : []

    const allTags = taggedFiles.flatMap(taggedFile => taggedFile.tags)
        .filter((tag, index, tags) => tags.indexOf(tag) === index)

    const getPercentage = (value?: number) => `${(value ?? 0).toFixed(0)}%`

    const thumbnail = (thumbnail?: string | 'NO_PREVIEW_AVAILABLE') => {
        return <div style={{ display: 'flex', justifyContent: 'center' }}>
            {thumbnail == 'NO_PREVIEW_AVAILABLE' && <InsertDriveFile color="primary" style={{ marginTop: '0.3em' }} />}

            {thumbnail == undefined && <div style={{ marginTop: '0.3em' }}>
                <CircularProgress size={CssSizes.moderate} />
            </div>}

            {typeof thumbnail == 'string' && thumbnail !== 'NO_PREVIEW_AVAILABLE' &&
                <img src={thumbnail} alt="Thumbnail" loading="lazy" />
            }
        </div>
    }

    const columns: GridColDef<Row>[] = [
        {
            field: 'preview',
            headerName: ' ',
            width: 40,
            renderCell: (params: { row: Row }) => thumbnail(params.row.thumbnail)
        },
        { field: 'name', headerName: 'Name' },
        {
            field: 'findability',
            headerName: 'Findability',
            renderCell: (params) => <Stack direction='row' spacing={1} alignItems='center'>
                <Circle style={{ color: `hsl(${((params.row.findability ?? 0) / 10) ** 2}, 100%, 50%)` }} />
                <GlassText size="moderate" color="white">{getPercentage(params.row.findability)}</GlassText>
            </Stack>
        },
        {
            field: 'tag',
            headerName: 'Tags',
            flex: 1,
            align: 'left',
            headerAlign: 'left',
            renderCell: (params: { row: Row }) => params.row.tags.map(tag => <Chip label={tag} sx={{ marginRight: CssSizes.tiny }} />)
        },
    ]

    const rows = taggedFiles.map((file, id) => ({
        id,
        file: file.file,
        name: file.file.name,
        tags: file.tags,
        findability: calculateFindability(file.tags),
        thumbnail: file.thumbnail
    }))

    function calculateFindability(targetTags: string[]) {
        const normalize = (arr: string[]) => [...arr].sort().join("|")
        const targetNormalized = normalize(targetTags)
        const tags = taggedFiles.map(taggedFile => taggedFile.tags)
        const matchCount = tags.filter(tag => normalize(tag) === targetNormalized).length
        return (100 / (matchCount ** (1 / 3)))
    }
    const averageFindability = rows.reduce((sum, row) => sum + row.findability, 0) / rows.length;

    const onRowChecked = (rowSelectionModel: GridRowSelectionModel) => {
        if (selected.length && selected[0] === -1) {
            setSelected([0])
        } else {
            setSelected(rowSelectionModel as number[])
        }
    }

    const getNewTags = (newCommonTags: string[], oldCommonTags: string[], oldTags: string[]) => {
        const commonTagsRemoved = oldTags.filter(oldTag => !oldCommonTags.includes(oldTag) && !newCommonTags.includes(oldTag))
        return [...commonTagsRemoved, ...newCommonTags]
    }

    const setSelectedTags = (tags: string[]) => {
        setFiles(old => old.map(
            (taggedFile, index) => selected.includes(index) ?
                { ...taggedFile, tags: getNewTags(tags, commonSelectedTags, taggedFile.tags) } :
                taggedFile
        ))
    }

    return <div style={{ height: '75vh', display: 'flex', flexDirection: 'column' }}>
        <DynamicStack>
            {selected.length > 0 && selected[0] >= 0 && <GlassCard marginSize="moderate" paddingSize="moderate" flex={1}>
                <TagAdder
                    options={allTags}
                    tags={commonSelectedTags}
                    setTags={setSelectedTags}
                />
            </GlassCard>}
            {width > ScreenWidths.Mobile && <GlassCard marginSize="moderate" paddingSize="moderate" flex={1}>
                <GlassText size="large">Findability</GlassText>
                <GlassText size="moderate">
                    How easy it will be to find a specific file when it's in your Nebula
                </GlassText>
                <Stack direction='row' spacing={1} alignItems='center'>
                    <LinearProgress variant="determinate" value={averageFindability} style={{ flex: 1 }} />
                    <GlassText size="moderate" color="white">{getPercentage(averageFindability)}</GlassText>
                </Stack>
            </GlassCard>}
        </DynamicStack>
        <div style={{ flex: 1, position: 'relative' }}>
            <div style={{ inset: 0, position: 'absolute' }}>
                <DataGridPro
                    apiRef={apiRef}
                    rows={rows}
                    columns={columns}
                    pageSizeOptions={[5, 10]}
                    checkboxSelection
                    rowSelectionModel={selected}
                    onRowSelectionModelChange={onRowChecked}
                    rowHeight={40}
                    autosizeOptions={{
                        expand: true,
                        includeOutliers: true,
                        includeHeaders: true,
                    }}
                />
            </div>
        </div>
        <div style={{ position: 'sticky', bottom: CssSizes.moderate, left: '100%' }}>
            <Button onClick={done} fullWidth variant="contained">Next</Button>
        </div>
        <TutorialModal
            modalName="file-tagging-tutorial"
            children={
                <>
                    <GlassText size='large'>Lets tag some files</GlassText>
                    <GlassText size='moderate'>1. Check the files you want to tag</GlassText>
                    <GlassText size='moderate'>2. Type in the name of a new or existing tag in the edit tags box:</GlassText>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                    </div>
                    <GlassText size='moderate'>3. Repeat until you are happy with your findability score (we recommend 80%)</GlassText>
                </>
            }
        />
    </div>
}

export default FileTagger