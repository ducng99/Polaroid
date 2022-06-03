import { FirstFrame } from "../../models/InstaFeedResponse"
import { useWindowDimensions, Image as DefaultImage, PixelRatio } from "react-native"
import { useEffect, useState } from "react";
import { View } from "../ThemedDefaultComponents";
import ArticleModel from "../../models/ArticleModel";
import LikeOverlay from "./interactions/LikeOverlay";

interface IProps {
    article: ArticleModel;
    images: FirstFrame[];
}

export default function Image({ article, images }: IProps) {
    const windowSize = useWindowDimensions();
    const realWidth = PixelRatio.getPixelSizeForLayoutSize(windowSize.width);
    const [image, setImage] = useState<FirstFrame>(images[0]);
    const [imageSize, setImageSize] = useState<{ width: number; height: number }>({ width: 0, height: 0 });

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

    return (
        <View>
            <DefaultImage
                source={{ uri: image.url }}
                style={imageSize}
                resizeMode='cover'
            />
            <LikeOverlay article={article} />
        </View>
    )
}