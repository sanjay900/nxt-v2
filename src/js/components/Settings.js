import { Component } from "react";
import { StyleSheet, Picker, View, Text } from "react-native";
import React from "react";
import { connectToDevice } from "../actions/bluetooth-actions";
import { Action, Device, State } from "../actions/types";
import { connect } from "react-redux";
type Props = {
    connectToDevice: Action,
    list: Device[],
    device: Device
}
const Settings = ({ list, device, connectToDevice }: Props) => {
    let devices = list.map(device => <Picker.Item key={device} label={device.name} value={device} />);
    return (
        <View style={styles.container}>
            <Text style={styles.label}>NXT Bluetooth Device</Text>
            <Picker
                selectedValue={device}
                style={styles.picker}
                onValueChange={connectToDevice}>
                {devices}
            </Picker>
        </View>
    );
};
const mapStateToProps = (state: State) => {
    return {
        list: state.bluetooth.list || [],
        device: state.bluetooth.device
    };
};
const mapDispatchToProps = dispatch => ({
    connectToDevice: (device: Device) => {
        dispatch(connectToDevice(device));
    }
});
export default connect(mapStateToProps, mapDispatchToProps)(Settings);
const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    label: {
        marginTop: 10,
        marginLeft: 8,
        fontSize: 20
    },
    picker: {
        height: 50,
        width: '100%'
    }
});