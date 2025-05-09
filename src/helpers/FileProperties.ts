import moment from "moment";

export const getExtension = (file: File) => file.name.split('.').pop()!

const getTimeOfDay = (timestamp: number) => {
    const time = moment(timestamp)

    var afternoon = 12
    var evening = 17
    var currentHour = parseFloat(time.format("HH"));

    if (currentHour >= afternoon && currentHour <= evening) {
        return "Afternoon";
    } else if (currentHour >= evening) {
        return "Evening";
    } else {
        return "Morning";
    }
}

export const getTagsFromFile = (file: File) => {
    const pathParts = file.webkitRelativePath.split('/').filter(Boolean);
    const dir = pathParts.slice(0, -1); // everything except the file name
    return [
        getExtension(file) ?? 'No Extension',
        getTimeOfDay(file.lastModified),
        moment(file.lastModified).format('MMMM'),
        moment(file.lastModified).format('YYYY'),
        `Q${moment(file.lastModified).utc().quarter()}`,
        ...dir
    ]
}