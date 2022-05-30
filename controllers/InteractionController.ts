import { SendRequest } from "./InstagramAPI";

export function LikeArticle(article_id: string) {
    return SendRequest("/web/likes/" + article_id + "/like/", {
        method: "POST",
    });
}

export function UnlikeArticle(article_id: string) {
    return SendRequest("/web/likes/" + article_id + "/unike/", {
        method: "POST",
    });
}