var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    }
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
import { Animated, StyleSheet, View } from "react-native";
import React from "react";
import Icon from "react-native-vector-icons/FontAwesome5";
import { connect } from "react-redux";
import Toast from "@remobile/react-native-toast";
import { ConnectionStatus } from "../store";
var AnimatedIcon = Animated.createAnimatedComponent(Icon);
var Colours = {
    connecting: "black",
    connected: "rgb(50,219,100)",
    disconnected: "rgb(245,61,61)"
};
var StatusButton = /** @class */ (function (_super) {
    __extends(StatusButton, _super);
    function StatusButton(props) {
        var _this = _super.call(this, props) || this;
        _this.state = {
            opacity: new Animated.Value(1)
        };
        _this.startAnimation();
        return _this;
    }
    StatusButton.prototype.startAnimation = function () {
        this._animation = Animated.loop(Animated.sequence([
            Animated.timing(this.state.opacity, {
                toValue: 0,
                duration: 500
            }),
            Animated.timing(this.state.opacity, {
                toValue: 1,
                duration: 500
            }),
        ]));
        this._animation.start();
    };
    StatusButton.prototype.componentDidUpdate = function (prevProps) {
        if (this.props.status != prevProps.status) {
            if (this.props.status == ConnectionStatus.CONNECTING) {
                this.startAnimation();
            }
            else {
                this._animation.stop();
                this.setState({ opacity: new Animated.Value(1) });
            }
        }
        if (this.props.lastMessage && this.props.lastMessage != prevProps.lastMessage) {
            Toast.showShortBottom("Message from bluetooth device: " + this.props.lastMessage);
        }
    };
    StatusButton.prototype.render = function () {
        return (<View style={styles.container}>
                <AnimatedIcon name="bluetooth" style={this.getStyle()} size={30}/>
            </View>);
    };
    StatusButton.prototype.getStyle = function () {
        var style = { color: Colours[ConnectionStatus[this.props.status].toLowerCase()] };
        if (this.props.status === ConnectionStatus.CONNECTING) {
            style.opacity = this.state.opacity;
        }
        return style;
    };
    return StatusButton;
}(React.Component));
var mapStateToProps = function (state) {
    return {
        status: state.bluetooth.status,
        device: state.bluetooth.device,
        lastMessage: state.bluetooth.lastMessage
    };
};
export default connect(mapStateToProps)(StatusButton);
var styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingRight: 10
    }
});
