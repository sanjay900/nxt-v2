// @flow
import { StyleSheet, View, Animated } from "react-native";
import React from "react";
import Icon from "react-native-vector-icons/FontAwesome5"
import BluetoothSerial from "react-native-bluetooth-serial";
import Toast from '@remobile/react-native-toast'

const AnimatedIcon = Animated.createAnimatedComponent(Icon);
const Colours = {
    connecting: "black",
    connected: "rgb(50,219,100)",
    disconnected: "rgb(245,61,61)"
};
type ConnectionStatus = "CONNECTING" | "CONNECTED" | "DISCONNECTED";
type Device = { id: string, name: string };
type State = {
    status: ConnectionStatus,
    opacity: Animated.Value,
    device: Device
}
type Props = {

}
export default class StatusButton extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
            status: 'CONNECTING',
            opacity: new Animated.Value(1),
            device: {id:"", name:"none"}
        };
        Animated.loop(
            Animated.sequence([
                Animated.timing(this.state.opacity, {
                    toValue: 0,
                    duration: 500
                }),
                Animated.timing(this.state.opacity, {
                    toValue: 1,
                    duration: 500
                }),
            ])
        ).start()
    }
    componentDidMount() {
        BluetoothSerial.on('bluetoothEnabled', () => Toast.showShortBottom('Bluetooth enabled'))
        BluetoothSerial.on('bluetoothDisabled', () => Toast.showShortBottom('Bluetooth disabled'))
        BluetoothSerial.on('error', (err) =>  Toast.showShortBottom(`Error with bluetooth device: ${err.message}`))
        BluetoothSerial.on('connectionLost', () => {
            if (this.state.device) {
                Toast.showShortBottom(`Connection to device ${this.state.device.name} has been lost`)
            }
            this.setState({ status: "DISCONNECTED" })
        })
    }
    render() {

        /** some styling **/

        return (
            <View style={styles.container}>
                <AnimatedIcon name="bluetooth" style={this.getStyle()} size={30} />
                
            </View>
        );
    }

    getStyle() {
        let style: any = { color: Colours[this.state.status.toLowerCase()] }
        if (this.state.status === "CONNECTING") {
            style.opacity = this.state.opacity
        }
        return style;
    }


}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingRight: 10
    }
});