import ArticleModel from "../models/ArticleModel";
import { InstaFeedResponse, MediaOrAd } from "../models/InstaFeedResponse";
import Storage from "../models/Storage";
import { GetCookies, UpdateCookies, VerifyCookies } from "./CookiesController"
import { SendAPIRequest, SendRequest } from "./InstagramAPI";

interface ArticlesResult {
    articles: ArticleModel[],
    next_max_id: string
}

let refreshDelay = 5000;   // Delay between refresh requests

export async function GetNewArticles(next_max_id?: string): Promise<ArticlesResult> {
    if (await GetLastFetchTime() + refreshDelay < Date.now()) {
        const storedCookies = await GetCookies();

        if (VerifyCookies(storedCookies)) {
            if (!next_max_id) {
                await UpdateCookies({ csrftoken: "" });
                await SendRequest("/");
            }

            const body = {
                device_id: storedCookies.ds_user_id!,
                is_async_ads_rti: "0",
                is_async_ads_double_request: "0",
                rti_delivery_backend: "0",
                is_async_ads_in_headload_enabled: "0",
                max_id: next_max_id || "",
            };

            const response = await SendAPIRequest('/feed/timeline/', body);
            UpdateLastFetchTime();

            try {
                const instaResponse = (await response.json()) as InstaFeedResponse;

                if (instaResponse.status === "ok") {
                    if (instaResponse.pull_to_refresh_window_ms) {
                        refreshDelay = instaResponse.pull_to_refresh_window_ms;
                    }

                    const articles = ParseInstaFeedResponse(instaResponse);
                    if (!next_max_id) {
                        await Storage.set("old_articles", JSON.stringify(articles.map(article => article.toJSON())));
                    }

                    return { articles, next_max_id: instaResponse.next_max_id };
                }
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
        return articlesObjs.map(articleObj => ArticleModel.fromJSON(articleObj));
    }

    return [];
}

function ParseInstaFeedResponse(response: InstaFeedResponse) {
    let articles: ArticleModel[] = [];

    if (response.num_results > 0) {
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