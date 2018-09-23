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
import { Button, Picker, ScrollView, StyleSheet, View } from "react-native";
import { connect } from "react-redux";
import { Card } from "react-native-material-ui";
import { FormLabel, Text } from "react-native-elements";
import { Actions } from "react-native-router-flux";
import { SensorType } from "../nxt-structure/sensor-constants";
import { sensorConfig } from "../actions/sensor-actions";
var Sensors = /** @class */ (function (_super) {
    __extends(Sensors, _super);
    function Sensors() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Sensors.prototype.render = function () {
        return (<ScrollView>
                {Object.values(this.props.deviceInfo.inputs).map(this.renderSensor.bind(this))}
            </ScrollView>);
    };
    Sensors.prototype.renderSensor = function (sensor) {
        var _this = this;
        var types = Object.values(SensorType).map(function (type) { return <Picker.Item key={type} label={type} value={type}/>; });
        return (<Card key={sensor.data.port}>
                <View>
                    <Text h4 style={styles.title}>Sensor {sensor.data.port}</Text>
                    <FormLabel>Type</FormLabel>
                    <Picker selectedValue={sensor.type} style={styles.picker} onValueChange={function (value) { return _this.props.setSensorType(value, sensor.data.port); }}>
                        {types}
                    </Picker>
                    <FormLabel>Value</FormLabel>
                    <Text style={styles.margin}>{sensor.data.scaledValue}</Text>
                    <View style={styles.button}>
                        <Button title="More information" onPress={function () { return Actions.push("sensor-info-expanded", {
            sensor: sensor.data.port,
            title: "Sensor " + sensor.data.port + " Information"
        }); }}/>
                    </View>
                </View>
            </Card>);
    };
    return Sensors;
}(React.Component));
var mapStateToProps = function (state) {
    return {
        deviceInfo: state.device
    };
};
var mapDispatchToProps = function (dispatch) { return ({
    setSensorType: function (sensorType, sensor) { return dispatch(sensorConfig.request({
        port: sensor, sensorType: sensorType
    })); }
}); };
export default connect(mapStateToProps, mapDispatchToProps)(Sensors);
var styles = StyleSheet.create({
    container: {
        flex: 1
    }, margin: {
        marginLeft: 20,
    }, button: {
        marginTop: 20
    }, title: {
        marginTop: 10,
        marginLeft: 20,
        marginBottom: 0
    }, picker: {
        height: 50,
        marginLeft: 11,
        marginRight: 11,
    }
});
