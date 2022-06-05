import { StyleSheet } from "react-native";
import ArticleModel from "../../models/ArticleModel";
import { Text } from "../ThemedDefaultComponents";

interface IProps {
    article: ArticleModel;
}

export default function TimeBar({ article }: IProps) {
    const currentTime = Math.round(Date.now() / 1000);
    
    const displayDateTimeDiff = (taken: number, now: number) => {
        const diff = Math.abs(now - taken);
        
        if (diff < 60) {
            return `${diff} second${diff > 1 ? "s" : ""} ago`;
        }
        
        if (diff < 3600) {
            let num = Math.floor(diff / 60);
            return `${num} minute${num > 1 ? "s" : ""} ago`;
        }
        
        if (diff < 86400) {
            let num = Math.floor(diff / 3600);
            return `${num} hour${num > 1 ? "s" : ""} ago`;
        }
        
        if (diff < 604800) {
            let num = Math.floor(diff / 86400);
            return `${num} day${num > 1 ? "s" : ""} ago`;
        }
        
        if (diff < 2592000) {
            let num = Math.floor(diff / 604800);
            return `${num} week${num > 1 ? "s" : ""} ago`;
        }
        
        if (diff < 31104000) {
            let num = Math.floor(diff / 2592000);
            return `${num} month${num > 1 ? "s" : ""} ago`;
        }
        
        let num = Math.floor(diff / 31104000);
        return `${num} year${num > 1 ? "s" : ""} ago`;
    }
    
    return (
        <Text style={styles.text}>{displayDateTimeDiff(article.TakenDate, currentTime)}</Text>
    )
}

const styles = StyleSheet.create({
    text: {
        fontSize: 10,
        color: "rgb(142, 142, 142)",
        marginTop: 3,
    }
})