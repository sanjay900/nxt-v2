import { Button, Picker, StyleSheet, Text, View } from "react-native";
import React from "react";
import { connectToDevice, disconnectFromDevice } from "../actions/bluetooth-actions";
import { connect } from "react-redux";
import { ConnectionStatus } from "../reducers/bluetooth";
var Settings = function (props) {
    var list = props.list, device = props.device, connectToDevice = props.connectToDevice, status = props.status, disconnect = props.disconnect;
    var button;
    if (status == ConnectionStatus.DISCONNECTED) {
        button = <Button onPress={function () { return device && connectToDevice(device); }} title={"Connect to device"}/>;
    }
    else {
        button = <Button onPress={function () { return device && disconnect(); }} title={"Disconnect from device"}/>;
    }
    var devices = list.map(function (device) { return <Picker.Item key={device.id} label={device.name} value={device}/>; });
    return (<View style={styles.container}>
            <Text style={styles.label}>NXT Bluetooth Device</Text>
            <Picker selectedValue={device} style={styles.picker} onValueChange={connectToDevice}>
                {devices}
            </Picker>
            {button}
        </View>);
};
var mapStateToProps = function (state) {
    return {
        list: state.bluetooth.list || [],
        device: state.bluetooth.device,
        status: state.bluetooth.status
    };
};
var mapDispatchToProps = function (dispatch) { return ({
    connectToDevice: function (device) { return dispatch(connectToDevice.request(device)); },
    disconnect: function () { return dispatch(disconnectFromDevice.request()); }
}); };
export default connect(mapStateToProps, mapDispatchToProps)(Settings);
var styles = StyleSheet.create({
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