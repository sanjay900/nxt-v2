import {getType} from "typesafe-actions";
import {Mode} from "../store";
import * as coreActions from "../actions/core-actions";
import {CoreAction, CoreState} from "../store";

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