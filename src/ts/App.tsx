import React from 'react';
import {Router, Scene, Stack} from "react-native-router-flux";
import TabIcon from "./components/tab-icon";
import RemoteControl from "./components/remote-control";
import AboutDevice from "./components/about-device";
import TabIconIon from "./components/tab-icon-ion";
import PlayTones from "./components/play-tones";
import SensorStatus from "./components/sensors";
import MotorStatus from "./components/motor-status";
import StatusButton from "./components/status-buttons";
import Settings from "./components/settings";
import {Provider} from 'react-redux';
import {Store} from 'redux';

const App: React.SFC<{ store: Store }> = (props) => {
  // @ts-ignore
  return (
    <Provider store={props.store}>
      <Router right={() => <StatusButton/>}>
        <Stack key="root" tabs={true}>
          <Scene key="remote-control" component={RemoteControl} title="Remote Control" iconType="fontawesome5"
                 icon={TabIcon}
                 iconName="gamepad"/>
          <Scene key="about-device" component={AboutDevice} title="About Device" iconType="fontawesome5" icon={TabIcon}
                 iconName="info-circle"/>
          <Scene key="play-tones" component={PlayTones} title="Play Tones" icon={TabIcon} iconType="fontawesome5"
                 iconName="music"/>
          <Scene key="sensor-info" component={SensorStatus} title="Sensors" icon={TabIcon} iconType="ion"
                 iconName="ios-analytics"/>
          <Scene key="motor-info" component={MotorStatus} title="Motors" icon={TabIcon} iconType="fontawesome5"
                 iconName="tachometer-alt"/>
          <Scene key="settings" component={Settings} title="Settings" icon={TabIcon} iconType="fontawesome5"
                 iconName="cog"/>
        </Stack>
      </Router>
    </Provider>
  );
};

export default App;