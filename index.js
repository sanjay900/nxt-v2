/** @format */

import {AppRegistry} from 'react-native';
import App from './src/js/App';
import {name as appName} from './app.json';
import React from 'react';
import { createStore, combineReducers } from 'redux';
import * as reducers from './src/js/reducers';

const store = createStore(combineReducers(reducers));
AppRegistry.registerComponent(appName, () => ()=> <App store={store} />);
