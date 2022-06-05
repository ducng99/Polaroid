import { StyleSheet } from "react-native";
import ArticleModel from "../../models/ArticleModel";
import { Text } from "../ThemedDefaultComponents";

interface IProps {
    article: ArticleModel;
}

export default function ViewCommentsText({ article }: IProps) {
    const comment_count = article.info?.comment_count ?? 0;
    
    if (!comment_count) {
        return (<></>);
    }
    
    return (
        <Text style={styles.text}>View all {comment_count.toLocaleString()} comments</Text>
    )
}

const styles = StyleSheet.create({
    text: {
        color: "rgb(142, 142, 142)",
        marginTop: 4,
    }
})