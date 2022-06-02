import { ListRenderItemInfo, StyleSheet } from "react-native"
import ArticleModel, { MediaType } from "../../models/ArticleModel"
import { CarouselMedia, MediaOrAd } from "../../models/InstaFeedResponse"
import { FlatList } from "../ThemedDefaultComponents"
import Image from "./Image"
import Video from "./Video"

interface IProps {
    article: ArticleModel;
}

export default function Carousel(props: IProps) {
    const renderMedia = ({ item }: ListRenderItemInfo<CarouselMedia | MediaOrAd>) => {
        switch (item.media_type) {
            case MediaType.Image:
                return <Image images={item.image_versions2!.candidates} article={props.article} key={item.id} />
            case MediaType.Video:
                return <Video videos={item.video_versions!} key={item.id} />
            default:
                return <></>
        }
    }

    return (
        <FlatList
            horizontal
            style={styles.container}
            data={props.article.info?.carousel_media ?? []}
            renderItem={renderMedia}
            pagingEnabled
            decelerationRate="fast"
            snapToAlignment="start"
            directionalLockEnabled
            overScrollMode="never"
            showsHorizontalScrollIndicator={false}
        />
    )
}

const styles = StyleSheet.create({
    container: {
        width: "100%",
    }
})