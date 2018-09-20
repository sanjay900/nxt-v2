import {combineReducers} from "redux";
import {bluetooth} from "./bluetooth";
import {core} from "./core";
import {device} from "./device";

export var reducers = combineReducers({bluetooth: bluetooth, core: core, device: device});
