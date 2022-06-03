import { MediaOrAd } from "./InstaFeedResponse";

export enum MediaType {
    Invalid,
    Image,
    Video,
    Carousel = 8,
}

type onUpdateListener = (article: ArticleModel) => void;

export default class ArticleModel {
    info?: MediaOrAd;
    updateListeners: onUpdateListener[] = [];

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

    static fromJSON(json: any) {
        return Object.assign(new ArticleModel, json);
    }
    
    update() {
        this.updateListeners.forEach(listener => listener(this.clone()));
        // TODO: Update in old-articles storage
    }
    
    clone() {
        return Object.assign(new ArticleModel, this);
    }
    
    addUpdateListener(listener: onUpdateListener) {
        this.updateListeners.push(listener);
    }
    
    removeUpdateListener(listener: onUpdateListener) {
        this.updateListeners = this.updateListeners.filter(l => l !== listener);
    }

    toJSON() {
        return {
            info: this.info,
        }
    }
}