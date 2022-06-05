import { useEffect, useState } from "react";
import { StyleSheet } from "react-native";
import { UpdateOldArticle } from "../controllers/FeedController";
import ArticleModel, { MediaType } from "../models/ArticleModel";
import ArticleHeader from "./article/ArticleHeader";
import Caption from "./article/Caption";
import Carousel from "./article/Carousel";
import Image from "./article/Image";
import InteractionBar from "./article/InteractionBar";
import LikeCountBar from "./article/LikeCountBar";
import TimeBar from "./article/TimeBar";
import Video from "./article/Video";
import ViewCommentsText from "./article/ViewCommentsText";
import { View } from "./ThemedDefaultComponents";

interface IProps {
    article: ArticleModel;
    isViewing: boolean;
}

export default function Article({ article, isViewing }: IProps) {
    const [_article, setArticle] = useState(article);

    useEffect(() => {
        const listener = (new_article: ArticleModel) => {
            setArticle(() => new_article);
            UpdateOldArticle(new_article);
        }

        _article.addUpdateListener(listener);

        return () => {
            _article.removeUpdateListener(listener);
        }
    }, []);

    const getMediaDisplay = () => {
        switch (_article.MediaType) {
            case MediaType.Image:
                return (<Image images={_article.info!.image_versions2!.candidates} article={_article} />);
            case MediaType.Video:
                return (<Video videos={_article.info!.video_versions!} isViewing={isViewing} />);
            case MediaType.Carousel:
                return (<Carousel article={_article} isViewing={isViewing}/>);
            default:
                return (<></>);
        }
    }

    return (
        <View style={styles.conatiner}>
            <View style={styles.padder}>
                <ArticleHeader user={_article.info!.user} />
            </View>
            {
                getMediaDisplay()
            }
            <View style={styles.padder}>
                <InteractionBar article={_article} />
                <LikeCountBar article={_article} />
                <Caption article={_article} />
                <ViewCommentsText article={_article} />
                <TimeBar article={_article} />
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    conatiner: {
        marginBottom: 10,
    },
    padder: {
        paddingHorizontal: 14
    }
})