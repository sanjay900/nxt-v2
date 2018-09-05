// @flow
import React, { Component } from "react";
import { StyleSheet, View } from "react-native";
import { PanGestureHandler, State, PanGestureHandlerGestureEvent, PanGestureHandlerStateChangeEvent } from "react-native-gesture-handler";

let CIRCLE_SIZE = 80;
let MAX = 70;
type JoystickState = {
    width: number,
    height: number,
    tapped: boolean,
    x: number,
    y: number,
    centerX: number,
    centerY: number
}
type Position = {
    x: number,
    y: number
}
type Props = {
    dx: number,
    dy: number,
    color: string,
    onMove: (Position)=>{}
}
export default class Joystick extends Component<Props, JoystickState> {

    constructor(props: Props) {
        super(props);
        this.state = { width: 0, height: 0, tapped: false, x: 0, y: 0, centerX: 0, centerY: 0 };
    }
    render() {
        return (
            <View style={styles.container} onLayout={this.onPageLayout.bind(this)}>
                <View style={[styles.circle, this.getBackStyle()]} />
                <PanGestureHandler
                    onGestureEvent={this.onMove.bind(this)}
                    onHandlerStateChange={this.startStop.bind(this)}>
                    <View style={[styles.circle, this.getStyle()]} />
                </PanGestureHandler>
            </View>
        );
    }
    startStop(event: PanGestureHandlerStateChangeEvent) {
        if (event.nativeEvent.state == State.BEGAN) {
            this.setState(() => { return { tapped: true }; });
        } else if (event.nativeEvent.state == State.END || event.nativeEvent.state == State.FAILED) {
            this.setState(() => { return { tapped: false, x: 0, y: 0 }; });
        }
    }
    onMove(event: PanGestureHandlerGestureEvent) {
        const { absoluteX, absoluteY } = event.nativeEvent;
        let diffX = absoluteX - this.state.centerX;
        let diffY = absoluteY - this.state.centerY;
        diffX = Math.max(-MAX, Math.min(MAX, diffX));
        diffY = Math.max(-MAX, Math.min(MAX, diffY));
        if (!this.props.dx) {
            diffX = 0;
        }
        if (!this.props.dy) {
            diffY = 0;
        }
        this.setState(() => { return { x: diffX, y: diffY }; });
        this.props.onMove({x: diffX / MAX, y: diffY / MAX});
    }
    getBackStyle() {
        let x = this.props.dx ? CIRCLE_SIZE + MAX : CIRCLE_SIZE / 2;
        let y = this.props.dy ? CIRCLE_SIZE + MAX : CIRCLE_SIZE / 2;
        return {
            backgroundColor: this.props.color,
            opacity: this.state.tapped ? 0.5 : 0.1,
            left: (this.state.width - x) / 2,
            top: (this.state.height - y) / 2,
            width: x,
            height: y,
        };
    }
    getStyle() {
        return {
            backgroundColor: this.props.color,
            opacity: this.state.tapped ? 0.8 : 0.4,
            left: (this.state.width - CIRCLE_SIZE) / 2 + this.state.x,
            top: (this.state.height - CIRCLE_SIZE) / 2 + this.state.y,
            width: CIRCLE_SIZE,
            height: CIRCLE_SIZE,
        };
    }

    onPageLayout(event: any) {
        const { width, height, x, y } = event.nativeEvent.layout;
        this.setState(() => {
            return { width: width, height: height, centerX: x + width / 2, centerY: y + height / 2 + CIRCLE_SIZE };
        });
    }
}

const styles = StyleSheet.create({
    circle: {
        borderRadius: CIRCLE_SIZE / 2,
        position: 'absolute'
    },
    container: {
        flex: 1,
        width: '50%',
    },
});