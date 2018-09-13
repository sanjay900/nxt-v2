import {bluetooth} from "./bluetooth";
import {joystick} from "./joystick";
import {combineReducers} from "redux";
import {core} from "./core";
import {device} from "./device";

export const reducers = combineReducers({bluetooth: bluetooth, joystick: joystick, core: core, device: device});