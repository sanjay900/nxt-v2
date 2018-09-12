import {createAction, createStandardAction} from "typesafe-actions";
import {ConnectionStatus, Joystick} from "./types";
import {Device} from "react-native-bluetooth-serial";

export const joystickMove = createAction("joystickMove", resolve => {
    return (event: Joystick) => resolve(event);
});
export const joystickRelease = createAction("joystickTouch", resolve => {
    return (joystick: string) => resolve(joystick);
});
export const joystickTouch = createAction("joystickRelease", resolve => {
    return (joystick: string) => resolve(joystick);
});