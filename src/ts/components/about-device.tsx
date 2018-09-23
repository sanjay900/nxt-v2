import {StyleSheet, View} from "react-native";
import React from "react";
import {connect} from 'react-redux';
import {DeviceState, State} from "../store";
import {writePacket} from "../actions/device-actions";
import {FormLabel, Text} from "react-native-elements";
import * as Progress from 'react-native-progress';
import {SetBrickName} from "../nxt-structure/packets/system/set-brick-name";
import {TextField} from "react-native-material-textfield";

type Props = {
    deviceInfo: DeviceState,
    setName: (name: string) => {}
}

const AboutDevice: React.SFC<Props> = ({deviceInfo, setName}: Props) => {
    let progName = deviceInfo.info.currentProgramName;
    if (progName.length == 0) {
        progName = "None";
    }
    return (
        <View style={styles.container}>
            <TextField label="Device Name" value={deviceInfo.info.deviceName} onChangeText={setName} containerStyle={styles.input}/>
            <FormLabel>Device Bluetooth Address</FormLabel>
            <Text style={styles.margin}>{deviceInfo.info.btAddress}</Text>
            <FormLabel>Device Firmware Version</FormLabel>
            <Text style={styles.margin}>{deviceInfo.info.version.firmware}</Text>
            <FormLabel>Battery Voltage</FormLabel>
            <Text style={styles.margin}>{deviceInfo.info.batteryVoltage} mV / {9 * 1000} mV</Text>
            <Progress.Bar progress={deviceInfo.info.batteryVoltage / (9 * 1000)} style={styles.margin}/>
            <FormLabel>Currently Executing Program</FormLabel>
            <Text style={styles.margin}>{progName}</Text>
            <FormLabel>Free Space</FormLabel>
            <Text style={styles.margin}>{(deviceInfo.info.freeSpace/1024).toFixed(2)} KB / 256 KB</Text>
            <Progress.Bar progress={deviceInfo.info.freeSpace / (256 * 1024)} style={styles.margin}/>
        </View>
    );
};
const mapStateToProps = (state: State) => {
    return {
        deviceInfo: state.device
    };
};
const mapDispatchToProps = (dispatch: Function) => {
    return {
        setName: (name: string) => dispatch(writePacket.request(SetBrickName.createPacket(name)))
    };
};
const styles = StyleSheet.create({
    container: {
        flex: 1
    }, joyContainer: {
        flex: 1,
        flexDirection: 'row'
    }, margin: {
        marginLeft: 20,
    }, input: {
        marginLeft: 20,
    }
});

export default connect(mapStateToProps, mapDispatchToProps)(AboutDevice);