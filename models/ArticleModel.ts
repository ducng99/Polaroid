import { LikeArticle, UnlikeArticle } from "../controllers/InteractionController";
import { MediaOrAd } from "./InstaFeedResponse";

export enum MediaType {
    Invalid,
    Image,
    Video,
    Carousel = 8,
}

type onUpdateListener = (article: ArticleModel) => void;

export default class ArticleModel {
    /**
     * If modify info object directly, please call {@link update()}
     */
    info?: MediaOrAd;
    private updateListeners: onUpdateListener[] = [];

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
    
    like() {
        if (this.info && !this.info.has_liked) {
            LikeArticle(this.info.pk);
            this.info.like_count++;
            this.info.has_liked = true;
            this.update();
        }
    }
    
    unlike() {
        if (this.info && this.info.has_liked) {
            UnlikeArticle(this.info.pk);
            this.info.like_count--;
            this.info.has_liked = false;
            this.update();
        }
    }

    static fromJSON(json: any) {
        return Object.assign(new ArticleModel, json);
    }
    
    update() {
        const clone = this.clone();
        this.updateListeners.forEach(listener => listener(clone));
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