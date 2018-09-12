// @flow
import { StyleSheet, View, Text, Button } from "react-native";
import React from "react";
import Joystick from "./Joystick";
import { connect } from 'react-redux';
import { Mode } from "../actions/types";
import { toggle } from "../actions/core-actions";
var RemoteControl = function (_a) {
    var onSwapModeClick = _a.onSwapModeClick, currentMode = _a.currentMode;
    if (currentMode == Mode.JOYSTICK) {
        return (<View style={styles.container}>
                <View style={styles.joyContainer}>
                    <Joystick lockY={true} color="black" name="STEERING"/>
                    <Joystick lockX={true} color="black" name="DRIVE"/>
                </View>
                <Button onPress={onSwapModeClick} title="Swap to Tilt Controls"/>
            </View>);
    }
    return (<View style={styles.container}>
            <Text>{currentMode}</Text>
            <Button onPress={onSwapModeClick} title="Swap to Joystick Controls"/>
        </View>);
};
var mapStateToProps = function (state) {
    return {
        currentMode: state.core.mode
    };
};
var mapDispatchToProps = function (dispatch) {
    return {
        onSwapModeClick: function () { return dispatch(toggle()); }
    };
};
var styles = StyleSheet.create({
    container: {
        flex: 1
    }, joyContainer: {
        flex: 1,
        flexDirection: 'row'
    }
});
export default connect(mapStateToProps, mapDispatchToProps)(RemoteControl);
