import * as bluetooth from './bluetooth-epics';
import {combineEpics} from "redux-observable";
import * as device from "./device-epics";
export const epics = combineEpics(...[...Object.values(bluetooth), ...Object.values(device)]);