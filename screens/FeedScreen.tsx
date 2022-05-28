import { useEffect, useState } from 'react';
import { StyleSheet } from 'react-native';

import { View } from '../components/ThemedDefaultComponents';
import { IsLoggedIn, Logout } from '../controllers/AccountController';
import { RootTabScreenProps } from '../types';
import * as FeedController from '../controllers/FeedController';

export default function FeedScreen({ route, navigation }: RootTabScreenProps<'Feed'>) {
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        (async () => {
            const isLoggedIn = await IsLoggedIn();
            console.log("Logged in state: " + isLoggedIn);
            setIsLoggedIn(isLoggedIn);

            if (isLoggedIn) {
                await getArticles();
            }
            else {
                navigation.navigate('Login');
            }
        })();
    }, []);
    
    const getArticles = async () => {
        const articles = await FeedController.GetArticles();
    }

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
