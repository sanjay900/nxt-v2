import React from "react";
import {ScrollView, StyleSheet, View} from "react-native";
import {Grid, LineChart} from 'react-native-svg-charts'
import {DeviceState, State} from "../store";
import {connect} from "react-redux";
import {Dispatch} from "redux";
import {disableMotorListener, enableMotorListener} from "../actions/motor-actions";
import {Card} from "react-native-material-ui";
import {SystemOutputPort} from "../nxt-structure/motor-constants";
import {FormLabel, Text} from "react-native-elements";
import {Utils} from "../utils/utils";

type Props = {
    deviceInfo: DeviceState,
    output: SystemOutputPort,
    listenToMotorState: (output: SystemOutputPort[]) => {},
    stopListeningToMotorState: (output: SystemOutputPort[]) => {}
}

const DEFAULT_DATA = [10,10,10,10];

class SingleMotorStatus extends React.Component<Props> {
    componentDidMount() {
        this.props.listenToMotorState([this.props.output]);
    }

    componentWillUnmount() {
        this.props.stopListeningToMotorState([this.props.output]);
    }

    render() {
        let motor = this.props.deviceInfo.outputs[SystemOutputPort[this.props.output]];
        let charts = Object
            .keys(motor.data)
            .filter(s => s != "port")
            .map((key) => SingleMotorStatus.renderChart(
                Utils.formatCamelTitle(key),
                motor.data[key],
                motor.dataHistory.map(data => data[key])
                )
            );
        return (
            <ScrollView>
                {charts}
            </ScrollView>
        );
    }

    static renderChart(title: string, data: number, dataHistory: number[]) {
        var props: any = {};
        if (dataHistory.length == 0) {
            dataHistory = DEFAULT_DATA;
        }
        if (dataHistory.every( v => v === dataHistory[0] )) {
            props.yMax = dataHistory[0]+10;
            props.yMin = dataHistory[0]-10;
            props.gridMax = dataHistory[0]+10;
            props.gridMin = dataHistory[0]-10;
        }
        return (
            <Card key={title}>
                <View>
                    <FormLabel>{title}</FormLabel>
                    <Text style={styles.margin}>{data}</Text>

                    <LineChart
                        {...props}
                        style={styles.chart}
                        data={dataHistory}
                        svg={{stroke: 'rgb(134, 65, 244)'}}
                        contentInset={{top: 20, bottom: 20}}>
                        <Grid/>
                    </LineChart>
                </View>
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
        listenToMotorState: (output: SystemOutputPort[]) => dispatch(enableMotorListener(output)),
        stopListeningToMotorState: (output: SystemOutputPort[]) => dispatch(disableMotorListener(output))
    }
};

export default connect(mapStateToProps, mapPropsToDispatch)(SingleMotorStatus);


const styles = StyleSheet.create({
    container: {
        flex: 1
    }, margin: {
        marginLeft: 20,
        marginRight: 20,
    }, chart: {
        height: 200,
        marginLeft: 20,
        marginRight: 20,
    }
});