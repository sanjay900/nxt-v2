var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
import { Mode } from "../actions/types";
import { bluetooth } from "./bluetooth";
import { joystick } from "./joystick";
import * as coreActions from '../actions/core-actions';
import { getType } from "typesafe-actions";
import { combineReducers } from "redux";
var initialState = {
    mode: Mode.JOYSTICK
};
export function core(state, action) {
    if (state === void 0) { state = initialState; }
    switch (action.type) {
        case getType(coreActions.toggle):
            return __assign({}, state, { mode: state.mode == Mode.JOYSTICK ? Mode.TILT : Mode.JOYSTICK });
    }
    return state;
}
export var reducers = combineReducers({ bluetooth: bluetooth, joystick: joystick, core: core });
