import React from "react";
import {Dimensions, StyleSheet, TouchableOpacity, View} from "react-native";
import {ScrollView} from "react-native-gesture-handler";
import {connect} from "react-redux";
import {Dispatch} from "redux";
import {writePacket} from "../actions/device-actions";
import {PlayTone} from "../nxt-structure/packets/direct/play-tone";

const keyWidth = 50;
const pianoKeys: { whiteKeyId: number, blackKeyId?: number }[] = [
    {whiteKeyId: 16},
    {whiteKeyId: 18, blackKeyId: 17},
    {whiteKeyId: 20, blackKeyId: 19},
    {whiteKeyId: 21},
    {whiteKeyId: 23, blackKeyId: 22},
    {whiteKeyId: 25, blackKeyId: 24},
    {whiteKeyId: 27, blackKeyId: 26},
    {whiteKeyId: 28},
    {whiteKeyId: 30, blackKeyId: 29},
    {whiteKeyId: 32, blackKeyId: 31},
    {whiteKeyId: 33},
    {whiteKeyId: 35, blackKeyId: 34},
    {whiteKeyId: 37, blackKeyId: 36},
    {whiteKeyId: 39, blackKeyId: 38},
    {whiteKeyId: 40},
    {whiteKeyId: 42, blackKeyId: 41},
    {whiteKeyId: 44, blackKeyId: 43},
    {whiteKeyId: 45},
    {whiteKeyId: 47, blackKeyId: 46},
    {whiteKeyId: 49, blackKeyId: 48},
    {whiteKeyId: 51, blackKeyId: 50},
    {whiteKeyId: 52},
    {whiteKeyId: 54, blackKeyId: 53},
    {whiteKeyId: 56, blackKeyId: 55},
    {whiteKeyId: 57},
    {whiteKeyId: 59, blackKeyId: 58},
    {whiteKeyId: 61, blackKeyId: 60},
    {whiteKeyId: 63, blackKeyId: 62},
    {whiteKeyId: 64}
];
type Props = {
    playNote: (number: number) => {}
}

const PlayTones: React.SFC<Props> = ({playNote}: Props) => {
    let keyboard = pianoKeys.map((key) => {
        return <TouchableOpacity onPress={() => playNote(key.whiteKeyId)}
                                 key={key.whiteKeyId}
                                 style={[styles.whiteKey, {height: Dimensions.get('window').height}]}>
            <View/>
        </TouchableOpacity>;
    });
    let keyboard2 = pianoKeys.map((key, i) => {
        if (key.blackKeyId) {
            return <TouchableOpacity onPress={() => playNote(key.blackKeyId!)}
                                     activeOpacity={0.5}
                                     key={key.whiteKeyId}
                                     style={[styles.blackKey, {left: i * keyWidth - keyWidth / 4}]}>
                <View/>
            </TouchableOpacity>;
        }
    });

    return (
        <View style={styles.container}>
            <ScrollView horizontal={true}>
                {keyboard}
                {keyboard2}
            </ScrollView>
        </View>
    );
};

function propsToDispatch(dispatch: Dispatch): Props {
    return {
        playNote: (note: number) => {
            let freq: number = 27.5 * Math.pow(2, ((note + 21) / 12));
            return dispatch(writePacket.request(PlayTone.createPacket(freq, 100)));
        }
    }
}

export default connect(null, propsToDispatch)(PlayTones);
const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        flex: 1,
    },
    whiteKey: {
        flex: 1,
        backgroundColor: "white",
        borderColor: "gray",
        borderWidth: 1,
        width: keyWidth
    },
    blackKey: {
        backgroundColor: "black",
        height: "50%",
        top: 0,
        width: keyWidth / 2,
        position: "absolute"
    },
});