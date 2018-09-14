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
import React, { Component } from "react";
import { StyleSheet, View } from "react-native";
import { PanGestureHandler, State } from "react-native-gesture-handler";
import { connect } from "react-redux";
import { joystickMove, joystickRelease, joystickTouch } from "../actions/joystick-actions";
var CIRCLE_SIZE = 80;
var MAX = 70;
var BACK_SIZE_LOCKED = CIRCLE_SIZE / 2;
var BACK_SIZE = CIRCLE_SIZE + MAX;
var Joystick = /** @class */ (function (_super) {
    __extends(Joystick, _super);
    function Joystick(props) {
        var _this = _super.call(this, props) || this;
        _this.state = { width: 0, height: 0, tapped: false, x: 0, y: 0, centerX: 0, centerY: 0, name: props.name };
        return _this;
    }
    Joystick.prototype.render = function () {
        return (<View style={styles.container} onLayout={this.onPageLayout.bind(this)}>
                <View style={[styles.circle, this.getBackStyle()]}/>
                <PanGestureHandler onGestureEvent={this.onMove.bind(this)} onHandlerStateChange={this.startStop.bind(this)}>
                    <View style={[styles.circle, this.getStyle()]}/>
                </PanGestureHandler>
            </View>);
    };
    Joystick.prototype.startStop = function (event) {
        if (event.nativeEvent.state == State.BEGAN) {
            this.setState(function () {
                return { tapped: true };
            });
            this.props.dispatch(joystickTouch(this.props.name));
        }
        else if (event.nativeEvent.state == State.END || event.nativeEvent.state == State.FAILED) {
            this.setState(function () {
                return { tapped: false, x: 0, y: 0 };
            });
            this.props.dispatch(joystickRelease(this.props.name));
        }
    };
    Joystick.prototype.onMove = function (event) {
        var _a = event.nativeEvent, absoluteX = _a.absoluteX, absoluteY = _a.absoluteY;
        var diffX = absoluteX - this.state.centerX;
        var diffY = absoluteY - this.state.centerY;
        diffX = Math.max(-MAX, Math.min(MAX, diffX));
        diffY = Math.max(-MAX, Math.min(MAX, diffY));
        if (this.props.lockX) {
            diffX = 0;
        }
        if (this.props.lockY) {
            diffY = 0;
        }
        this.setState(function () {
            return { x: diffX, y: diffY };
        });
        this.props.dispatch(joystickMove({ x: diffX / MAX, y: diffY / MAX, name: this.props.name, tapped: true }));
    };
    Joystick.prototype.getBackStyle = function () {
        var x = this.props.lockX ? BACK_SIZE_LOCKED : BACK_SIZE;
        var y = this.props.lockY ? BACK_SIZE_LOCKED : BACK_SIZE;
        return {
            backgroundColor: this.props.color,
            opacity: this.state.tapped ? 0.5 : 0.1,
            left: (this.state.width - x) / 2,
            top: (this.state.height - y) / 2,
            width: x,
            height: y,
        };
    };
    Joystick.prototype.getStyle = function () {
        return {
            backgroundColor: this.props.color,
            opacity: this.state.tapped ? 0.8 : 0.4,
            left: (this.state.width - CIRCLE_SIZE) / 2 + this.state.x,
            top: (this.state.height - CIRCLE_SIZE) / 2 + this.state.y,
            width: CIRCLE_SIZE,
            height: CIRCLE_SIZE,
        };
    };
    Joystick.prototype.onPageLayout = function (event) {
        var _a = event.nativeEvent.layout, width = _a.width, height = _a.height, x = _a.x, y = _a.y;
        this.setState(function () {
            return { width: width, height: height, centerX: x + width / 2, centerY: y + height / 2 + CIRCLE_SIZE };
        });
    };
    return Joystick;
}(Component));
export default connect()(Joystick);
var styles = StyleSheet.create({
    circle: {
        borderRadius: CIRCLE_SIZE / 2,
        position: 'absolute'
    },
    container: {
        flex: 1,
    },
});
