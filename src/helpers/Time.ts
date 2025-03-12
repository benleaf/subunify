import moment from "moment";

export class Time {
    public static format(timeString?: string) {
        return moment(timeString).format("MMMM Do YYYY hh:mm A")
    }
} 