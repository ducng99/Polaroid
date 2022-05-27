import { TextInput, StyleSheet } from "react-native";
import useColorScheme from "../hooks/useColorScheme";

interface IProps {
    placeholder?: string;
    isPassword?: boolean;
    onChangeText?: (text: string) => void;
}

export default function InputBox(props: IProps) {
    const colorScheme = useColorScheme();

    return (
        <TextInput placeholder={props.placeholder} style={[styles.inputBox, styles.inputBox[colorScheme]]} placeholderTextColor={'#666'} secureTextEntry={props.isPassword} onChangeText={props.onChangeText} />
    )
}

const styles = StyleSheet.create({
    inputBox: {
        fontSize: 16,
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderRadius: 5,
        marginVertical: 8,
        
        light: {
            backgroundColor: '#fafafa',
            color: '#262626',
        },
        dark: {
            backgroundColor: '#333',
            color: '#fff',
        }
    }
});