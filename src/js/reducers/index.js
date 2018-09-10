// @flow
import type { Action, State, CoreState } from "../actions/types";
import {bluetooth} from "./bluetooth";
const initialState: State = {
    joystick: {
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
    },
    core: {
        mode: "JOYSTICK"
    }
};
export function core(state: CoreState = initialState.core, action: Action) {
    switch (action.type) {
        case "TOGGLE_MODE":
            return Object.assign({}, state, {
                mode: state.mode == "JOYSTICK" ? "TILT" : "JOYSTICK"
            });
    }
    return state;
}
export {bluetooth};

