import {bluetooth} from "./bluetooth";
import {combineReducers} from "redux";
import {core} from "./core";
import {device} from "./device";

export const reducers = combineReducers({bluetooth: bluetooth, core: core, device: device});