import { TextInput, StyleSheet } from "react-native";

interface IProps {
    placeholder?: string;
    isPassword?: boolean;
    onChangeText?: (text: string) => void;
}

export default function InputBox(props: IProps) {    
    return (
        <TextInput placeholder={props.placeholder} style={styles.inputBox} placeholderTextColor={'#666'} secureTextEntry={props.isPassword} onChangeText={props.onChangeText}/>
    )
}

const styles = StyleSheet.create({
    inputBox: {
        backgroundColor: '#333',
        fontSize: 16,
        paddingHorizontal: 16,
        paddingVertical: 12,
        color: '#fff',
        borderRadius: 5,
        marginVertical: 8,
    }
});