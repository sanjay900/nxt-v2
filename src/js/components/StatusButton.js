// @flow
import { StyleSheet, View, Animated } from "react-native";
import React from "react";
import Icon from "react-native-vector-icons/FontAwesome5";
import BluetoothSerial from "react-native-bluetooth-serial";
import Toast from '@remobile/react-native-toast';
import type { ConnectionStatus, Device } from "../actions/types";
import { connect } from "react-redux";
const AnimatedIcon = Animated.createAnimatedComponent(Icon);
const Colours = {
    connecting: "black",
    connected: "rgb(50,219,100)",
    disconnected: "rgb(245,61,61)"
};
type State = {
    opacity: Animated.Value,
}
type Props = {
    status: ConnectionStatus,
    device: Device,
    setStatus: (ConnectionStatus) => {}
}
class StatusButton extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
            opacity: new Animated.Value(1)
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
        ).start();
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
        let style: any = { color: Colours[this.props.status.toLowerCase()] };
        if (this.props.status === "CONNECTING") {
            style.opacity = this.state.opacity;
        }
        return style;
    }
}

const mapStateToProps = (state: State) => {
    return {
        status: state.bluetooth.status,
        device: state.bluetooth.device
    };
};
const mapDispatchToProps = dispatch => ({
    setStatus: (status: ConnectionStatus) => dispatch({type: "CHANGE_STATUS", status})
});
export default connect(mapStateToProps, mapDispatchToProps)(StatusButton);
const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingRight: 10
    }
});