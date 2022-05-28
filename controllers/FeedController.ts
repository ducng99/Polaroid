import { InstaFeedResponse } from "../models/InstaFeedResponse";
import { GetCookies, UpdateCookies, VerifyCookies } from "./CookiesController"
import { SendAPIRequest, SendRequest } from "./InstagramAPI";

export async function GetArticles(next_max_id?: string) {
    const storedCookies = await GetCookies();

    if (VerifyCookies(storedCookies)) {
        try {
            await UpdateCookies({ csrftoken: "" });
            await SendRequest("/");
            
            const body = new URLSearchParams({
                device_id: storedCookies.ds_user_id!,
                is_async_ads_rti: "0",
                is_async_ads_double_request: "0",
                rti_delivery_backend: "0",
                is_async_ads_in_headload_enabled: "0",
                max_id: next_max_id || "",
            }).toString();
            
            const response = await SendAPIRequest('/feed/timeline/', body);
            const instaResponse = (await response.json()) as InstaFeedResponse;
            return ParseInstaFeedResponse(instaResponse);
        }
        catch (ex) { console.error(ex) }
    }
}

function ParseInstaFeedResponse(response: InstaFeedResponse) {
    
}