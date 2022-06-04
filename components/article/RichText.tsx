import { Fragment } from "react";
import { StyleSheet } from "react-native";
import { Text } from "../ThemedDefaultComponents";

interface IProps {
    text: string
}

export default function RichText({ text }: IProps) {
    const parseText = (caption: string) => {
        let parsed: JSX.Element[] = [];

        caption.split(" ").forEach(word => {
            if (word.startsWith("#")) {
                let link = /^(#(?:\p{L}|[0-9_])+)/u.exec(word);
                if (link && link[1]) {
                    parsed.push(<><Text style={styles.link}>{link[1]}</Text><Text>{word.replace(link[1], "")} </Text></>);
                }
                else {
                    parsed.push(<Text>{word} </Text>);
                }
            }
            else if (word.startsWith("@")) {
                let link = /^(@(?:\p{L}|[0-9_])+)/u.exec(word);
                if (link && link[1]) {
                    parsed.push(<><Text style={styles.link}>{link[1]}</Text><Text>{word.replace(link[1], "")} </Text></>);
                }
                else {
                    parsed.push(<Text>{word} </Text>);
                }
            }
            else {
                parsed.push(<Text>{word} </Text>);
            }
        });

        return parsed.map((e, i) => <Fragment key={i}>{e}</Fragment>);
    }

    return (
        <>{parseText(text)}</>
    )
}

const styles = StyleSheet.create({
    link: {
        color: "#00376b",
        fontFamily: "Roboto-Regular",
    },
})