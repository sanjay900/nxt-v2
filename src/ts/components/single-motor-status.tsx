import React from "react";
import {StyleSheet} from "react-native";
import {Grid, LineChart} from 'react-native-svg-charts'
import {DeviceState, State} from "../store";
import {connect} from "react-redux";
import {Dispatch} from "redux";
import {disableMotorListener, enableMotorListener} from "../actions/motor-actions";
import {Card} from "react-native-material-ui";

type Props = {
    deviceInfo: DeviceState,
    motor: string,
    listenToMotorState: () => {},
    stopListeningToMotorState: () => {}
}

class Motors extends React.Component<Props> {
    componentDidMount() {
        this.props.listenToMotorState();
    }

    componentWillUnmount() {
        this.props.stopListeningToMotorState();
    }

    render() {
        return (
            <Card>
                <LineChart
                    style={{height: 200}}
                    data={this.props.deviceInfo.outputs.B.dataHistory.map(s => s.rotationCount)}
                    svg={{stroke: 'rgb(134, 65, 244)'}}
                    contentInset={{top: 20, bottom: 20}}
                >
                    <Grid/>
                </LineChart>
            </Card>
        );
    }
}

const mapStateToProps = (state: State) => {
    return {
        deviceInfo: state.device
    };
};

const mapPropsToDispatch = (dispatch: Dispatch) => {
    return {
        listenToMotorState: () => dispatch(enableMotorListener()),
        stopListeningToMotorState: () => dispatch(disableMotorListener())
    }
};

export default connect(mapStateToProps, mapPropsToDispatch)(Motors);


const styles = StyleSheet.create({
    container: {
        flex: 1
    }, margin: {
        marginLeft: 20,
    },
});