import { useEffect, useRef } from "react";
import { Animated, StyleSheet } from "react-native";
import { Text } from "../ThemedDefaultComponents";

interface IProps {
    current: number;
    total: number;
}

export default function CarouselCounter({ current, total }: IProps) {
    const opacity = useRef(new Animated.Value(0)).current;
    const hideSequence = useRef(Animated.sequence([
        Animated.delay(5000),
        Animated.timing(opacity, {
            toValue: 0,
            duration: 200,
            useNativeDriver: true
        })
    ])).current;

    useEffect(() => {
        hideSequence.reset();
        Animated.timing(opacity, {
            toValue: 1,
            duration: 0,
            useNativeDriver: true
        }).start();

        hideSequence.start();
    }, [current]);

    return (
        <Animated.View style={[styles.container, { opacity }]}>
            <Text style={styles.text}>{current}/{total}</Text>
        </Animated.View>
    )
}

const styles = StyleSheet.create({
    container: {
        position: "absolute",
        top: 14,
        right: 14,
        borderRadius: 15,
        backgroundColor: "rgba(0, 0, 0, 0.75)",
        paddingHorizontal: 10,
        paddingVertical: 5,
    },
    text: {
        fontSize: 12,
        letterSpacing: 0,
        color: "white",
    }
})