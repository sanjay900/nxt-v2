import * as bluetooth from './bluetooth-epics';
import {combineEpics} from "redux-observable";
import * as device from "./device-epics";

export const epics = combineEpics(bluetooth.connectToDevice, bluetooth.requestDevices, bluetooth.disconnectFromDevice, device.sendPacket, device.writeFile);