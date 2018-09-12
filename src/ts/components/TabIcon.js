var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    }
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
import { StyleSheet, View } from "react-native";
import React from "react";
import Icon from "react-native-vector-icons/FontAwesome5";
var TabIcon = /** @class */ (function (_super) {
    __extends(TabIcon, _super);
    function TabIcon() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    TabIcon.prototype.render = function () {
        /** some styling **/
        return (<View style={styles.container}>
                <Icon name={this.props.iconName} color={this.props.focused ? "#4F8EF7" : this.props.tintColor} size={20}/>
            </View>);
    };
    return TabIcon;
}(React.Component));
export default TabIcon;
var styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F5FCFF',
    }
});
