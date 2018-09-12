import { StyleSheet, Picker, View, Text } from "react-native";
import React from "react";
import { connectToDevice } from "../actions/bluetooth-actions";
import { connect } from "react-redux";
var Settings = function (props) {
    var list = props.list, device = props.device, connectToDevice = props.connectToDevice;
    var devices = list.map(function (device) { return <Picker.Item key={device.id} label={device.name} value={device}/>; });
    return (<View style={styles.container}>
            <Text style={styles.label}>NXT Bluetooth Device</Text>
            <Picker selectedValue={device} style={styles.picker} onValueChange={connectToDevice}>
                {devices}
            </Picker>
        </View>);
};
var mapStateToProps = function (state) {
    return {
        list: state.bluetooth.list || [],
        device: state.bluetooth.device
    };
};
var mapDispatchToProps = function (dispatch) { return ({
    connectToDevice: function (device) { return dispatch(connectToDevice.request(device)); }
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
