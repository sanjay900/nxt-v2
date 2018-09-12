import * as bluetooth from './bluetooth-epics';
import {combineEpics} from "redux-observable";

export var epics = combineEpics(bluetooth.connectToDevice, bluetooth.requestDevices);
