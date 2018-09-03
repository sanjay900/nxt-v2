import React, {Component} from 'react';
import {
    AppRegistry,
    StyleSheet,
    Text,
    View,
} from 'react-native';
import {Actions, Router, Scene, Stack} from "react-native-router-flux";
import TabIcon from "./components/TabIcon";
import { Icon } from 'react-native-elements'
import RemoteControl from "./components/RemoteControl";
import AboutDevice from "./components/AboutDevice";
import TabIconIon from "./components/TabIconIon";
import PlayTones from "./components/PlayTones";
import SensorStatus from "./components/Sensors";
import MotorStatus from "./components/MotorStatus";

export default class App extends Component {
    constructor(props) {
        super(props);
        this.state = {page: 'second'};
    }

    render() {
        return (
            <Router>
                <Stack key="root" tabs={true}>
                    <Scene key="remote-control" component={RemoteControl} title="Remote Control" icon={TabIcon} iconName="gamepad"/>
                    <Scene key="about-device" component={AboutDevice} title="About Device" icon={TabIcon} iconName="info-circle"/>
                    <Scene key="play-tones" component={PlayTones} title="Play Tones" icon={TabIcon} iconName="music"/>
                    <Scene key="sensor-info" component={SensorStatus} title="Sensors" icon={TabIconIon} iconName="ios-analytics"/>
                    <Scene key="motor-info" component={MotorStatus} title="Motors" icon={TabIcon} iconName="tachometer-alt"/>
                </Stack>
            </Router>

        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F5FCFF',
    },
    welcome: {
        fontSize: 20,
        textAlign: 'center',
        margin: 10,
    },
    instructions: {
        textAlign: 'center',
        color: '#333333',
        marginBottom: 5,
    },
});