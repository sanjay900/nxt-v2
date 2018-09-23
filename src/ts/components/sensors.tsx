import React from "react";
import {Button, Picker, ScrollView, StyleSheet, View} from "react-native";
import {DeviceState, State, SystemSensor} from "../store";
import {connect} from "react-redux";
import {Card} from "react-native-material-ui";
import {FormLabel, Text} from "react-native-elements";
import {Actions} from "react-native-router-flux";
import {SensorType} from "../nxt-structure/sensor-constants";
import {sensorConfig} from "../actions/sensor-actions";

type Props = {
    deviceInfo: DeviceState,
    setSensorType: (sensorType: SensorType, sensor: number) => {}
}

class Sensors extends React.Component<Props> {
    render() {
        return (
            <ScrollView>
                {Object.values(this.props.deviceInfo.inputs).map(this.renderSensor.bind(this))}
            </ScrollView>
        );
    }

    renderSensor(sensor: SystemSensor) {
        let types = Object.values(SensorType).map((type: string) => <Picker.Item key={type} label={type}
                                                                                 value={type}/>);

        return (
            <Card key={sensor.data.port}>
                <View>
                    <Text h4 style={styles.title}>Sensor {sensor.data.port}</Text>
                    <FormLabel>Type</FormLabel>
                    <Picker
                        selectedValue={sensor.type}
                        style={styles.picker}
                        onValueChange={value => this.props.setSensorType(value, sensor.data.port)}>
                        {types}
                    </Picker>
                    <FormLabel>Value</FormLabel>
                    <Text style={styles.margin}>{sensor.data.scaledValue}</Text>
                    <View style={styles.button}>
                        <Button title="More information" onPress={() => Actions.push("sensor-info-expanded", {
                            sensor: sensor.data.port,
                            title: `Sensor ${sensor.data.port} Information`
                        })}/>
                    </View>
                </View>
            </Card>
        )
    }
}

const mapStateToProps = (state: State) => {
    return {
        deviceInfo: state.device
    };
};
const mapDispatchToProps = (dispatch: Function) => ({
    setSensorType: (sensorType: SensorType, sensor: number) => dispatch(sensorConfig.request({
        port: sensor, sensorType
    }))
});
export default connect(mapStateToProps, mapDispatchToProps)(Sensors);


const styles = StyleSheet.create({
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