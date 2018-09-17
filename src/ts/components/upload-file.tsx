import {StyleSheet, View} from "react-native";
import React from "react";
import {connect} from 'react-redux';
import {State} from "../store";
import {DeviceState} from "../reducers/device";
import {FormLabel, Text} from "react-native-elements";
import * as Progress from 'react-native-progress';
import {NXTFile} from "../nxt-structure/nxt-file";

type Props = {
    deviceInfo: DeviceState
}

const UploadFile: React.SFC<Props> = ({deviceInfo}: Props) => {
    if (!deviceInfo.info.currentFile) return (
        <View style={styles.container}>
            <FormLabel>No file is currently being written!</FormLabel>
        </View>
    );
    let file: NXTFile = deviceInfo.info.currentFile;
    return (
        <View style={styles.container}>
            <FormLabel>File Name</FormLabel>
            <Text style={styles.margin}>{file.name}</Text>
            <FormLabel>Status</FormLabel>
            <Progress.Bar progress={file.percentage} style={styles.margin}/>
        </View>
    );
};
const mapStateToProps = (state: State) => {
    return {
        deviceInfo: state.device
    };
};
const styles = StyleSheet.create({
    container: {
        flex: 1
    }, joyContainer: {
        flex: 1,
        flexDirection: 'row'
    }, margin: {
        marginLeft: 20,
    }, input: {
        marginLeft: 20,
        backgroundColor: "lightgray",
        borderColor: "gray",
        borderWidth: 1
    }
});

export default connect(mapStateToProps)(UploadFile);