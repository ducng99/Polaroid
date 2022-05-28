import { MediaOrAd } from "./InstaFeedResponse";

export enum MediaType {
    Image = 1,
    Video = 2,
    Carousel = 8,
}

export default class ArticleModel {
    info?: MediaOrAd;

    get TakenDate() {
        return new Date((this.info?.taken_at ?? 0) * 1000);
    }

    get MediaType(): MediaType {
        return this.info?.media_type ?? MediaType.Image;
    }

    constructor(info?: MediaOrAd) {
        if (info)
            this.info = info;
    }
}