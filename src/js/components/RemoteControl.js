// @flow
import { StyleSheet, View, Text, Button } from "react-native";
import React from "react";
import Joystick from "./Joystick";
import { connect } from 'react-redux';
import type { Mode, State } from "../actions/types";

type Props = {
    onSwapModeClick: () => {},
    currentMode: Mode
}
const RemoteControl = ({ onSwapModeClick, currentMode }: Props) => {
    if (currentMode == "JOYSTICK") {
        return (
            <View style={styles.container}>
                <View style={styles.joyContainer}>
                    <Joystick lockY={true} color="black" name="STEERING" />
                    <Joystick lockX={true} color="black" name="DRIVE" />
                </View>
                <Button onPress={onSwapModeClick} title="Swap to Tilt Controls" />
            </View>
        );
    }
    return (
        <View style={styles.container}>
            <Text>{currentMode}</Text>
            <Button onPress={onSwapModeClick} title="Swap to Joystick Controls" />
        </View>
    );
};
const mapStateToProps = (state: State) => {
    return {
        currentMode: state.core.mode
    };
};
const mapDispatchToProps = dispatch => {
    return {
        onSwapModeClick: () => {
            dispatch({ type: "TOGGLE_MODE" });
        }
    };
};
const styles = StyleSheet.create({
    container: {
        flex: 1
    }, joyContainer: {
        flex: 1,
        flexDirection: 'row'
    }
});

export default connect(mapStateToProps, mapDispatchToProps)(RemoteControl);