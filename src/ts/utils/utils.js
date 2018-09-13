var Utils = /** @class */ (function () {
    function Utils() {
    }
    Utils.enumToMap = function (type, delimiter) {
        if (delimiter === void 0) { delimiter = " "; }
        return Object.keys(type)
            .map(function (s, i) {
            return {
                key: s,
                value: Object.values(type)[i],
                formatted: Utils.formatTitle(s, delimiter)
            };
        });
    };
    Utils.formatTitle = function (string, delimiter) {
        if (delimiter === void 0) { delimiter = " "; }
        return string.replace(/_/g, " ")
            .replace(/\w\S*/g, function (txt) { return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase(); })
            .replace(/ /g, delimiter);
    };
    /**
     * Check if a component is visible
     * @param {ElementRef} elementRef the reference to the components element
     * @returns {any} true if the component is visible, false otherwise
     */
    Utils.isVisible = function (elementRef) {
        return elementRef.nativeElement.offsetParent;
    };
    return Utils;
}());
export { Utils };
