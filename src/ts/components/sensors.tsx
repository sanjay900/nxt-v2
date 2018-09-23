import React from "react";
import {StyleSheet} from "react-native";
import {Grid, LineChart} from 'react-native-svg-charts'
import {DeviceState, State} from "../store";
import {connect} from "react-redux";

type Props = {
    deviceInfo: DeviceState
}

const Sensors: React.SFC<Props> = ({deviceInfo}: Props) => {
    return (
        <LineChart
            style={{ height: 200 }}
            data={ deviceInfo.outputs.A.dataHistory.map(s => s.rotationCount) }
            svg={{ stroke: 'rgb(134, 65, 244)' }}
            contentInset={{ top: 20, bottom: 20 }}
        >
            <Grid/>
        </LineChart>
    );
};
const mapStateToProps = (state: State) => {
    return {
        deviceInfo: state.device
    };
};

export default connect(mapStateToProps)(Sensors);


const styles = StyleSheet.create({
    container: {
        flex: 1
    }, margin: {
        marginLeft: 20,
    },
});