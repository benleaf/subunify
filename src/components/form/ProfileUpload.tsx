import { getExtension } from '@/helpers/FileProperties'
import { Edit } from '@mui/icons-material'
import { ButtonBase } from '@mui/material'
import { useCallback, useState } from 'react'
import { useDropzone, FileError } from 'react-dropzone'
import Cropper, { Area } from 'react-easy-crop'
import GlassText from '../glassmorphism/GlassText'
import BaseModal from '../modal/BaseModal'
import { useAuth } from '@/contexts/AuthContext'

const ALLOWED_EXTENSIONS = ['jpg', 'jpeg', 'png']

const ProfileUpload = () => {
    const { setUserAttributes, user } = useAuth()
    const [profile, setProfile] = useState<File>()
    const onDrop = useCallback(
        (acceptedFile: File[]) => {
            setProfile(acceptedFile[0])
        },
        []
    )

    const { getRootProps, getInputProps } = useDropzone({
        onDrop,
        maxFiles: 1,
        multiple: false,
        validator: file => {
            const ext = getExtension(file)
            if (!ALLOWED_EXTENSIONS.includes(ext)) {
                const message = `Only allowed  ${ALLOWED_EXTENSIONS.join(', ')}`
                return { message, code: 'FileTypeNotAllowed' } as FileError
            }
            return null
        },
    })

    const [crop, setCrop] = useState({ x: 0, y: 0 })
    const [zoom, setZoom] = useState(1)

    function createImage(src: string): Promise<HTMLImageElement> {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.addEventListener('load', () => resolve(img));
            img.addEventListener('error', err => reject(err));
            img.src = src;
        });
    }

    const onCropComplete = async (_: Area, croppedAreaPixels: Area) => {
        const image = await createImage(URL.createObjectURL(profile!));
        const outputSize = { width: 100, height: 100 }

        const canvas = document.createElement('canvas');
        canvas.width = outputSize.width;
        canvas.height = outputSize.height;
        const ctx = canvas.getContext('2d')!;

        ctx.drawImage(
            image,
            croppedAreaPixels.x,
            croppedAreaPixels.y,
            croppedAreaPixels.width,
            croppedAreaPixels.height,
            0,
            0,
            outputSize.width,
            outputSize.height
        );

        await new Promise((resolve, reject) => {
            canvas.toBlob(
                blob => {
                    if (blob) {
                        const file = new File([blob], 'avatar.jpg', { type: blob.type })
                        setUserAttributes({ thumbnail: URL.createObjectURL(file) })
                        resolve(blob)
                    } else reject(new Error('Canvas is empty'));
                },
                'image/jpeg',
                0.85
            );
        });
    }
    return <>
        <div {...getRootProps()}>
            <input {...getInputProps()} />
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <div style={{
                    borderRadius: '100%',
                    width: 60,
                    height: 60,
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    borderWidth: 1,
                    borderStyle: 'ridge'
                }}>
                    <ButtonBase style={{ width: '100%', height: '100%', position: 'relative' }}>
                        {user.thumbnail && <img style={{ borderRadius: '100%', width: '100%', height: '100%', objectFit: 'contain' }} src={user.thumbnail} />}
                        {!user.thumbnail && <GlassText size="big">{user.firstName?.[0]}{user.lastName?.[0]}</GlassText>}
                        <div style={{
                            borderRadius: '100%',
                            width: 30,
                            height: 30,
                            objectFit: 'contain',
                            position: 'absolute',
                            right: -5,
                            bottom: -5,
                            display: 'flex',
                            flexWrap: 'wrap',
                            justifyContent: 'center',
                            alignItems: 'center',
                            borderWidth: 1,
                            borderStyle: 'solid',
                            backgroundColor: 'white'
                        }}>
                            <Edit />
                        </div>
                    </ButtonBase>
                </div>
            </div>
        </div>
        <BaseModal state={profile ? "open" : 'closed'} close={() => setProfile(undefined)}>
            <div style={{ height: '50vh' }}>
                {profile && <Cropper
                    image={URL.createObjectURL(profile)}
                    crop={crop}
                    zoom={zoom}
                    aspect={1}
                    onCropChange={setCrop}
                    onCropComplete={onCropComplete}
                    onZoomChange={setZoom}
                />}
            </div>
        </BaseModal>
    </>
}

export default ProfileUpload