import {Button, StyleSheet, View} from "react-native";
import React from "react";
import {connect} from 'react-redux';
import {State} from "../store";
import {DeviceState} from "../store";
import {FormLabel, Text} from "react-native-elements";
import * as Progress from 'react-native-progress';
import {NXTFile} from "../nxt-structure/nxt-file";
import {Actions} from "react-native-router-flux";

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
            <Text style={styles.margin}>{file.hasWritten() ? "Upload Complete!" : "Uploading File"}</Text>
            <View style={styles.container}/>
            <Button title="Return" onPress={Actions.pop}/>
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
    }, margin: {
        marginLeft: 20,
    },
});

export default connect(mapStateToProps)(UploadFile);