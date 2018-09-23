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
import React from "react";
import { StyleSheet } from "react-native";
import { Grid, LineChart } from 'react-native-svg-charts';
import { connect } from "react-redux";
import { disableMotorListener, enableMotorListener } from "../actions/motor-actions";
import { Card } from "react-native-material-ui";
var Motors = /** @class */ (function (_super) {
    __extends(Motors, _super);
    function Motors() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Motors.prototype.componentDidMount = function () {
        this.props.listenToMotorState();
    };
    Motors.prototype.componentWillUnmount = function () {
        this.props.stopListeningToMotorState();
    };
    Motors.prototype.render = function () {
        return (<Card>
                <LineChart style={{ height: 200 }} data={this.props.deviceInfo.outputs.B.dataHistory.map(function (s) { return s.rotationCount; })} svg={{ stroke: 'rgb(134, 65, 244)' }} contentInset={{ top: 20, bottom: 20 }}>
                    <Grid />
                </LineChart>
            </Card>);
    };
    return Motors;
}(React.Component));
var mapStateToProps = function (state) {
    return {
        deviceInfo: state.device
    };
};
var mapPropsToDispatch = function (dispatch) {
    return {
        listenToMotorState: function () { return dispatch(enableMotorListener()); },
        stopListeningToMotorState: function () { return dispatch(disableMotorListener()); }
    };
};
export default connect(mapStateToProps, mapPropsToDispatch)(Motors);
var styles = StyleSheet.create({
    container: {
        flex: 1
    }, margin: {
        marginLeft: 20,
    },
});
