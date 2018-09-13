import * as bluetooth from './bluetooth-epics';
import {combineEpics} from "redux-observable";

export const epics = combineEpics(bluetooth.connectToDevice, bluetooth.requestDevices, bluetooth.sendPacket);