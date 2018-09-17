export class Utils {
    static formatTitle(string: string, delimiter: string = " ") {
        return string.replace(/_/g, " ")
            .replace(/\w\S*/g, txt => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase())
            .replace(/ /g, delimiter)
    }
}
