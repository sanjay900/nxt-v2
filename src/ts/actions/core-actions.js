import { createAction } from "typesafe-actions";
import { Actions } from "react-native-router-flux";
export var toggle = createAction("toggle");
export var pageChange = createAction("pageChange", function (resolve) { return function (params) { return resolve({
    scene: Actions.currentScene.replace("_", ""),
    params: params
}); }; });
