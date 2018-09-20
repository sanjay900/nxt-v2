var Utils = /** @class */ (function () {
    function Utils() {
    }

    Utils.formatTitle = function (string, delimiter) {
        if (delimiter === void 0) {
            delimiter = " ";
        }
        return string.replace(/_/g, " ")
            .replace(/\w\S*/g, function (txt) {
                return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
            })
            .replace(/ /g, delimiter);
    };
    return Utils;
}());
export {Utils};
