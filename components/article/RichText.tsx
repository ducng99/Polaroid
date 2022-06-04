import { Fragment, useEffect, useState } from "react";
import { StyleSheet } from "react-native";
import { LinkRegex } from "../../utils";
import { Text } from "../ThemedDefaultComponents";

interface IProps {
    text: string
}

export default function RichText({ text }: IProps) {
    const [parsedText, setParsedText] = useState<JSX.Element[]>([]);

    useEffect(() => {
        setParsedText(parseText(text));
    }, [text])

    const parseText = (caption: string) => {
        let parsed: JSX.Element[] = [];

        const parts = caption.split(LinkRegex);
        for (let i = 0; i < parts.length; i++) {
            if (i % 3 === 0)
                parsed[i] = <Text>{parts[i]}</Text>
            else if (i % 3 === 1) {
                parsed[i] = <Text style={styles.link}>{parts[i]}{parts[i + 1]}</Text>
                ++i;
            }
        }

        return parsed.map((e, i) => <Fragment key={i}>{e}</Fragment>);
    }

    return (
        <>{parsedText}</>
    )
}

const styles = StyleSheet.create({
    link: {
        color: "#00376b",
        fontFamily: "Roboto-Regular",
    },
})