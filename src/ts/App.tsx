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
import {connect, Provider} from 'react-redux';
import {Dispatch, Store} from 'redux';
import {State} from "./store";
import {Text, View} from "react-native";
import PopupDialog from "react-native-popup-dialog";
import {Button} from "react-native-elements";
import {writeFile} from "./actions/device-actions";
import {NXTFile} from "./nxt-structure/nxt-file";
import SteeringControl from "../../SteeringControl.rxe";

type Props = {
    store: Store,
    programToUpload?: string,
    uploadFile: (file: string)=>{}
}

class App extends React.Component<Props> {
    private popupDialog: PopupDialog | null;

    render() {
        return (
            <Provider store={this.props.store}>
                <View style={{flex: 1}}>
                    <Router right={() => <StatusButton/>}>
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
                        </Modal>
                    </Router>
                    <PopupDialog
                        ref={(popupDialog) => {
                            this.popupDialog = popupDialog;
                        }}
                    >
                        <View>
                            <Text>Hello</Text>
                            <Button title="Upload Program" onPress={this.writeProgram.bind(this)}/>
                            <Button title="Cancel" onPress={() => this.popupDialog!.dismiss()}/>
                        </View>
                    </PopupDialog>
                </View>
            </Provider>
        );
    }


    componentDidUpdate(prevProps: Props) {
        if (this.props.programToUpload && !prevProps.programToUpload && this.popupDialog) {
            this.popupDialog.show();
        }
    }

    private writeProgram() {
        this.popupDialog!.dismiss();
        if (this.props.programToUpload) {
            this.props.uploadFile(this.props.programToUpload);
        }
    }
}

const mapStateToProps = (state: State) => {
    return {
        programToUpload: state.device.info.programToUpload
    };
};
const mapDispatchToProps = (dispatch: Dispatch) => {
    return {
        uploadFile: (file: string) => {
            let nFile = new NXTFile(file, SteeringControl);
            nFile.autoStart = true;
            return dispatch(writeFile.request(nFile));
        }
    }
};
export default connect(mapStateToProps, mapDispatchToProps)(App);