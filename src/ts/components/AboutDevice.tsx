import {Button, StyleSheet, Text, View} from "react-native";
import React from "react";
import {connect} from 'react-redux';
import {State} from "../store";
import {DeviceState} from "../reducers/device";
import {setName} from "../actions/device-actions";

type Props = {
    deviceInfo: DeviceState,
    setName: () => {}
}

const AboutDevice: React.SFC<Props> = ({deviceInfo, setName}: Props) => {
    return (
        <View style={styles.container}>
            <Text>{deviceInfo.info.deviceName}</Text>
            <Button onPress={setName} title="Set name"/>
        </View>
    );
};
const mapStateToProps = (state: State) => {
    return {
        deviceInfo: state.device
    };
};
const mapDispatchToProps = (dispatch: Function) => {
    return {
        setName: () => dispatch(setName("Test Dev"))
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

export default connect(mapStateToProps, mapDispatchToProps)(AboutDevice);