import {StyleSheet, View} from "react-native";
import React from "react";
import Icon from "react-native-vector-icons/FontAwesome5";

export default class TabIcon extends React.Component<{ iconName: string, focused: boolean, tintColor: string }> {
    render() {

        /** some styling **/

        return (
            <View style={styles.container}>
                <Icon name={this.props.iconName} color={this.props.focused ? "#4F8EF7" : this.props.tintColor}
                      size={20}/>
            </View>
        );
    }
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F5FCFF',
    }
});