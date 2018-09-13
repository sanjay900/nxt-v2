import {Animated, StyleSheet, View} from "react-native";
import React from "react";
import Icon from "react-native-vector-icons/FontAwesome5";
import {State} from "../store";
import {connect} from "react-redux";
import {Device} from "react-native-bluetooth-serial";
import Toast from "@remobile/react-native-toast";
import {writePacket} from "../actions/device-actions";
import {GetDeviceInfo} from "../nxt-structure/packets/system/get-device-info";
import {ConnectionStatus} from "../reducers/bluetooth";
import {GetFirmwareVersion} from "../nxt-structure/packets/system/get-firmware-version";
import {GetBatteryLevel} from "../nxt-structure/packets/direct/get-battery-level";

const AnimatedIcon = Animated.createAnimatedComponent(Icon);
const Colours: { [key: string]: string } = {
    connecting: "black",
    connected: "rgb(50,219,100)",
    disconnected: "rgb(245,61,61)"
};
type StatusState = {
    opacity: Animated.Value,
}
type Props = {
    status: ConnectionStatus,
    device?: Device,
    lastMessage?: string,
    fetchDeviceInfo: Function
}

class StatusButton extends React.Component<Props, StatusState> {
    private _animation!: Animated.CompositeAnimation;

    constructor(props: Props) {
        super(props);
        this.state = {
            opacity: new Animated.Value(1)
        };
        this.startAnimation();
    }

    startAnimation() {
        this._animation = Animated.loop(
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
        );
        this._animation.start();
    }

    componentWillReceiveProps(nextProps: Props) {
        if (this.props.status != nextProps.status) {
            if (nextProps.status == ConnectionStatus.CONNECTING) {
                this.startAnimation();
            } else {
                this._animation.stop();
                this.setState({opacity: new Animated.Value(1)});
            }
        }
        if (nextProps.lastMessage && this.props.lastMessage != nextProps.lastMessage) {
            Toast.showShortBottom(`Message from bluetooth device: ${nextProps.lastMessage}`);
        }
        if (this.props.status != nextProps.status && nextProps.status == ConnectionStatus.CONNECTED) {
            this.props.fetchDeviceInfo();
        }
    }

    render() {

        /** some styling **/

        return (
            <View style={styles.container}>
                <AnimatedIcon name="bluetooth" style={this.getStyle()} size={30}/>
            </View>
        );
    }

    getStyle() {
        let style: any = {color: Colours[ConnectionStatus[this.props.status].toLowerCase()]};
        if (this.props.status === ConnectionStatus.CONNECTING) {
            style.opacity = this.state.opacity;
        }
        return style;
    }
}

const mapStateToProps = (state: State) => {
    return {
        status: state.bluetooth.status,
        device: state.bluetooth.device,
        lastMessage: state.bluetooth.lastMessage
    };
};

const mapPropsToDispatch = (dispatch: Function) => {
    return {
        fetchDeviceInfo: ()=>{
            dispatch(writePacket.request(GetBatteryLevel.createPacket()));
            dispatch(writePacket.request(GetDeviceInfo.createPacket()));
            dispatch(writePacket.request(GetFirmwareVersion.createPacket()));
        }
    }
};
export default connect(mapStateToProps, mapPropsToDispatch)(StatusButton);
const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingRight: 10
    }
});