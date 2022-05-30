import { StyleSheet } from "react-native"
import ArticleModel from "../../models/ArticleModel"
import { View } from "../ThemedDefaultComponents"
import LikeButton from "./interactions/LikeButton"
import { UnlikeArticle, LikeArticle } from "../../controllers/InteractionController"

interface IProps {
    article: ArticleModel
}

export default function InteractionBar(props: IProps) {
    const onLikeUpdate = (liked: boolean) => {
        if (typeof props.article.info !== "undefined") {
            if (liked) {
                LikeArticle(props.article.info.pk);
            }
            else {
                UnlikeArticle(props.article.info.pk);
            }

            props.article.info.has_liked = liked;
            props.article.update();
        }
    }

    return (
        <View style={styles.container}>
            <LikeButton isLiked={props.article.info?.has_liked ?? false} onLikePress={onLikeUpdate} />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        marginVertical: 6,
        marginHorizontal: 16,
        justifyContent: "center",
        alignItems: 'flex-start'
    }
})