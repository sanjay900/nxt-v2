import {Button, Picker, StyleSheet, Text, View} from "react-native";
import React from "react";
import {connectToDevice, disconnectFromDevice} from "../actions/bluetooth-actions";
import {connect} from "react-redux";
import {Device} from "react-native-bluetooth-serial";
import {State} from "../store";
import {ConnectionStatus} from "../reducers/bluetooth";
import {writePacket} from "../actions/device-actions";
import {StartProgram} from "../nxt-structure/packets/direct/start-program";

type Props = {
    device?: Device,
    list: Device[],
    status: ConnectionStatus,
    connectToDevice: (device: Device) => void,
    disconnect: () => void,
    startApp: () => void,
}
const Settings: React.SFC<Props> = (props) => {
    const {list, device, connectToDevice, status, disconnect, startApp} = props;
    let button;
    if (status == ConnectionStatus.DISCONNECTED) {
        button = <Button onPress={() => device && connectToDevice(device)} title={"Connect to device"}/>
    } else {
        button = <View><Button onPress={() => device && disconnect()} title={"Disconnect from device"}/>
            <Button onPress={startApp} title={"Start Motor App"}/></View>
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
    disconnect: () => dispatch(disconnectFromDevice.request()),
    startApp: () => {
        dispatch(writePacket.request(StartProgram.createPacket("SteeringControl.rxe")))
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