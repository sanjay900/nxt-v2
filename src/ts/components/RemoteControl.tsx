import {Button, StyleSheet, Text, View} from "react-native";
import React from "react";
import Joystick from "./Joystick";
import {connect} from 'react-redux';
import {State} from "../store";
import {toggle} from "../actions/core-actions";
import {Mode} from "../reducers/joystick";

type Props = {
    currentMode: Mode,
    onSwapModeClick: () => any
}

const RemoteControl: React.SFC<Props> = ({onSwapModeClick, currentMode}: Props) => {
    if (currentMode == Mode.JOYSTICK) {
        return (
            <View style={styles.container}>
                <View style={styles.joyContainer}>
                    <Joystick lockY={true} color="black" name="STEERING"/>
                    <Joystick lockX={true} color="black" name="DRIVE"/>
                </View>
                <Button onPress={onSwapModeClick} title="Swap to Tilt Controls"/>
            </View>
        );
    }
    return (
        <View style={styles.container}>
            <Text>{currentMode}</Text>
            <Button onPress={onSwapModeClick} title="Swap to Joystick Controls"/>
        </View>
    );
};
const mapStateToProps = (state: State) => {
    return {
        currentMode: state.core.mode
    };
};
const mapDispatchToProps = (dispatch: Function) => {
    return {
        onSwapModeClick: () => dispatch(toggle())
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