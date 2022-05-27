import { useEffect, useState } from 'react';
import { StyleSheet } from 'react-native';

import { View } from '../components/Themed';
import { IsLoggedIn, Logout } from '../controllers/AccountController';
import { RootTabScreenProps } from '../types';

export default function FeedScreen({ navigation }: RootTabScreenProps<'Feed'>) {
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        (async () => {
            const isLoggedIn = await IsLoggedIn();
            console.log("Logged in state: " + isLoggedIn);
            setIsLoggedIn(isLoggedIn);

            if (!isLoggedIn) {
                navigation.navigate('Login');
            }
        })();
    }, []);

    return (
        <View style={styles.container}>

        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    separator: {
        marginVertical: 30,
        height: 1,
        width: '80%',
    },
});
