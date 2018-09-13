import { Button, StyleSheet, Text, View } from "react-native";
import React from "react";
import { connect } from 'react-redux';
import { setName } from "../actions/device-actions";
var AboutDevice = function (_a) {
    var deviceInfo = _a.deviceInfo, setName = _a.setName;
    return (<View style={styles.container}>
            <Text>{deviceInfo.info.deviceName}</Text>
            <Button onPress={setName} title="Set name"/>
        </View>);
};
var mapStateToProps = function (state) {
    return {
        deviceInfo: state.device
    };
};
var mapDispatchToProps = function (dispatch) {
    return {
        setName: function () { return dispatch(setName("Test Dev")); }
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
export default connect(mapStateToProps, mapDispatchToProps)(AboutDevice);
