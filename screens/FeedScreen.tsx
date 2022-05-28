import { useEffect, useState } from 'react';
import { ListRenderItemInfo, StyleSheet, FlatList as DefaultFlatList } from 'react-native';

import { FlatList, View } from '../components/ThemedDefaultComponents';
import { IsLoggedIn, Logout } from '../controllers/AccountController';
import { RootTabScreenProps } from '../types';
import * as FeedController from '../controllers/FeedController';
import ArticleModel from '../models/ArticleModel';
import Article from '../components/Article';

export default function FeedScreen({ route, navigation }: RootTabScreenProps<'Feed'>) {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [loadedArticles, setArticles] = useState<ArticleModel[]>([]);
    const [new_max_id, setNewMaxId] = useState<string>("");
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        (async () => {
            setIsLoading(true);
            const oldArticles = await FeedController.GetOldArticles();
            setArticles(oldArticles);
            setIsLoading(false);

            const isLoggedIn = await IsLoggedIn();
            console.log("Logged in state: " + isLoggedIn);
            setIsLoggedIn(isLoggedIn);

            if (isLoggedIn) {
                await getNewArticles();
            }
            else {
                navigation.navigate('Login');
            }
        })();
    }, []);

    const getNewArticles = async () => {
        setIsLoading(true);
        const { articles, next_max_id } = await FeedController.GetNewArticles();
        setNewMaxId(next_max_id);
        setArticles(articles);
        setIsLoading(false);
    }
    
    const getMoreArticles = async () => {
        setIsLoading(true);
        const { articles, next_max_id } = await FeedController.GetNewArticles(new_max_id);
        setNewMaxId(next_max_id);
        setArticles([...loadedArticles, ...articles]);
        setIsLoading(false);
    }

    const renderArticle = ({ item }: ListRenderItemInfo<ArticleModel>) => <Article key={item.info!.id} article={item} />

    return (
        <FlatList
            style={styles.container}
            data={loadedArticles}
            renderItem={renderArticle}
            refreshing={isLoading}
            onRefresh={getNewArticles}
            onEndReached={getMoreArticles}
        />
    );
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
        height: '100%',
    }
});
