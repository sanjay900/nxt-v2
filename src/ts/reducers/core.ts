import {ActionType, getType} from "typesafe-actions";
import {Mode} from "./device";
import * as coreActions from "../actions/core-actions";

export type CoreAction = ActionType<typeof coreActions>;
export type CoreState = {
    mode: Mode
}
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