import {JoystickState} from "../actions/types";
import * as joystickActions from '../actions/joystick-actions';
import {ActionType, getType} from "typesafe-actions";

export type JoystickAction = ActionType<typeof joystickActions>;

const initialState: JoystickState = {
    steering: {
        x: 0,
        y: 0,
        name: 'steering',
        tapped: false
    },
    drive: {
        x: 0,
        y: 0,
        name: 'steering',
        tapped: false
    },
};

export const joystick = (state: JoystickState = initialState, action: JoystickAction) => {
    switch (action.type) {
        case getType(joystickActions.joystickMove):
            return {...state, list: action.payload};
        case getType(joystickActions.joystickRelease):
            return {...state, list: action.payload};
        case getType(joystickActions.joystickTouch):
            return {...state, list: action.payload};
    }
    return state;
};