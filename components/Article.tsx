import { StyleSheet } from "react-native";
import ArticleModel, { MediaType } from "../models/ArticleModel";
import ArticleHeader from "./article/ArticleHeader";
import Carousel from "./article/Carousel";
import Image from "./article/Image";
import Video from "./article/Video";
import { View } from "./ThemedDefaultComponents";

interface IProps {
    article: ArticleModel;
}

export default function Article(props: IProps) {
    const { article } = props;

    const getMediaDisplay = () => {
        switch (article.MediaType) {
            case MediaType.Image:
                return (<Image images={article.info!.image_versions2!.candidates} />);
            case MediaType.Video:
                return (<Video videos={article.info!.video_versions!} />);
            case MediaType.Carousel:
                return (<Carousel carousel={article.info!.carousel_media!} />);
        }
    }

    return (
        <View style={styles.articleContainer}>
            <ArticleHeader user={article.info!.user} />
            {
                getMediaDisplay()
            }
        </View>
    )
}

const styles = StyleSheet.create({
    articleContainer: {

    }
})