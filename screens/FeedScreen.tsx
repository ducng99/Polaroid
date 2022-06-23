import { useEffect, useRef, useState } from 'react';
import { ListRenderItemInfo, StyleSheet, FlatList as DefaultFlatList, ViewToken } from 'react-native';

import { FlatList } from '../components/ThemedDefaultComponents';
import { IsLoggedIn } from '../controllers/AccountController';
import { RootTabScreenProps } from '../types';
import * as FeedController from '../controllers/FeedController';
import ArticleModel from '../models/ArticleModel';
import Article from '../components/Article';
import { UniqueMerge } from '../utils';
import { useScrollToTop } from '@react-navigation/native';

export default function FeedScreen({ route, navigation }: RootTabScreenProps<'Feed'>) {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [loadedArticles, setArticles] = useState<ArticleModel[]>([]);
    const [max_id, setNewMaxId] = useState<string>("");
    const [isLoading, setIsLoading] = useState(true);
    const listRef = useRef<DefaultFlatList>(null);
    useScrollToTop(listRef);
    const [viewingIndex, setViewingIndex] = useState(0);

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
        const { articles, next_max_id } = await FeedController.GetNewArticles(max_id);
        setNewMaxId(next_max_id);
        setArticles(UniqueMerge(loadedArticles, articles, (a, b) => a.info?.id === b.info?.id));
    }

    const renderArticle = ({ item, index }: ListRenderItemInfo<ArticleModel>) => <Article key={item.info!.id} article={item} isViewing={index === viewingIndex} />
    
    const onItemViewableChanged = ({ changed }: { changed: ViewToken[] }) => {
        const viewableIndex = changed.filter(i => i.isViewable).map(i => i.index ?? 0);

        if (viewableIndex.length > 0) {
            setViewingIndex(viewableIndex[0]);
        }
    }

    const configs = useRef([{
        viewabilityConfig: {
            minimumViewTime: 16,
            itemVisiblePercentThreshold: 50
        },
        onViewableItemsChanged: onItemViewableChanged
    }]).current;

    return (
        <FlatList
            style={styles.container}
            data={loadedArticles}
            renderItem={renderArticle}
            refreshing={isLoading}
            onRefresh={getNewArticles}
            onEndReached={getMoreArticles}
            onEndReachedThreshold={1 - (3 / loadedArticles.length)}
            overScrollMode="never"
            showsVerticalScrollIndicator={false}
            initialNumToRender={3}
            viewabilityConfigCallbackPairs={configs}
            _ref={listRef}
        />
    );
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
        height: '100%',
    }
});
