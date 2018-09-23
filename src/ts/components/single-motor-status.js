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
import { ScrollView, StyleSheet, View } from "react-native";
import { Grid, LineChart } from 'react-native-svg-charts';
import { connect } from "react-redux";
import { Card } from "react-native-material-ui";
import { OutputRegulationMode, OutputRunState, printMode, SystemOutputPort } from "../nxt-structure/motor-constants";
import { FormLabel, Text } from "react-native-elements";
import { Utils } from "../utils/utils";
var DEFAULT_DATA = [0];
var SingleMotorStatus = /** @class */ (function (_super) {
    __extends(SingleMotorStatus, _super);
    function SingleMotorStatus() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    SingleMotorStatus.prototype.render = function () {
        var motor = this.props.deviceInfo.outputs[SystemOutputPort[this.props.output]];
        var charts = Object
            .keys(motor.data)
            .filter(function (s) { return s != "port" && s != "mode"; })
            .map(function (key) { return SingleMotorStatus.renderChart(Utils.formatCamelTitle(key), motor.data[key], motor.dataHistory.map(function (data) { return data[key]; })); });
        return (<ScrollView>
                <Card>
                    <View style={{ marginBottom: 10 }}>
                        <FormLabel>Mode</FormLabel>
                        <Text style={styles.margin}>{printMode(motor.mode)}</Text>
                        <FormLabel>Regulation Mode</FormLabel>
                        <Text style={styles.margin}>{Utils.formatTitle(OutputRegulationMode[motor.regulationMode])}</Text>
                        <FormLabel>Run State</FormLabel>
                        <Text style={styles.margin}>{Utils.formatTitle(OutputRunState[motor.runState])}</Text>
                    </View>
                </Card>
                {charts}
            </ScrollView>);
    };
    SingleMotorStatus.renderChart = function (title, data, dataHistory) {
        var props = {};
        if (dataHistory.length == 0) {
            dataHistory = DEFAULT_DATA;
        }
        if (dataHistory.every(function (v) { return v === dataHistory[0]; })) {
            props.yMax = dataHistory[0] + 10;
            props.yMin = dataHistory[0] - 10;
        }
        return (<Card key={title}>
                <View>
                    <FormLabel>{title}</FormLabel>
                    <Text style={styles.margin}>{data}</Text>

                    <LineChart {...props} style={styles.chart} data={dataHistory} svg={{ stroke: 'rgb(134, 65, 244)' }} contentInset={{ top: 20, bottom: 20 }}>
                        <Grid />
                    </LineChart>
                </View>
            </Card>);
    };
    return SingleMotorStatus;
}(React.Component));
var mapStateToProps = function (state) {
    return {
        deviceInfo: state.device
    };
};
export default connect(mapStateToProps)(SingleMotorStatus);
var styles = StyleSheet.create({
    container: {
        flex: 1
    }, margin: {
        marginLeft: 20,
        marginRight: 20,
    }, chart: {
        height: 200,
        marginLeft: 20,
        marginRight: 20,
    }
});
