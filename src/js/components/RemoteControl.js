import { StyleSheet, View, Text, Button } from "react-native";
import PropTypes from 'prop-types';
import React from "react";
import Joystick from "./Joystick";
const RemoteControl = ({ onSwapModeClick, isJoystick }) => {
    if (!isJoystick) {
        return (
            <View style={styles.container}>
                <View style={styles.joyContainer}>
                    <Joystick dx={true} color="black" />
                    <Joystick dy={true} color="black" />
                </View>
                <Button onPress={onSwapModeClick} title="Swap to Tilt Controls" />
            </View>
        );
    }
return (
    <View style={styles.container}>
        <Text>Test</Text>
        <Button onPress={onSwapModeClick} title="Swap to Joystick Controls" />
    </View>
);
};

RemoteControl.propTypes = {
    onSwapModeClick: PropTypes.bool.isRequired,
    isJoystick: PropTypes.bool.isRequired,
};

const styles = StyleSheet.create({
    container: {
        flex: 1
    }, joyContainer: {
        flex: 1,
        flexDirection: 'row'
    }
});

export default RemoteControl;