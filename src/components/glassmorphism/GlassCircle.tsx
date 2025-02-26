import glass from './glass.module.css';
import { classes } from '../../helpers/classes';

type Props = {
    size?: "small" | "medium" | "large"
}

const GlassCircle = ({ size = "medium" }: Props) => {
    const sizeClass = {
        small: glass.smallCircle,
        medium: glass.mediumCircle,
        large: glass.largeCircle
    }[size]
    return <div className={classes(sizeClass)}></div>
}

export default GlassCircle