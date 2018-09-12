// @flow
import {Animated, StyleSheet, View} from "react-native";
import React from "react";
import Icon from "react-native-vector-icons/FontAwesome5";
import {ConnectionStatus, State} from "../actions/types";
import {connect} from "react-redux";
import {Device} from "react-native-bluetooth-serial";

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
        style.opacity = this.state.opacity;
        return style;
    }
}

const mapStateToProps = (state: State) => {
    return {
        status: state.bluetooth.status,
        device: state.bluetooth.device
    };
};
export default connect(mapStateToProps)(StatusButton);
const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingRight: 10
    }
});