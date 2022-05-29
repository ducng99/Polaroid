import { StyleSheet } from "react-native"
import { View } from "../ThemedDefaultComponents"
import LikeButton from "./interactions/LikeButton"

export default function InteractionBar() {

    return (
        <View style={styles.container}>
            <LikeButton />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        marginVertical: 6,
        marginHorizontal: 16,
        justifyContent: "center",
        alignItems: 'flex-start'
    }
})