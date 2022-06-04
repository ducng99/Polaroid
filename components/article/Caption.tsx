import { StyleSheet } from "react-native";
import ArticleModel from "../../models/ArticleModel";
import { Text, View } from "../ThemedDefaultComponents";
import RichText from "./RichText";

interface IProps {
    article: ArticleModel;
}

export default function Caption({ article }: IProps) {
    if (!article.info?.caption) {
        return (
            <></>
        )
    }

    return (
        <Text style={styles.container}>
            <Text style={styles.username}>{article.info.caption.user.username}</Text>
            <Text style={styles.caption}> <RichText text={article.info.caption.text} /></Text>

        </Text>
    )
}

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
    },
    username: {
        fontFamily: "Roboto-Medium",
    },
    caption: {
        fontFamily: "Roboto-Regular",
    }
})