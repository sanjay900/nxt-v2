import React from 'react';
import {Actions, Modal, Router, Scene, Tabs} from "react-native-router-flux";
import TabIcon from "./components/tab-icon";
import RemoteControl from "./components/remote-control";
import AboutDevice from "./components/about-device";
import PlayTones from "./components/play-tones";
import SensorStatus from "./components/sensors";
import UploadFile from "./components/upload-file";
import MotorStatus from "./components/motor-status";
import StatusButton from "./components/status-button";
import Settings from "./components/settings";
import SingleMotorStatus from "./components/single-motor-status";
import SingleSensorStatus from "./components/single-sensor-status";
import {Provider} from 'react-redux';
import {Store} from 'redux';
import {StyleSheet, View} from "react-native";
import {pageChange} from "./actions/core-actions";

type Props = { store: Store };
const App: React.SFC<Props> = ({store}: Props) => {
    return (
        <Provider store={store}>
            <View style={styles.container}>
                <Router right={() => <StatusButton/>} onStateChange={(stateData: any)=>{
                    //I need a way to trigger redux changes, without over complicating things by linking to redux correctly. The below code
                    //pulls out parameters passed to each page, and passes them along to a pageChange action.
                    let scene = Actions.currentScene.replace("_","");
                    let sceneData = stateData["routes"].find((s: any)=>s.routeName == scene) || stateData["routes"][0]["routes"].find((s: any)=>s.routeName == scene);
                    if (sceneData && sceneData["routes"]) {
                        sceneData = sceneData["routes"][0] || sceneData;
                    }
                    if (sceneData) {
                        store.dispatch(pageChange(sceneData.params))
                    }
                }}>
                    <Modal hideNavBar>
                        <Tabs key="root">
                            <Scene key="remote-control" component={RemoteControl} title="Remote Control"
                                   iconType="fontawesome5"
                                   icon={TabIcon}
                                   iconName="gamepad"/>
                            <Scene key="about-device" component={AboutDevice} title="About Device"
                                   iconType="fontawesome5"
                                   icon={TabIcon}
                                   iconName="info-circle"/>
                            <Scene key="play-tones" component={PlayTones} title="Play Tones" icon={TabIcon}
                                   iconType="fontawesome5"
                                   iconName="music"/>
                            <Scene key="sensor-info" component={SensorStatus} title="Sensors" icon={TabIcon}
                                   iconType="ion"
                                   iconName="ios-analytics"/>
                            <Scene key="motor-info" component={MotorStatus} title="Motors" icon={TabIcon}
                                   iconType="fontawesome5"
                                   iconName="tachometer-alt"/>
                            <Scene key="settings" component={Settings} title="Settings" icon={TabIcon}
                                   iconType="fontawesome5"
                                   iconName="cog"/>
                        </Tabs>
                        <Scene key="status" title="Uploading file" component={UploadFile} hideNavBar={false}/>
                        <Scene key="motor-info-expanded" component={SingleMotorStatus} hideNavBar={false}/>
                        <Scene key="sensor-info-expanded" component={SingleSensorStatus} hideNavBar={false}/>
                    </Modal>
                </Router>
            </View>
        </Provider>
    );
};
export default App;
const styles = StyleSheet.create({
    container: {
        flex: 1
    }
});