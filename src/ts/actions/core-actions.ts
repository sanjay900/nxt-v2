import {createAction} from "typesafe-actions";
import {Actions} from "react-native-router-flux";

export const toggle = createAction("toggle");
export const pageChange = createAction("pageChange", (resolve) => (params) => resolve({
    scene: Actions.currentScene.replace("_", ""),
    params
}));
