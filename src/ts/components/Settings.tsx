import {Button, Picker, StyleSheet, Text, View} from "react-native";
import React from "react";
import {connectToDevice, disconnectFromDevice} from "../actions/bluetooth-actions";
import {connect} from "react-redux";
import {Device} from "react-native-bluetooth-serial";
import {State} from "../store";
import {ConnectionStatus} from "../reducers/bluetooth";

type Props = {
    connectToDevice: (device: Device) => void,
    device?: Device,
    list: Device[],
    status: ConnectionStatus,
    disconnect: () => void,
}
const Settings: React.SFC<Props> = (props) => {
    const {list, device, connectToDevice, status, disconnect} = props;
    let button;
    if (status == ConnectionStatus.DISCONNECTED) {
        button = <Button onPress={() => device && connectToDevice(device)} title={"Connect to device"}/>
    } else {
        button = <Button onPress={() => device && disconnect()} title={"Disconnect from device"}/>
    }
    let devices = list.map(device => <Picker.Item key={device.id} label={device.name} value={device}/>);
    return (
        <View style={styles.container}>
            <Text style={styles.label}>NXT Bluetooth Device</Text>
            <Picker
                selectedValue={device}
                style={styles.picker}
                onValueChange={connectToDevice}>
                {devices}
            </Picker>
            {button}
        </View>
    );
};
const mapStateToProps = (state: State) => {
    return {
        list: state.bluetooth.list || [],
        device: state.bluetooth.device,
        status: state.bluetooth.status
    };
};
const mapDispatchToProps = (dispatch: Function) => ({
    connectToDevice: (device: Device) => dispatch(connectToDevice.request(device)),
    disconnect: () => dispatch(disconnectFromDevice.request())
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