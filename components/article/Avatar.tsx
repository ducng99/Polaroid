import { Image } from "react-native";

interface IProps {
    src: string
}

export default function Avatar(props: IProps) {
    return (
        <Image source={{ uri: props.src }} style={{ width: 30, height: 30, borderRadius: 25 }} />
    )
}