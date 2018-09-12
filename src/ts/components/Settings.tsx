import { StyleSheet, Picker, View, Text } from "react-native";
import React from "react";
import { connectToDevice } from "../actions/bluetooth-actions";
import { connect } from "react-redux";
import {Device} from "react-native-bluetooth-serial";
import {State} from "../actions/types";
type Props = {
    connectToDevice: (device:Device)=>void,
    device?: Device,
    list: Device[]
}
const Settings: React.SFC<Props> = (props) => {
    const { list, device, connectToDevice } = props;
    let devices = list.map(device => <Picker.Item key={device.id} label={device.name} value={device} />);
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
const mapDispatchToProps = (dispatch: Function) => ({
    connectToDevice: (device: Device) => dispatch(connectToDevice.request(device))
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