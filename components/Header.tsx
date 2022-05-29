import { StyleSheet } from "react-native";
import { Text, View } from "./ThemedDefaultComponents";

export default function Header() {
    return (
        <View style={styles.container}>
            <Text style={styles.logoText}>Polaroid</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        height: 90,
        paddingHorizontal: 16,
        paddingBottom: 5,
        justifyContent: 'flex-end'
    },
    logoText: {
        fontFamily: 'cookie-handwriting',
        fontWeight: '400',
        fontSize: 36,
    }
})