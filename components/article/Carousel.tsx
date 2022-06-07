import { useRef, useState } from "react"
import { ListRenderItemInfo, StyleSheet, ViewToken } from "react-native"
import ArticleModel, { MediaType } from "../../models/ArticleModel"
import { CarouselMedia, MediaOrAd } from "../../models/InstaFeedResponse"
import { FlatList, View } from "../ThemedDefaultComponents"
import CarouselCounter from "./CarouselCounter"
import Image from "./Image"
import Video from "./Video"

interface IProps {
    article: ArticleModel;
    isViewing: boolean;
}

export default function Carousel({ article, isViewing }: IProps) {
    const [viewingIndex, setViewableIndex] = useState(0);

    const renderMedia = ({ item, index }: ListRenderItemInfo<CarouselMedia | MediaOrAd>) => {
        switch (item.media_type) {
            case MediaType.Image:
                return <Image images={item.image_versions2!.candidates} article={article} />
            case MediaType.Video:
                return <Video videos={item.video_versions!} isViewing={isViewing && index === viewingIndex} />
            default:
                return <></>
        }
    }

    const onViewableChanged = ({ changed }: { changed: ViewToken[] }) => {
        const viewableIndex = changed.filter(i => i.isViewable).map(i => i.index ?? 0);

        if (viewableIndex.length > 0) {
            setViewableIndex(viewableIndex[0]);
        }
    }

    const configs = useRef([{
        viewabilityConfig: {
            minimumViewTime: 0,
            itemVisiblePercentThreshold: 50
        },
        onViewableItemsChanged: onViewableChanged
    }]).current;

    return (
        <View>
            <FlatList
                horizontal
                style={styles.container}
                data={article.info?.carousel_media ?? []}
                keyExtractor={(item: CarouselMedia) => item.id}
                renderItem={renderMedia}
                pagingEnabled
                decelerationRate="fast"
                snapToAlignment="start"
                directionalLockEnabled
                overScrollMode="never"
                showsHorizontalScrollIndicator={false}
                initialNumToRender={3}
                viewabilityConfigCallbackPairs={configs}
            />
            <CarouselCounter current={viewingIndex + 1} total={article.info?.carousel_media_count ?? 0} />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        width: "100%",
    }
})