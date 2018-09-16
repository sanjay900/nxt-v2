import React from "react";
import FontAwesomeIcon from "react-native-vector-icons/FontAwesome5";
import IonIcon from "react-native-vector-icons/Ionicons";
var Icon = function (_a) {
    var iconName = _a.iconName, focused = _a.focused, tintColor = _a.tintColor, iconType = _a.iconType;
    if (iconType == "ion") {
        return (<IonIcon name={iconName} color={focused ? "#4F8EF7" : tintColor} size={20}/>);
    }
    else {
        return (<FontAwesomeIcon name={iconName} color={focused ? "#4F8EF7" : tintColor} size={20}/>);
    }
};
export default Icon;
