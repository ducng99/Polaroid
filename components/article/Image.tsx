import { FirstFrame } from "../../models/InstaFeedResponse"
import { StyleSheet, useWindowDimensions, Image as DefaultImage, PixelRatio, Pressable, Animated } from "react-native"
import { useEffect, useRef, useState } from "react";
import { View } from "../ThemedDefaultComponents";
import { AnimatedIonicons } from "../VectorIcons";
import ArticleModel from "../../models/ArticleModel";
import { LikeArticle } from "../../controllers/InteractionController";

interface IProps {
    article: ArticleModel;
    images: FirstFrame[];
}

const likeIconSize = 100;
const likeIconMaxGrow = 1.1;

export default function Image(props: IProps) {
    const { article, images } = props;
    const windowSize = useWindowDimensions();
    const realWidth = PixelRatio.getPixelSizeForLayoutSize(windowSize.width);
    const [image, setImage] = useState<FirstFrame>(images[0]);
    const [imageSize, setImageSize] = useState<{ width: number; height: number }>({ width: 0, height: 0 });

    const [likePressCount, setLikePressCount] = useState(0);
    const likeIconSizeScale = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        setImage(getImage());
    }, []);

    useEffect(() => {
        setImageSize(getFitImageSize(image));
    }, [image]);

    /**
     * Get correct sized image to best fit the screen
     */
    const getImage = () => {
        let optimalImgs = images.filter(img => img.width > realWidth).sort((a, b) => a.width - b.width);

        if (optimalImgs.length === 0) {
            optimalImgs = images;
            optimalImgs.sort((a, b) => b.width - a.width);
        }

        return optimalImgs[0];
    }

    const getFitImageSize = (image: FirstFrame) => {
        const ratio = image.width / image.height;
        let width = windowSize.width;
        let height = windowSize.width / ratio;

        if (height > windowSize.height * 0.7) {
            height = windowSize.height * 0.7;
            width = height * ratio;
        }

        return { width, height };
    }

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
        <View>
            <DefaultImage
                source={{ uri: image.url }}
                style={imageSize}
                resizeMode='cover'
            />
            <Pressable
                style={styles.likeOverlay}
                onPressIn={onLikeOverlayPress}
            >
                <AnimatedIonicons name="heart" color="#ffffff"
                    style={{
                        fontSize: likeIconSizeScale.interpolate({
                            inputRange: [0, 1],
                            outputRange: [0, likeIconSize]
                        })
                    }}
                />
            </Pressable>
        </View>
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