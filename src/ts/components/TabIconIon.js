var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({__proto__: []} instanceof Array && function (d, b) {
                d.__proto__ = b;
            }) ||
            function (d, b) {
                for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
            };
        return extendStatics(d, b);
    }
    return function (d, b) {
        extendStatics(d, b);

        function __() {
            this.constructor = d;
        }

        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
import {StyleSheet, View} from "react-native";
import React from "react";
import Icon from "react-native-vector-icons/Ionicons";

var TabIconIon = /** @class */ (function (_super) {
    __extends(TabIconIon, _super);

    function TabIconIon() {
        return _super !== null && _super.apply(this, arguments) || this;
    }

    TabIconIon.prototype.render = function () {
        /** some styling **/
        return (<View style={styles.container}>
            <Icon name={this.props.iconName} color={this.props.focused ? "#4F8EF7" : this.props.tintColor} size={20}/>
        </View>);
    };
    return TabIconIon;
}(React.Component));
export default TabIconIon;
var styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F5FCFF',
    }
});
