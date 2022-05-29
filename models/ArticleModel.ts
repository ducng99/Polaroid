import { MediaOrAd } from "./InstaFeedResponse";

export enum MediaType {
    Invalid,
    Image,
    Video,
    Carousel = 8,
}

export default class ArticleModel {
    info?: MediaOrAd;

    get TakenDate() {
        return new Date((this.info?.taken_at ?? 0) * 1000);
    }

    get MediaType(): MediaType {
        return this.info?.media_type ?? MediaType.Invalid;
    }

    constructor(info?: MediaOrAd) {
        if (info)
            this.info = info;
    }
}