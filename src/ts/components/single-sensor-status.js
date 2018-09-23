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
import { FormLabel, Text } from "react-native-elements";
import { Utils } from "../utils/utils";
var DEFAULT_DATA = [0];
var SingleSensorStatus = /** @class */ (function (_super) {
    __extends(SingleSensorStatus, _super);
    function SingleSensorStatus() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    SingleSensorStatus.prototype.render = function () {
        var sensor = this.props.deviceInfo.inputs[this.props.sensor];
        var charts = Object
            .keys(sensor.data)
            .filter(function (s) { return s != "port"; })
            .map(function (key) { return SingleSensorStatus.renderChart(Utils.formatCamelTitle(key), sensor.data[key], sensor.dataHistory.map(function (data) { return data[key]; })); });
        return (<ScrollView>
                <Card>
                    <View style={{ marginBottom: 10 }}>
                        <FormLabel>Type</FormLabel>
                        <Text style={styles.margin}>{sensor.type}</Text>
                    </View>
                </Card>
                {charts}
            </ScrollView>);
    };
    SingleSensorStatus.renderChart = function (title, data, dataHistory) {
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
    return SingleSensorStatus;
}(React.Component));
var mapStateToProps = function (state) {
    return {
        deviceInfo: state.device
    };
};
export default connect(mapStateToProps)(SingleSensorStatus);
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
