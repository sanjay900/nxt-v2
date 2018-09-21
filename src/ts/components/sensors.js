import React from "react";
import { StyleSheet } from "react-native";
import { Grid, LineChart } from 'react-native-svg-charts';
import { connect } from "react-redux";
var Sensors = function (_a) {
    var deviceInfo = _a.deviceInfo;
    return (<LineChart style={{ height: 200 }} data={[10, 10, 20, 40, 22, 21, 4]} svg={{ stroke: 'rgb(134, 65, 244)' }} contentInset={{ top: 20, bottom: 20 }}>
            <Grid />
        </LineChart>);
};
var mapStateToProps = function (state) {
    return {
        deviceInfo: state.device
    };
};
export default connect(mapStateToProps)(Sensors);
var styles = StyleSheet.create({
    container: {
        flex: 1
    }, margin: {
        marginLeft: 20,
    },
});
