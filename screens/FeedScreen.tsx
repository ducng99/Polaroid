import { useEffect, useState } from 'react';
import { ListRenderItemInfo, StyleSheet, FlatList as DefaultFlatList } from 'react-native';

import { FlatList } from '../components/ThemedDefaultComponents';
import { IsLoggedIn } from '../controllers/AccountController';
import { RootTabScreenProps } from '../types';
import * as FeedController from '../controllers/FeedController';
import ArticleModel from '../models/ArticleModel';
import Article from '../components/Article';
import { UniqueMerge } from '../utils';

export default function FeedScreen({ route, navigation }: RootTabScreenProps<'Feed'>) {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [loadedArticles, setArticles] = useState<ArticleModel[]>([]);
    const [max_id, setNewMaxId] = useState<string>("");
    const [isLoading, setIsLoading] = useState(true);

    // TODO: On navigate to this screen, run recheck below again
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
        const { articles, next_max_id } = await FeedController.GetNewArticles(max_id);
        setNewMaxId(next_max_id);
        setArticles(UniqueMerge(loadedArticles, articles, (a, b) => a.info?.id === b.info?.id));
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
            showsVerticalScrollIndicator={false}
        />
    );
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
        height: '100%',
    }
});
