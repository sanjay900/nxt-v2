import React from "react";
import FontAwesomeIcon from "react-native-vector-icons/FontAwesome5"
import IonIcon from "react-native-vector-icons/Ionicons"

type Props = {
  iconName: string,
  focused: boolean,
  tintColor: string,
  iconType: string
}
const Icon: React.SFC<Props> = ({iconName, focused, tintColor, iconType}: Props) => {
  if (iconType == "ion") {
    return (
      <IonIcon name={iconName}
               color={focused ? "#4F8EF7" : tintColor}
               size={20}/>
    );
  } else {
    return (
      <FontAwesomeIcon name={iconName}
                       color={focused ? "#4F8EF7" : tintColor}
                       size={20}/>
    );
  }
};
export default Icon;