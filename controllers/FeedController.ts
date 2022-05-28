import ArticleModel from "../models/ArticleModel";
import { InstaFeedResponse, MediaOrAd } from "../models/InstaFeedResponse";
import Storage from "../models/Storage";
import { GetCookies, UpdateCookies, VerifyCookies } from "./CookiesController"
import { SendAPIRequest, SendRequest } from "./InstagramAPI";

interface ArticlesResult {
    articles: ArticleModel[],
    next_max_id: string
}

export async function GetNewArticles(next_max_id?: string): Promise<ArticlesResult> {
    if (await GetLastFetchTime() + 1000 * 5 < Date.now()) {
        const storedCookies = await GetCookies();

        if (VerifyCookies(storedCookies)) {
            if (!next_max_id) {
                await UpdateCookies({ csrftoken: "" });
                await SendRequest("/");
            }

            const body = new URLSearchParams({
                device_id: storedCookies.ds_user_id!,
                is_async_ads_rti: "0",
                is_async_ads_double_request: "0",
                rti_delivery_backend: "0",
                is_async_ads_in_headload_enabled: "0",
                max_id: next_max_id || "",
            }).toString();

            const response = await SendAPIRequest('/feed/timeline/', body);
            await UpdateLastFetchTime();
            
            try {
                const instaResponse = (await response.json()) as InstaFeedResponse;
                const articles = ParseInstaFeedResponse(instaResponse);
                if (!next_max_id) {
                    await Storage.set("old_articles", JSON.stringify(articles));
                }

                return { articles, next_max_id: instaResponse.next_max_id };
            }
            catch (ex) { console.error(ex) }
        }
    }

    return { articles: [], next_max_id: "" };
}

export async function GetOldArticles(): Promise<ArticleModel[]> {
    const storedArticles = await Storage.get("old_articles");

    if (storedArticles) {
        const articlesObjs = JSON.parse(storedArticles) as { info: MediaOrAd }[];
        return articlesObjs.map(articleObj => Object.assign(new ArticleModel, articleObj));
    }

    return [];
}

function ParseInstaFeedResponse(response: InstaFeedResponse) {
    let articles: ArticleModel[] = [];

    if (response.status === "ok" && response.num_results > 0) {
        response.feed_items.forEach(item => {
            articles.push(new ArticleModel(item.media_or_ad));
        });
    }

    return articles;
}

async function GetLastFetchTime() {
    return Number.parseInt(await Storage.get("last_fetch_feed_time") ?? "0");
}

function UpdateLastFetchTime() {
    return Storage.set("last_fetch_feed_time", Date.now().toString());
}