import { StyleSheet } from "react-native";
import ArticleModel from "../../models/ArticleModel";
import { View, Text } from "../ThemedDefaultComponents";

interface IProps {
    article: ArticleModel;
}

export default function LikeCountBar({ article }: IProps) {
    const likeCount = article.info?.like_count ?? 0;
    const likeCountStr = likeCount.toLocaleString();
    
    return (
        <View style={styles.container}>
            <Text style={styles.text}>{likeCountStr}&nbsp;like{likeCount > 0 ? 's' : ''}</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        marginTop: 7,
    },
    text: {
        fontFamily: 'Roboto-Medium'
    }
})