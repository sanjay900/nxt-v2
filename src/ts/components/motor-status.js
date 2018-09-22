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
import React, { Component } from "react";
import { StyleSheet, Text } from "react-native";
import { Card } from "react-native-material-ui";
var MotorStatus = /** @class */ (function (_super) {
    __extends(MotorStatus, _super);
    function MotorStatus() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    MotorStatus.prototype.render = function () {
        return (<Card>
                <Text>Hello world!</Text>
            </Card>);
    };
    return MotorStatus;
}(Component));
export default MotorStatus;
var styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F5FCFF',
    },
    welcome: {
        fontSize: 20,
        textAlign: 'center',
        margin: 10,
    }
});
