import { StyleSheet } from "react-native"
import ArticleModel from "../../models/ArticleModel"
import { View } from "../ThemedDefaultComponents"
import LikeButton from "./interactions/LikeButton"
import { UnlikeArticle, LikeArticle } from "../../controllers/InteractionController"
import CommentButton from "./interactions/CommentButton"
import ShareButton from "./interactions/ShareButton"

interface IProps {
    article: ArticleModel
}

export default function InteractionBar(props: IProps) {
    const onLikeUpdate = (liked: boolean) => {
        if (typeof props.article.info !== "undefined") {
            if (props.article.info.has_liked != liked) {
                if (liked) {
                    LikeArticle(props.article.info.pk);
                }
                else {
                    UnlikeArticle(props.article.info.pk);
                }

                props.article.info.has_liked = liked;
            }
            props.article.update();
        }
    }

    const onCommentPress = () => {

    }

    const onSharePress = () => {

    }

    return (
        <View style={styles.container}>
            <View style={styles.leftContainer}>
                <LikeButton isLiked={props.article.info?.has_liked ?? false} onPress={onLikeUpdate} />
                <CommentButton onPress={onCommentPress} />
                <ShareButton onPress={onSharePress} />
            </View>
            <View style={styles.middleContainer}>

            </View>
            <View style={styles.rightContainer}>

            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        marginVertical: 10,
        marginHorizontal: 16,
        flexDirection: "row",
    },
    leftContainer: {
        width: '30%',
        flexDirection: "row",
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    middleContainer: {
        width: '40%',
        flexDirection: "row",
        justifyContent: 'center',
        alignItems: 'center',
    },
    rightContainer: {
        width: '30%',
        flexDirection: "row",
        justifyContent: 'flex-end',
        alignItems: 'center',
    }
})