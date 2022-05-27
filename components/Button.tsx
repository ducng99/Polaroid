import { GestureResponderEvent, StyleSheet, Text, TouchableOpacity } from "react-native";

interface IProps {
    onPress?: (event: GestureResponderEvent) => void;
    title: string;
    disabled?: boolean
}

export default function Button(props: IProps) {
    return (
        <TouchableOpacity style={{ ...styles.button, ...(props.disabled ? styles.button_disabled : {}) }} onPress={props.onPress} disabled={props.disabled}>
            <Text style={{ ...styles.innerText, ...(props.disabled ? styles.innerText_disabled : {}) }}>{props.title}</Text>
        </TouchableOpacity >
    )
}

const styles = StyleSheet.create({
    button: {
        alignItems: 'center',
        backgroundColor: '#0095f6',
        fontSize: 16,
        paddingHorizontal: 20,
        paddingVertical: 16,
        borderRadius: 0,
        marginVertical: 8,
    },
    button_disabled: {
        backgroundColor: '#0095f655',
    },
    innerText: {
        color: '#fff',
        fontWeight: 'bold',
    },
    innerText_disabled: {
        color: '#ffffff55',
    }
});