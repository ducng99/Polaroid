import React, { useState, useRef } from "react";
import { Animated, Pressable, StyleSheet } from "react-native"
import { LikeArticle } from "../../../controllers/InteractionController";
import ArticleModel from "../../../models/ArticleModel";
import { AnimatedIonicons } from "../../VectorIcons";

interface IProps {
    article: ArticleModel;
}

export default function LikeOverlay({ article }: IProps) {
    const [likePressCount, setLikePressCount] = useState(0);
    const likeIconSizeScale = useRef(new Animated.Value(0)).current;

    const onLikeOverlayPress = () => {
        if (likePressCount > 0 && Date.now() - likePressCount < 500) {
            Animated.sequence([
                Animated.timing(likeIconSizeScale, {
                    toValue: 1.1,
                    duration: 170,
                    useNativeDriver: true
                }),
                Animated.timing(likeIconSizeScale, {
                    toValue: 0.92,
                    duration: 170,
                    useNativeDriver: true
                }),
                Animated.timing(likeIconSizeScale, {
                    toValue: 1,
                    duration: 170,
                    useNativeDriver: true
                }),
                Animated.delay(250),
                Animated.timing(likeIconSizeScale, {
                    toValue: 0,
                    duration: 170,
                    useNativeDriver: true
                })
            ]).start();

            article.like();
            setLikePressCount(0);
        }
        else {
            setLikePressCount(Date.now());
        }
    }

    return (
        <Pressable
            style={styles.likeOverlay}
            onPressIn={onLikeOverlayPress}
            onTouchMove={() => setLikePressCount(0)}
        >
            <AnimatedIonicons name="heart" color="#ffffff" size={100}
                style={{
                    opacity: likeIconSizeScale.interpolate({
                        inputRange: [0, 0.92],
                        outputRange: [0, 1],
                        extrapolate: "clamp"
                    }),
                    transform: [{
                        scale: likeIconSizeScale
                    }]
                }}
            />
        </Pressable>
    )
}

const styles = StyleSheet.create({
    likeOverlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        alignItems: 'center',
        justifyContent: 'center'
    }
})