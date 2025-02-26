import glass from './glass.module.css';
import { classes } from '../../helpers/classes';
import mount from '../../../public/mount.svg'

const GlassImage = () => {
    return <img
        src={mount}
        className={classes(glass.background)}
        alt="Your SVG"
    />
}

export default GlassImage