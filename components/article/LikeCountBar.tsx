import { StyleSheet } from "react-native";
import ArticleModel from "../../models/ArticleModel";
import { View, Text } from "../ThemedDefaultComponents";

interface IProps {
    article: ArticleModel;
}

export default function LikeCountBar({ article }: IProps) {
    const likeCount = (article.info?.like_count ?? 0).toLocaleString();
    
    return (
        <View style={styles.container}>
            <Text style={styles.text}>{likeCount}</Text><Text style={styles.text}> likes</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
    },
    text: {
        fontWeight: '900',
    }
})