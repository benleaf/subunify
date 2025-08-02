import { StoredFile } from "@/types/server/ProjectResult"
import { Stack, TextField, Button, Fab, Autocomplete, Chip, IconButton, createFilterOptions, Divider, Tooltip, Select, MenuItem, InputLabel, FormControl } from "@mui/material"
import GlassSpace from "../glassmorphism/GlassSpace"
import BaseModal from "./BaseModal"
import { Add, Close, Done, FolderShared, Warning } from "@mui/icons-material"
import GlassIconText from "../glassmorphism/GlassIconText"
import { useDashboard } from "@/contexts/DashboardContext"
import { ElementRef, useEffect, useRef, useState } from "react"
import ColorGlassCard from "../glassmorphism/ColorGlassCard"
import GlassText from "../glassmorphism/GlassText"
import { useAuth } from "@/contexts/AuthContext"
import { isError } from "@/api/isError"
import { Collaborator } from "@/types/Collaborator"
import Profile from "../form/Profile"
import { useThumbnail } from "@/contexts/ThumbnailContext"
import { Bundle } from "@/types/Bundle"
import { ProxySettingLabels } from "@/constants/ProxySettingLabels"
import { validateEmail } from "@/helpers/ValidateEmail"
import { useAction } from "@/contexts/actions/infrastructure/ActionContext"
import { ProxySettingTypes } from "@/types/server/ProxySettingTypes"

type Props = {
    file: StoredFile
    state: boolean
    close: () => void
}

type AddMessageProps = {
    bundle?: State['selectedBundle']
    file: StoredFile
    onNext: () => void
}

const AddMessage = ({ file, onNext, bundle }: AddMessageProps) => {
    const { addFileToSharedBundle } = useAction()
    const { getUrl } = useThumbnail()
    const [message, setMessage] = useState<string>()
    const [downloadType, setDownloadType] = useState<ProxySettingTypes>('RAW')

    const createBundle = async () => {
        if (!bundle?.id) return
        const success = await addFileToSharedBundle(file.id, downloadType, message, bundle)
        if (success) onNext()
    }

    return <Stack spacing={2} overflow='hidden'>
        <img src={getUrl(file)} height={200} width='100%' style={{ objectFit: 'cover', position: 'absolute', top: 0, left: 0, right: 0, borderStartStartRadius: 15 }} />
        <div style={{ height: 150 }} />
        <GlassText size='moderate' >Adding {file.name} to {bundle?.name ?? 'bundle'}</GlassText>
        <FormControl style={{ minWidth: 100 }}>
            <InputLabel>Download Type</InputLabel>
            <Select<string> onChange={e => setDownloadType(e.target.value as ProxySettingTypes)} label='Download Type'>
                <MenuItem value='RAW'>RAW</MenuItem>
                {file.proxyFiles.map(proxyFile => <MenuItem value={proxyFile.proxyType}>{ProxySettingLabels[proxyFile.proxyType]}</MenuItem>)}
            </Select>
        </FormControl>
        <TextField onChange={e => setMessage(e.target.value)} label='Add File Message' minRows={3} multiline />
        <Stack direction='row' spacing={2}>
            <Button
                onClick={createBundle}
                style={{ flex: 1 }}
                variant="outlined"
            >
                Finish
            </Button>
        </Stack>
    </Stack>
}

type AddToSharePackageProps = {
    file: StoredFile,
    onSelect: (bundle: Bundle) => void
    onCreate: () => void
}

