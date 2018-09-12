import {CoreState, Mode} from "../actions/types";
import {bluetooth} from "./bluetooth";
import {joystick} from "./joystick";
import * as coreActions from '../actions/core-actions';
import {ActionType, getType} from "typesafe-actions";
import {combineReducers} from "redux";

export type CoreAction = ActionType<typeof coreActions>;

const initialState: CoreState = {
    mode: Mode.JOYSTICK
};

export function core(state: CoreState = initialState, action: CoreAction) {
    switch (action.type) {
        case getType(coreActions.toggle):
            return {
                ...state,
                mode: state.mode == Mode.JOYSTICK ? Mode.TILT : Mode.JOYSTICK
            }
    }
    return state;
}

export const reducers = combineReducers({bluetooth: bluetooth, joystick: joystick, core: core});