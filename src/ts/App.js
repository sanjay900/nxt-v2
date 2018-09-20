import React from 'react';
import {Modal, Router, Scene, Tabs} from "react-native-router-flux";
import TabIcon from "./components/tab-icon";
import RemoteControl from "./components/remote-control";
import AboutDevice from "./components/about-device";
import PlayTones from "./components/play-tones";
import SensorStatus from "./components/sensors";
import UploadFile from "./components/upload-file";
import MotorStatus from "./components/motor-status";
import StatusButton from "./components/status-button";
import Settings from "./components/settings";
import {Provider} from 'react-redux';
import {StyleSheet, View} from "react-native";

var App = function (_a) {
    var store = _a.store;
    return (<Provider store={store}>
        <View style={styles.container}>
            <Router right={function () {
                return <StatusButton/>;
            }}>
                <Modal hideNavBar>
                    <Tabs key="root">
                        <Scene key="remote-control" component={RemoteControl} title="Remote Control"
                               iconType="fontawesome5" icon={TabIcon} iconName="gamepad"/>
                        <Scene key="about-device" component={AboutDevice} title="About Device" iconType="fontawesome5"
                               icon={TabIcon} iconName="info-circle"/>
                        <Scene key="play-tones" component={PlayTones} title="Play Tones" icon={TabIcon}
                               iconType="fontawesome5" iconName="music"/>
                        <Scene key="sensor-info" component={SensorStatus} title="Sensors" icon={TabIcon} iconType="ion"
                               iconName="ios-analytics"/>
                        <Scene key="motor-info" component={MotorStatus} title="Motors" icon={TabIcon}
                               iconType="fontawesome5" iconName="tachometer-alt"/>
                        <Scene key="settings" component={Settings} title="Settings" icon={TabIcon}
                               iconType="fontawesome5" iconName="cog"/>
                    </Tabs>
                    <Scene key="status" title="Uploading file" component={UploadFile} hideNavBar={false}/>
                </Modal>
            </Router>
        </View>
    </Provider>);
};
export default App;
var styles = StyleSheet.create({
    container: {
        flex: 1
    }
});
