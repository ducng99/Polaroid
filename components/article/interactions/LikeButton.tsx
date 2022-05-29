import { useRef, useState } from "react";
import { Animated, Pressable, StyleSheet } from "react-native";
import useColorScheme from "../../../hooks/useColorScheme";
import { View } from "../../ThemedDefaultComponents";
import { AnimatedAntDesign } from "../../VectorIcons";

const iconSize = 24;
const iconMaxGrow = 1.1;

export default function LikeButton() {
    const [isLiked, setLiked] = useState(false);
    const colorScheme = useColorScheme();
    const iconSizeScale = useRef(new Animated.Value(1)).current;

    const onPress = () => {
        setLiked(() => !isLiked);

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
    }

    return (
        <Pressable
            onPress={onPress}
        >
            <View style={styles.iconContainer}>
                <AnimatedAntDesign
                    name={isLiked ? 'heart' : 'hearto'}
                    color={isLiked ? styles.iconActive.color : iconColors[colorScheme].color}
                    style={{
                        fontSize: iconSizeScale.interpolate({
                            inputRange: [0, 1],
                            outputRange: [0, iconSize]
                        })
                    }}
                />
            </View>
        </Pressable>
    )
}

const styles = StyleSheet.create({
    container: {
        alignItems: 'flex-start',
    },
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

const iconColors = StyleSheet.create({
    light: {
        color: '#000'
    },
    dark: {
        color: '#fff',
    }
})