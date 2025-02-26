export const classes = (...classes: (string | undefined)[]) => {
    return classes.filter(styleClass => styleClass != undefined).join(' ')
}