import React from 'react';
import {Router, Scene, Stack} from "react-native-router-flux";
import TabIcon from "./components/TabIcon";
import RemoteControl from "./components/RemoteControl";
import AboutDevice from "./components/AboutDevice";
import TabIconIon from "./components/TabIconIon";
import PlayTones from "./components/PlayTones";
import SensorStatus from "./components/Sensors";
import MotorStatus from "./components/MotorStatus";
import StatusButton from "./components/StatusButton";
import Settings from "./components/Settings";
import {Provider} from 'react-redux';
import {Store} from 'redux';

const App: React.SFC<{ store: Store }> = (props) => {
    return (
        <Provider store={props.store}>
            <Router right={() => <StatusButton/>}> 
                <Stack key="root" tabs={true}>
                    <Scene key="remote-control" component={RemoteControl} title="Remote Control" icon={TabIcon}
                           iconName="gamepad"/>
                    <Scene key="about-device" component={AboutDevice} title="About Device" icon={TabIcon}
                           iconName="info-circle"/>
                    <Scene key="play-tones" component={PlayTones} title="Play Tones" icon={TabIcon} iconName="music"/>
                    <Scene key="sensor-info" component={SensorStatus} title="Sensors" icon={TabIconIon}
                           iconName="ios-analytics"/>
                    <Scene key="motor-info" component={MotorStatus} title="Motors" icon={TabIcon}
                           iconName="tachometer-alt"/>
                    <Scene key="settings" component={Settings} title="Settings" icon={TabIcon} iconName="cog"/>
                </Stack>
            </Router>
        </Provider>
    );
};

export default App;