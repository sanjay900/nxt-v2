var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
import * as joystickActions from '../actions/joystick-actions';
import { getType } from "typesafe-actions";
var initialState = {
    steering: {
        x: 0,
        y: 0,
        name: 'steering',
        tapped: false
    },
    drive: {
        x: 0,
        y: 0,
        name: 'steering',
        tapped: false
    },
};
export var joystick = function (state, action) {
    if (state === void 0) { state = initialState; }
    switch (action.type) {
        case getType(joystickActions.joystickMove):
            return __assign({}, state, { list: action.payload });
        case getType(joystickActions.joystickRelease):
            return __assign({}, state, { list: action.payload });
        case getType(joystickActions.joystickTouch):
            return __assign({}, state, { list: action.payload });
    }
    return state;
};
