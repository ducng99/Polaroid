import { useRef } from "react"
import { ListRenderItemInfo, StyleSheet, FlatList as DefaultFlatList, NativeSyntheticEvent, NativeScrollEvent, useWindowDimensions } from "react-native"
import { MediaType } from "../../models/ArticleModel"
import { CarouselMedia, MediaOrAd } from "../../models/InstaFeedResponse"
import { FlatList } from "../ThemedDefaultComponents"
import Image from "./Image"
import Video from "./Video"

interface IProps {
    carousel: CarouselMedia[] | MediaOrAd[];
}

export default function Carousel(props: IProps) {
    const width = useWindowDimensions().width;

    const renderMedia = ({ item }: ListRenderItemInfo<CarouselMedia | MediaOrAd>) => {
        switch (item.media_type) {
            case MediaType.Image:
                return <Image images={item.image_versions2?.candidates ?? []} key={item.id} />
            case MediaType.Video:
                return <Video videos={item.video_versions ?? []} key={item.id} />
            default:
                return <></>
        }
    }

    return (
        <FlatList horizontal={true}
            style={styles.container}
            data={props.carousel}
            renderItem={renderMedia}
            pagingEnabled
            decelerationRate="fast"
            snapToAlignment="start"
        />
    )
}

const styles = StyleSheet.create({
    container: {
        width: "100%",
    }
})