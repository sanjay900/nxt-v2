import {createAction} from "typesafe-actions";

export var joystickMove = createAction("joystickMove", function (resolve) {
    return function (event) {
        return resolve(event);
    };
});
export var joystickRelease = createAction("joystickTouch", function (resolve) {
    return function (joystick) {
        return resolve(joystick);
    };
});
export var joystickTouch = createAction("joystickRelease", function (resolve) {
    return function (joystick) {
        return resolve(joystick);
    };
});
