var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    }
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
import React from "react";
import { Button, StyleSheet, View } from "react-native";
import { connect } from "react-redux";
import { Card } from "react-native-material-ui";
import { FormLabel, Text } from "react-native-elements";
import { SystemOutputPort } from "../nxt-structure/motor-constants";
import { Actions } from "react-native-router-flux";
var Motors = /** @class */ (function (_super) {
    __extends(Motors, _super);
    function Motors() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Motors.prototype.render = function () {
        return (<View>
                {Object.values(this.props.deviceInfo.outputs).map(Motors.renderMotor)}
            </View>);
    };
    Motors.renderMotor = function (output) {
        if (!output.data) {
            return <View key="no data"/>;
        }
        return (<Card key={SystemOutputPort[output.data.port]}>
                <View>
                    <Text h4 style={styles.title}>Motor {SystemOutputPort[output.data.port]}</Text>
                    <FormLabel>Power</FormLabel>
                    <Text style={styles.margin}>{output.data.power}</Text>
                    <FormLabel>Rotation Count</FormLabel>
                    <Text style={styles.margin}>{output.data.rotationCount}</Text>
                    <View style={styles.button}>
                        <Button title="More information" onPress={function () { return Actions.push("motor-info-expanded", {
            output: output.data.port,
            title: "Motor " + SystemOutputPort[output.data.port] + " Information"
        }); }}/>
                    </View>
                </View>
            </Card>);
    };
    return Motors;
}(React.Component));
var mapStateToProps = function (state) {
    return {
        deviceInfo: state.device
    };
};
export default connect(mapStateToProps)(Motors);
var styles = StyleSheet.create({
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