const AddToSharePackage = ({ file, onCreate, onSelect }: AddToSharePackageProps) => {
    const { authAction, setAlert } = useAuth()
    const [bundles, setBundles] = useState<Bundle[]>([])

    useEffect(() => {
        getOwnedBundles()
    }, [])

    const getOwnedBundles = async () => {
        const result = await authAction<Bundle[]>('bundle/owned', 'GET')

        if (!isError(result)) {
            setBundles(result)
        } else {
            setAlert('Unable to load bundles', 'error')
        }
    }

    return <Stack spacing={2} overflow='hidden'>
        <GlassIconText size='big' icon={<FolderShared />}>Add To Share Bundle</GlassIconText>
        <GlassText size='moderate'>Bundles allow you to quickly share multiple files with multiple people.</GlassText>
        <ColorGlassCard paddingSize="small" onClick={onCreate}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap' }}>
                <div>
                    <GlassText size='moderate'>Create</GlassText>
                    <GlassText size='small'>Add files to new Share Package</GlassText>
                </div>
                <Fab size='small' color="primary" >
                    <Add fontSize="small" />
                </Fab>
            </div>
        </ColorGlassCard>
        {bundles.length > 0 && <Divider />}
        <Stack height={300} style={{ overflowY: 'scroll', scrollbarWidth: 'none' }} spacing={1}>
            {bundles.map(bundle =>
                <ColorGlassCard paddingSize="small">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap' }}>
                        <div>
                            <GlassText size='moderate'>{bundle.name}</GlassText>
                            <GlassText size='small'>{bundle.description}</GlassText>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap' }}>
                            <Tooltip
                                enterTouchDelay={0}
                                title={bundle.bundleUsers?.map(
                                    ({ user }) => user.firstName ? <p>{user.firstName} {user.lastName}</p> : <p>{user.email}</p>
                                )}
                            >
                                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }}>
                                    <GlassText size="large">{bundle.bundleUsers?.length}</GlassText>
                                    <GlassText size="small">Users</GlassText>
                                </div>
                            </Tooltip>
                            <Divider orientation="vertical" style={{ height: 50, marginInline: 10 }} />
                            <Tooltip
                                enterTouchDelay={0}
                                title={bundle.bundleFiles?.map(({ file }) => <p>{file?.name}</p>)}
                            >
                                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }}>
                                    <GlassText size="large">{bundle.bundleFiles?.length}</GlassText>
                                    <GlassText size="small">Files</GlassText>
                                </div>
                            </Tooltip>
                            <Divider orientation="vertical" style={{ height: 50, marginInline: 10 }} />
                            {bundle.bundleFiles?.find(bundleFile => bundleFile.file.id == file.id) ?
                                <Fab size='small' color="success" disabled>
                                    <Done fontSize="small" />
                                </Fab> :
                                <Fab size='small' color="primary" onClick={() => onSelect(bundle)}>
                                    <Add fontSize="small" />
                                </Fab>
                            }
                        </div>
                    </div>
                </ColorGlassCard>
            )}
        </Stack>
    </Stack >
}

type CreateShareBundleProps = {
    setName: (name: string) => void
    setDescription: (description: string) => void
    onFinished: () => void
}

const CreateShareBundle = ({ setName, setDescription, onFinished }: CreateShareBundleProps) => {
    return <Stack spacing={2} overflow='hidden'>
        <GlassIconText size='big' icon={<FolderShared />}>New Share Bundle</GlassIconText>
        <GlassText size='moderate'>Let people know what this bundles for</GlassText>
        <Stack style={{ overflowY: 'scroll', scrollbarWidth: 'none' }} spacing={1}>
            <TextField onChange={e => setName(e.target.value)} label='Name of bundle' />
            <TextField onChange={e => setDescription(e.target.value)} label='Bundle description' minRows={3} multiline />
            <Button
                onClick={onFinished}
                style={{ flex: 1 }}
                variant="outlined"
            >
                Invite Recipients
            </Button>
        </Stack>
    </Stack>
}

type InviteToBundleProps = {
    collaborators: Collaborator[]
    selectedBundle: State['selectedBundle']
    onFinished: (selectedBundle: Bundle) => void
}

