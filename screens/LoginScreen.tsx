import InputBox from "../components/InputBox";
import { Text, View } from "../components/ThemedDefaultComponents";
import { IsLoggedIn, Login } from "../controllers/AccountController";
import Button from "../components/Button";
import { useState } from "react";
import { IsValidCreds } from "../utils";
import { RootStackScreenProps } from "../types";

export default function LoginScreen({ navigation }: RootStackScreenProps<"Login">) {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [isValidCreds, setValidCreds] = useState(false);

    const onLoginPressed = async () => {
        let result = await Login(username, password);
        console.log("Login result: ", result);

        if (result.status === "ok") {
            navigation.navigate("Root");
        }
    }

    const onUsernameChanged = (username: string) => {
        setUsername(username);
        setValidCreds(IsValidCreds(username, password));
    }

    const onPasswordChanged = (password: string) => {
        setPassword(password);
        setValidCreds(IsValidCreds(username, password));
    }

    return (
        <View style={{ width: '100%', height: '100%' }}>
            <View style={{ paddingHorizontal: 30, height: '90%', paddingVertical: 16 }}>
                <InputBox placeholder="Phone number, username or email" onChangeText={onUsernameChanged} />
                <InputBox placeholder="Password" isPassword={true} onChangeText={onPasswordChanged} />
                <Button title="Login" onPress={onLoginPressed} disabled={!isValidCreds} />
            </View>

            <View style={{ alignItems: 'center', paddingVertical: 10, height: '10%', justifyContent: 'center' }}>
                <Text>Me no store creds. Tks. Bye</Text>
            </View>
        </View>
    );
}