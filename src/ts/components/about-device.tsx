import {StyleSheet, View} from "react-native";
import React from "react";
import {connect} from 'react-redux';
import {State} from "../store";
import {DeviceState} from "../reducers/device";
import {setName} from "../actions/device-actions";
import {FormInput, FormLabel, Text} from "react-native-elements";
import * as Progress from 'react-native-progress';

type Props = {
    deviceInfo: DeviceState,
    setName: (name: string) => {}
}

const AboutDevice: React.SFC<Props> = ({deviceInfo, setName}: Props) => {
    return (
        <View style={styles.container}>
            <FormLabel>Device Name</FormLabel>
            <FormInput value={deviceInfo.info.deviceName} onChangeText={setName} containerStyle={styles.input}/>
            <FormLabel>Device Bluetooth Address</FormLabel>
            <Text style={styles.margin}>{deviceInfo.info.btAddress}</Text>
            <FormLabel>Device Firmware Version</FormLabel>
            <Text style={styles.margin}>{deviceInfo.info.version.firmware}</Text>
            <FormLabel>Battery Voltage</FormLabel>
            <Text style={styles.margin}>{deviceInfo.info.batteryVoltage}/{9*1000}</Text>
            <Progress.Bar progress={deviceInfo.info.batteryVoltage/(9*1000)} style={styles.margin}/>
            <FormLabel>Currently Executing Program</FormLabel>
            <Text style={styles.margin}>{deviceInfo.info.currentProgramName}</Text>
            <FormLabel>Free Space</FormLabel>
            <Text style={styles.margin}>{deviceInfo.info.freeSpace}/{256*100000}</Text>
            <Progress.Bar progress={deviceInfo.info.freeSpace/(256*100000)} style={styles.margin}/>
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
        setName: (name: string) => dispatch(setName(name))
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
        backgroundColor: "lightgray",
        borderColor: "gray",
        borderWidth: 1
    }
});

export default connect(mapStateToProps, mapDispatchToProps)(AboutDevice);