import React, { useState, useRef } from "react";
import { Animated, Pressable, StyleSheet } from "react-native"
import { LikeArticle } from "../../../controllers/InteractionController";
import ArticleModel from "../../../models/ArticleModel";
import { AnimatedIonicons } from "../../VectorIcons";

interface IProps {
    article: ArticleModel;
}

const likeIconSize = 100;
const likeIconMaxGrow = 1.1;

export default function LikeOverlay({ article }: IProps) {
    const [likePressCount, setLikePressCount] = useState(0);
    const likeIconSizeScale = useRef(new Animated.Value(0)).current;

    const onLikeOverlayPress = () => {
        if (likePressCount > 0 && Date.now() - likePressCount < 500) {
            Animated.sequence([
                Animated.timing(likeIconSizeScale, {
                    toValue: likeIconMaxGrow,
                    duration: 170,
                    useNativeDriver: false
                }),
                Animated.timing(likeIconSizeScale, {
                    toValue: 0.92,
                    duration: 170,
                    useNativeDriver: false
                }),
                Animated.timing(likeIconSizeScale, {
                    toValue: 1,
                    duration: 170,
                    useNativeDriver: false
                }),
                Animated.delay(250),
                Animated.timing(likeIconSizeScale, {
                    toValue: 0,
                    duration: 170,
                    useNativeDriver: false
                })
            ]).start();

            if (typeof article.info !== "undefined") {
                const prevLiked = article.info.has_liked;
                article.info.has_liked = true;
                article.update();

                if (prevLiked != true) {
                    LikeArticle(article.info.pk);
                }
            }

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
        >
            <AnimatedIonicons name="heart" color="#ffffff"
                style={{
                    opacity: likeIconSizeScale.interpolate({
                        inputRange: [0, 0.92],
                        outputRange: [0, 1],
                        extrapolate: "clamp"
                    }),
                    fontSize: likeIconSizeScale.interpolate({
                        inputRange: [0, 1],
                        outputRange: [0, likeIconSize]
                    }),
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