const InviteToBundle = ({ collaborators, selectedBundle, onFinished }: InviteToBundleProps) => {
    const { createSharedBundle } = useAction()
    const divRef = useRef<ElementRef<'div'>>(null)
    const [recipients, setRecipients] = useState<string[]>([])
    const filter = createFilterOptions<string>();

    const onChange = (newRecipients: string[]) => {
        const shouldScrollToBottom = newRecipients.length > recipients.length && divRef.current != null
        setRecipients(old => [...old, ...newRecipients])

        if (shouldScrollToBottom) {
            scrollToBottom()
        }
    }

    const scrollToBottom = () => divRef.current?.scrollIntoView({ behavior: 'instant' });

    const createBundle = async () => {
        const newBundle = await createSharedBundle(recipients, selectedBundle)
        if (newBundle)
            onFinished(newBundle)
    }

    const options = collaborators
        .map(collaborator => collaborator.email)
        .filter(option => !recipients.includes(option))

    return <Stack spacing={2} overflow='hidden'>
        <GlassIconText size='big' icon={<FolderShared />}>Invite recipients</GlassIconText>
        <GlassText size='moderate'>Invite people who will be able to view the content in this bundle</GlassText>
        <Autocomplete
            multiple
            options={options}
            value={[]}
            onChange={(_, newRecipients) => onChange(newRecipients)}
            filterOptions={(options, params) => {
                const filtered = filter(options, params);

                const { inputValue } = params;

                const isExisting = options.some((option) => inputValue === option);
                if (inputValue !== '' && !isExisting) {
                    filtered.push(inputValue);
                }

                return filtered;
            }}
            freeSolo
            disableClearable
            limitTags={4}
            renderInput={(params) => <>
                <TextField
                    {...params}
                    onChange={scrollToBottom}
                    onSelect={scrollToBottom}
                    placeholder="Add Recipients"
                />
            </>}
        />
        <Stack spacing={1} style={{ overflowY: 'scroll', scrollbarWidth: 'none', maxHeight: 350, minHeight: 150 }}>
            {recipients.map((email, index) => {
                const collaborator = collaborators.find(item => item.email == email)
                return <div key={index} style={{ width: '100%', margin: 3 }}>
                    <ColorGlassCard flex={1} paddingSize="hairpin">
                        <Stack direction='row' spacing={2} alignItems='center' justifyContent='space-between' >
                            <Stack direction='row' spacing={2} alignItems='center' >
                                <Profile size="huge" textSize="moderate" user={collaborator} />
                                <div>
                                    <GlassText size="moderate">{collaborator ? `${collaborator.firstName} ${collaborator.lastName}` : email}</GlassText>
                                    <GlassText size="small" color="primary">{collaborator ? `Collaborator` : 'New'}</GlassText>
                                </div>
                                {!validateEmail(email) && <Chip icon={<Warning />} size="medium" color="primary" label='Invalid Email' />}
                            </Stack>
                            <IconButton onClick={_ => setRecipients(old => old.filter(value => value != email))}>
                                <Close />
                            </IconButton>
                        </Stack>
                    </ColorGlassCard>
                </div>
            })}
            <div ref={divRef} />
        </Stack>
        <Button
            onClick={createBundle}
            style={{ flex: 1 }}
            variant="outlined"
        >
            Create Bundle
        </Button>
    </Stack>
}



type State = {
    message?: string
    selectedBundle?: Bundle
}

const ShareFile = ({ file, state, close }: Props) => {
    const { user } = useAuth()
    const [stage, setStage] = useState('package')
    const [shareState, setShareState] = useState<State>({})
    const { properties } = useDashboard()
    const collaborators = properties.collaborators?.filter(collaborator => collaborator.email != user.email) ?? []

    const onModalClose = () => {
        if (stage === 'package' || confirm('Are you sure you wish to close? Closing will result in loss of progress')) {
            onClose()
        }
    }

    const onClose = () => {
        setShareState({})
        setStage('package')
        close()
    }

    const onBundleCreate = (selectedBundle: Bundle) => {
        setShareState(old => ({ ...old, selectedBundle }))
        setStage('message')
    }

    const onBundleSelect = (selectedBundle: Bundle) => {
        setShareState(old => ({ ...old, selectedBundle }))
        setStage('message')
    }

    return <BaseModal state={state} close={onModalClose}>
        <GlassSpace size="moderate">
            {stage == 'package' && <AddToSharePackage file={file} onCreate={() => setStage('createPackage')} onSelect={onBundleSelect} />}
            {stage == 'createPackage' && <CreateShareBundle
                setName={name => setShareState(old => ({ ...old, selectedBundle: { ...old.selectedBundle, name } }))}
                setDescription={description => setShareState(old => ({ ...old, selectedBundle: { ...old.selectedBundle, description } }))}
                onFinished={() => setStage('inviteToPackage')}
            />}
            {stage == 'inviteToPackage' && <InviteToBundle
                collaborators={collaborators}
                selectedBundle={shareState.selectedBundle}
                onFinished={onBundleCreate}
            />}
            {stage == 'message' && <AddMessage
                file={file}
                bundle={shareState.selectedBundle}
                onNext={onClose}
            />}
        </GlassSpace>
    </BaseModal>
}

export default ShareFile