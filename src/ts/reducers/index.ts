import {combineReducers} from "redux";
import {bluetooth} from "./bluetooth";
import {core} from "./core";
import {device} from "./device";

export const reducers = combineReducers({bluetooth, core, device});