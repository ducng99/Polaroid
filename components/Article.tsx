import { useEffect, useState } from "react";
import { StyleSheet } from "react-native";
import ArticleModel, { MediaType } from "../models/ArticleModel";
import ArticleHeader from "./article/ArticleHeader";
import Carousel from "./article/Carousel";
import Image from "./article/Image";
import InteractionBar from "./article/InteractionBar";
import Video from "./article/Video";
import { View } from "./ThemedDefaultComponents";

interface IProps {
    article: ArticleModel;
}

export default function Article(props: IProps) {
    const [article, setArticle] = useState(props.article);
    
    useEffect(() => {
        const listener = (new_article: ArticleModel) => {
            setArticle(() => new_article);
        }
        
        article.addUpdateListener(listener);
        
        return () => {
            article.removeUpdateListener(listener);
        }
    }, []);

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
            <InteractionBar article={article}/>
        </View>
    )
}

const styles = StyleSheet.create({
    articleContainer: {

    }
})