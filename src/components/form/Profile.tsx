import GlassText from '../glassmorphism/GlassText'
import { User } from '@/types/User'
import { CssSizes } from '@/constants/CssSizes'

type Props = {
    user?: Partial<User>,
    size?: keyof typeof CssSizes
    textSize?: keyof typeof CssSizes
}

const Profile = ({ user, size = 'huge', textSize = 'moderate' }: Props) => {
    return <div style={{
        borderRadius: '100%',
        width: CssSizes[size],
        height: CssSizes[size],
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderStyle: 'ridge'
    }}>
        {user?.thumbnail && <img style={{ borderRadius: '100%', width: '100%', height: '100%', objectFit: 'contain' }} src={user?.thumbnail} />}
        {!user?.thumbnail && <GlassText size={textSize}>{user?.firstName?.[0]}{user?.lastName?.[0]}</GlassText>}
    </div>
}

export default Profile