import { Component } from "react";
import { PanResponder, StyleSheet, Text, View } from "react-native";
import React from "react";
import Joystick from "./Joystick";

export default class RemoteControl extends Component {
    constructor(props) {
        super(props);
        this.state = { left: { x: 0, y: 0 }, right: { x: 0, y: 0 } };
    }


    render() {
        return (
            <View style={styles.container}>
                <Joystick dx={true} onMove={this.updateLeft.bind(this)} />
                <Joystick dy={true} onMove={this.updateRight.bind(this)} />
            </View>
        );
    }
    updateLeft(evt) {
        this.setState(() => { return { left: evt } })
    }
    updateRight(evt) {
        this.setState(() => { return { right: evt } })
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'row'
    }
});