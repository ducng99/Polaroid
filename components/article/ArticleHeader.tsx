import { MediaOrAdUser } from "../../models/InstaFeedResponse";
import Avatar from "./Avatar";
import { Text, View } from "../ThemedDefaultComponents";
import { StyleSheet } from "react-native";

interface IProps {
    user: MediaOrAdUser;
}

export default function ArticleHeader(props: IProps) {
    const { user } = props;

    return (
        <View style={styles.userInfoContainer}>
            <Avatar src={user.profile_pic_url} />
            <Text style={styles.username}>{user.username}</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    userInfoContainer: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 10,
    },
    username: {
        marginLeft: 10,
        fontWeight: '900',
    }
});