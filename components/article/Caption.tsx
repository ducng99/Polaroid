import { useEffect, useState } from "react";
import { StyleSheet, useWindowDimensions } from "react-native";
import ArticleModel from "../../models/ArticleModel";
import { LinkRegex } from "../../utils";
import { Text } from "../ThemedDefaultComponents";
import TextSize from 'react-native-text-size';
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

    const windowSize = useWindowDimensions();
    const [displayingText, setDisplayingText] = useState("");
    const [displaying, setDisplaying] = useState(true);

    useEffect(() => {
        (async () => {
            const fullText = article.info?.caption?.text ?? "";
            const username = article.info?.caption?.user.username ?? "";

            let fullTextSize = await measureText(username + " " + fullText, false);

            if (fullTextSize.lineCount > 2) {
                const parts = fullText.split(LinkRegex);
                let text = "";
                let done = false;

                let currentTextSize = await measureText("", false);

                for (let i = 0; i < parts.length && !done && currentTextSize.lineCount <= 2; i++) {
                    if (i % 3 === 0) {
                        for (let n = 0; n < parts[i].length && !done; n++) {
                            currentTextSize = await measureText(username + " " + text + parts[i][n]);

                            if (currentTextSize.lineCount <= 2) {
                                text += parts[i][n];
                            }
                            else {
                                done = true;
                            }
                        }
                    }
                    else {
                        currentTextSize = await measureText(username + " " + text + parts[i] + parts[i + 1]);

                        if (currentTextSize.lineCount <= 2) {
                            text += parts[i] + parts[i + 1];
                            ++i;
                        }
                        else {
                            done = true;
                        }
                    }
                }

                setDisplayingText(text);
                setDisplaying(false);
            }
            else {
                setDisplayingText(fullText);
                setDisplaying(true);
            }
        })()
    }, [article]);

    const measureText = (text: string, withMore = true) => {
        return TextSize.measure({
            text: text + (withMore ? "... more" : ""),
            width: windowSize.width - 30,
            fontFamily: styles.caption.fontFamily,
        })
    }

    const displayFullText = () => {
        const fullText = article.info?.caption?.text ?? "";

        setDisplaying(true);
        setDisplayingText(fullText);
    }

    return (
        <Text style={styles.container} onPress={displaying ? undefined : displayFullText}>
            <Text style={styles.username}>{article.info.caption.user.username}</Text>
            <Text style={styles.caption}>&nbsp;<RichText text={displayingText} />
                {!displaying && <Text style={styles.secondaryText}>... more</Text>}
            </Text>
        </Text>
    )
}

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        marginTop: 2,
    },
    username: {
        fontFamily: "Roboto-Medium",
    },
    caption: {
        fontFamily: "Roboto-Regular",
    },
    secondaryText: {
        color: "rgb(142, 142, 142)",
    }
})