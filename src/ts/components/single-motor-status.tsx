import React from "react";
import {ScrollView, StyleSheet, View} from "react-native";
import {Grid, LineChart} from 'react-native-svg-charts'
import {DeviceState, State} from "../store";
import {connect} from "react-redux";
import {Card} from "react-native-material-ui";
import {OutputRegulationMode, OutputRunState, printMode, SystemOutputPort} from "../nxt-structure/motor-constants";
import {FormLabel, Text} from "react-native-elements";
import {Utils} from "../utils/utils";

type Props = {
    deviceInfo: DeviceState,
    output: SystemOutputPort,
}

const DEFAULT_DATA = [0];

class SingleMotorStatus extends React.Component<Props> {

    render() {
        let motor = this.props.deviceInfo.outputs[SystemOutputPort[this.props.output]];
        let charts = Object
            .keys(motor.data)
            .filter(s => s != "port" && s != "mode")
            .map((key) => SingleMotorStatus.renderChart(
                Utils.formatCamelTitle(key),
                motor.data[key],
                motor.dataHistory.map(data => data[key])
                )
            );

        return (
            <ScrollView>
                <Card>
                    <View style={{marginBottom: 10}}>
                        <FormLabel>Mode</FormLabel>
                        <Text style={styles.margin}>{printMode(motor.mode)}</Text>
                        <FormLabel>Regulation Mode</FormLabel>
                        <Text style={styles.margin}>{Utils.formatTitle(OutputRegulationMode[motor.regulationMode])}</Text>
                        <FormLabel>Run State</FormLabel>
                        <Text style={styles.margin}>{Utils.formatTitle(OutputRunState[motor.runState])}</Text>
                    </View>
                </Card>
                {charts}
            </ScrollView>
        );
    }

    static renderChart(title: string, data: number, dataHistory: number[]) {
        let props: any = {};
        if (dataHistory.length == 0) {
            dataHistory = DEFAULT_DATA;
        }
        if (dataHistory.every(v => v === dataHistory[0])) {
            props.yMax = dataHistory[0] + 10;
            props.yMin = dataHistory[0] - 10;
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

export default connect(mapStateToProps)(SingleMotorStatus);


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