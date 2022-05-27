import { TouchableOpacity } from "react-native";
import { Text, View } from "../components/ThemedDefaultComponents";
import { Logout } from "../controllers/AccountController";
import { RootStackScreenProps } from "../types";

export default function SettingsScreen({ navigation } : RootStackScreenProps<'Settings'>) {
    return (
        <View>
            <TouchableOpacity onPress={async () => { await Logout(); navigation.navigate('Login')}}><Text>Logout</Text></TouchableOpacity>
        </View>
    );
}