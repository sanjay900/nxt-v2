/** @format */
/* eslint react/display-name: 0 */
//The above rule misfires, so we need to disable it.
import {AppRegistry} from 'react-native';
import App from './src/js/App';
import {name as appName} from './app.json';
import React from 'react';
import { createStore, combineReducers, applyMiddleware } from 'redux';
import * as reducers from './src/js/reducers';
import thunk from 'redux-thunk';
import {requestDevices} from './src/js/actions/bluetooth-actions';
import BluetoothSerial from 'react-native-bluetooth-serial';

//By dealing with the store here, we can still use hot-reloading while debugging.
const store = createStore(combineReducers(reducers), applyMiddleware(thunk));
store.dispatch(requestDevices());
//TODO: handle bluetooth events and converting them to actions
BluetoothSerial.on('bluetoothEnabled', () => {});
BluetoothSerial.on('bluetoothDisabled', () => {});
BluetoothSerial.on('connectionLost', () => {
    store.dispatch({
        type: "CHANGE_STATUS",
        connectionStatus: "DISCONNECTEd",
        message: "Connection lost."
    });
});
AppRegistry.registerComponent(appName, () => ()=> <App store={store} />);
