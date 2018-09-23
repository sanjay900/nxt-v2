import React from "react";
import {ScrollView, StyleSheet, View} from "react-native";
import {Grid, LineChart} from 'react-native-svg-charts'
import {DeviceState, State} from "../store";
import {connect} from "react-redux";
import {Card} from "react-native-material-ui";
import {FormLabel, Text} from "react-native-elements";
import {Utils} from "../utils/utils";

type Props = {
    deviceInfo: DeviceState,
    sensor: number,
}

const DEFAULT_DATA = [0];

class SingleSensorStatus extends React.Component<Props> {

    render() {
        let sensor = this.props.deviceInfo.inputs[this.props.sensor];
        let charts = Object
            .keys(sensor.data)
            .filter(s => s != "port")
            .map((key) => SingleSensorStatus.renderChart(
                Utils.formatCamelTitle(key),
                sensor.data[key],
                sensor.dataHistory.map(data => data[key])
                )
            );

        return (
            <ScrollView>
                <Card>
                    <View style={{marginBottom: 10}}>
                        <FormLabel>Type</FormLabel>
                        <Text style={styles.margin}>{sensor.type}</Text>
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

export default connect(mapStateToProps)(SingleSensorStatus);


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