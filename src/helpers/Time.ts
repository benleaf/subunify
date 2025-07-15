import moment from "moment";

export class Time {
    public static format(timeString?: string) {
        return moment(timeString).format("MMMM Do YYYY hh:mm A")
    }

    public static formatDate(date?: Date | moment.Moment) {
        return moment(date).format("MMMM Do YYYY hh:mm A")
    }

    public static compare(a?: Date, b?: Date) {
        return moment(a).diff(moment(b)) > 0 ? 1 : -1
    }
} 