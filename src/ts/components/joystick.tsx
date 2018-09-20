import React, {Component} from "react";
import {StyleSheet, View} from "react-native";
import {Joystick as JoystickEvent} from "../store";
import {
  PanGestureHandler,
  PanGestureHandlerGestureEvent,
  PanGestureHandlerStateChangeEvent,
  State
} from "react-native-gesture-handler";
import {connect} from "react-redux";
import {joystickMove} from "../actions/device-actions";
import {Dispatch} from "redux";
import {joystickRelease, joystickTouch} from "../actions/device-actions";

const CIRCLE_SIZE = 80;
const MAX = 70;
const BACK_SIZE_LOCKED = CIRCLE_SIZE / 2;
const BACK_SIZE = CIRCLE_SIZE + MAX;
type JoystickState = JoystickEvent & {
  width: number,
  height: number,
  centerX: number,
  centerY: number
}
type Props = {
  lockX?: boolean,
  lockY?: boolean,
  color: string,
  name: string,
  joystickTouch: (joystick: string) => {},
  joystickRelease: (joystick: string) => {},
  joystickMove: (event: JoystickEvent) => {},
}

class Joystick extends Component<Props, JoystickState> {

  constructor(props: Props) {
    super(props);
    this.state = {width: 0, height: 0, tapped: false, x: 0, y: 0, centerX: 0, centerY: 0, name: props.name};
  }

  render() {
    return (
      <View style={styles.container} onLayout={this.onPageLayout.bind(this)}>
        <View style={[styles.circle, this.getBackStyle()]}/>
        <PanGestureHandler
          onGestureEvent={this.onMove.bind(this)}
          onHandlerStateChange={this.startStop.bind(this)}>
          <View style={[styles.circle, this.getStyle()]}/>
        </PanGestureHandler>
      </View>
    );
  }

  startStop(event: PanGestureHandlerStateChangeEvent) {
    if (event.nativeEvent.state == State.BEGAN) {
      this.setState(() => {
        return {tapped: true};
      });
      this.props.joystickTouch(this.props.name);
    } else if (event.nativeEvent.state == State.END || event.nativeEvent.state == State.FAILED) {
      this.setState(() => {
        return {tapped: false, x: 0, y: 0};
      });
      this.props.joystickRelease(this.props.name);
    }
  }

  onMove(event: PanGestureHandlerGestureEvent) {
    const {absoluteX, absoluteY} = event.nativeEvent;
    let diffX = absoluteX - this.state.centerX;
    let diffY = absoluteY - this.state.centerY;
    diffX = Math.max(-MAX, Math.min(MAX, diffX));
    diffY = Math.max(-MAX, Math.min(MAX, diffY));
    if (this.props.lockX) {
      diffX = 0;
    }
    if (this.props.lockY) {
      diffY = 0;
    }
    this.setState(() => {
      return {x: diffX, y: diffY};
    });
    this.props.joystickMove({x: diffX / MAX, y: diffY / MAX, name: this.props.name, tapped: true});
  }

  getBackStyle() {
    let x = this.props.lockX ? BACK_SIZE_LOCKED : BACK_SIZE;
    let y = this.props.lockY ? BACK_SIZE_LOCKED : BACK_SIZE;
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
    const {width, height, x, y} = event.nativeEvent.layout;
    this.setState(() => {
      return {width: width, height: height, centerX: x + width / 2, centerY: y + height / 2 + CIRCLE_SIZE};
    });
  }
}

function propsToDispatch(dispatch: Dispatch) {
  return {
    joystickTouch: (joystick: string) => dispatch(joystickTouch(joystick)),
    joystickRelease: (joystick: string) => dispatch(joystickRelease(joystick)),
    joystickMove: (event: JoystickEvent) => dispatch(joystickMove(event)),
  }
}

export default connect(null, propsToDispatch)(Joystick);
const styles = StyleSheet.create({
  circle: {
    borderRadius: CIRCLE_SIZE / 2,
    position: 'absolute'
  },
  container: {
    flex: 1,
  },
});