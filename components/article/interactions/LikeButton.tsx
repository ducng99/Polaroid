import { useEffect, useRef } from "react";
import { Animated, StyleSheet } from "react-native";
import useColorScheme from "../../../hooks/useColorScheme";
import { View } from "../../ThemedDefaultComponents";
import { AnimatedIonicons } from "../../VectorIcons";

const iconSize = 27;
const iconMaxGrow = 1.1;

interface IProps {
    isLiked: boolean;
    onPress: (liked: boolean) => void;
}

export default function LikeButton(props: IProps) {
    const colorScheme = useColorScheme();
    const iconSizeScale = useRef(new Animated.Value(1)).current;

    useEffect(() => {
        Animated.sequence([
            Animated.timing(iconSizeScale, {
                toValue: 0,
                duration: 0,
                useNativeDriver: false
            }),
            Animated.timing(iconSizeScale, {
                toValue: iconMaxGrow,
                duration: 170,
                useNativeDriver: false
            }),
            Animated.timing(iconSizeScale, {
                toValue: 0.92,
                duration: 170,
                useNativeDriver: false
            }),
            Animated.timing(iconSizeScale, {
                toValue: 1,
                duration: 170,
                useNativeDriver: false
            })
        ]).start();
    }, [props.isLiked]);

    const onPress = () => {
        props.onPress(!props.isLiked);
    }

    return (
        <View style={styles.iconContainer}>
            <AnimatedIonicons
                name={props.isLiked ? 'heart' : 'heart-outline'}
                color={props.isLiked ? styles.iconActive.color : iconColors[colorScheme].color}
                style={{
                    fontSize: iconSizeScale.interpolate({
                        inputRange: [0, 1],
                        outputRange: [0, iconSize]
                    })
                }}
                onPress={onPress}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    iconContainer: {
        width: iconSize * iconMaxGrow,
        height: iconSize * iconMaxGrow,
        alignItems: 'center',
        justifyContent: 'center',
    },
    iconActive: {
        color: '#ed4956',
    }
});

const iconColors = {
    light: {
        color: '#000'
    },
    dark: {
        color: '#fff',
    }
};