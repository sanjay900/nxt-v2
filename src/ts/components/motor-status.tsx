import React, {Component} from "react";
import {StyleSheet, Text, View} from "react-native";
import {Button, Card} from "react-native-material-ui";

export default class MotorStatus extends Component {

    render() {
        return (
            <Card>
                <Text>Hello world!</Text>
            </Card>
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
    }
});