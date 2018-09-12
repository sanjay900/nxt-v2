/** @format */
/* eslint react/display-name: 0 */
//The above rule misfires, so we need to disable it.
import {AppRegistry} from 'react-native';
import App from './src/ts/App';
import {name as appName} from './app.json';
import React from 'react';
import {applyMiddleware, createStore} from 'redux';
import {reducers} from './src/ts/reducers';
import {epics} from './src/ts/epics';
import {createEpicMiddleware} from "redux-observable";
import {listDevices} from "./src/ts/actions/bluetooth-actions";
import {initEvents} from "./src/ts/bluetooth-events";

const epicMiddleware = createEpicMiddleware();
//By dealing with the store here, we can still use hot-reloading while debugging.
const store = createStore(reducers, applyMiddleware(epicMiddleware));
epicMiddleware.run(epics);
store.dispatch(listDevices.request());
initEvents(store);

AppRegistry.registerComponent(appName, () => () => <App store={store}/>);
