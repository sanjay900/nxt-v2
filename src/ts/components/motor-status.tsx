import React from "react";
import {Button, StyleSheet, View} from "react-native";
import {DeviceState, State, SystemOutput} from "../store";
import {connect} from "react-redux";
import {Dispatch} from "redux";
import {disableMotorListener, enableMotorListener} from "../actions/motor-actions";
import {Card} from "react-native-material-ui";
import {FormLabel, Text} from "react-native-elements";
import {SystemOutputPort} from "../nxt-structure/motor-constants";
import {Actions} from "react-native-router-flux";

type Props = {
    deviceInfo: DeviceState,
    listenToMotorState: () => {},
    stopListeningToMotorState: () => {}
}

class Motors extends React.Component<Props> {
    render() {
        return (
            <View>
                {Object.values(this.props.deviceInfo.outputs).map(Motors.renderMotor)}
            </View>
        );
    }

    static renderMotor(output: SystemOutput) {
        if (!output.data) {
            return <View key="no data"/>;
        }
        return (
            <Card key={SystemOutputPort[output.data.port]}>
                <View>
                    <Text h4 style={styles.title}>Motor {SystemOutputPort[output.data.port]}</Text>
                    <FormLabel>Power</FormLabel>
                    <Text style={styles.margin}>{output.data.power}</Text>
                    <FormLabel>Rotation Count</FormLabel>
                    <Text style={styles.margin}>{output.data.rotationCount}</Text>
                    <View style={styles.button}>
                        <Button title="More information" onPress={() => Actions.push("motor-info-expanded", {
                            output: output.data.port,
                            title: `Motor ${SystemOutputPort[output.data.port]} Information`
                        })}/>
                    </View>
                </View>
            </Card>
        )
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
    }, button: {
        marginTop: 20
    }, title: {
        marginTop: 10,
        marginLeft: 20,
        marginBottom: 0
    }

});