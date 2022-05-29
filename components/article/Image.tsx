import { FirstFrame } from "../../models/InstaFeedResponse"
import { StyleSheet, useWindowDimensions, Image as DefaultImage, PixelRatio } from "react-native"

interface IProps {
    images: FirstFrame[];
}

export default function Image(props: IProps) {
    const { images } = props;
    const windowSize = useWindowDimensions();
    const realWidth = PixelRatio.getPixelSizeForLayoutSize(windowSize.width);

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

    const image = getImage();

    return (
        <DefaultImage
            source={{ uri: image.url }}
            style={getFitImageSize(image)}
            resizeMode='cover'
        />
    )
}