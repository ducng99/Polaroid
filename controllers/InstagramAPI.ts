import { UserAgent } from "../utils";
import { GetCookies, UpdateCookies } from "./CookiesController";
import SetCookieParser from "set-cookie-parser";

interface RequestOptions {
    host?: string;
    body?: { [key: string]: any };
    contentType?: "json" | "form";
    referer?: string;
    method?: "GET" | "POST";
    additionalHeaders?: { [key: string]: string };
}

export async function SendRequest(path: string, _options?: RequestOptions): Promise<Response> {
    try {
        let options: RequestOptions = {
            host: "https://www.instagram.com",
            contentType: "form",
            method: "GET"
        };

        options = Object.assign(options, _options);

        const storedCookies = await GetCookies();
        const cookieString = Object.entries(storedCookies).map(([key, value]) => `${key}=${value}`).join("; ");

        const url = new URL(path, options.host);

        let headers: { [key: string]: string } = {
            'User-Agent': UserAgent,
            'Cookie': cookieString,
            'X-IG-App-ID': '936619743392459',
        };

        if (storedCookies.csrftoken) {
            headers['X-CSRFToken'] = storedCookies.csrftoken;
        }

        if (options.referer) {
            headers['Referer'] = options.referer;
        }
        
        let body = null;

        if (options.method === "POST") {
            switch (options.contentType) {
                case "json":
                    headers['Content-Type'] = 'application/json';
                    body = JSON.stringify(options.body);
                    break;
                case "form":
                default:
                    headers['Content-Type'] = 'application/x-www-form-urlencoded';
                    body = new URLSearchParams(options.body).toString();
                    break;
            }

            headers['X-Requested-With'] = 'XMLHttpRequest';
        }

        if (options.additionalHeaders) {
            Object.assign(headers, options.additionalHeaders);
        }

        const request = new Request(url.toString(), {
            method: options.method,
            body,
            headers,
            referrer: options.referer,
            credentials: 'omit',
            cache: 'no-cache'
        });

        const result = await fetch(request);

        const cookiesText = result.headers.get('set-cookie');

        if (cookiesText) {
            for (const cookie of SetCookieParser.parse(SetCookieParser.splitCookiesString(cookiesText))) {
                await UpdateCookies({ [cookie.name]: cookie.value });
            }
        }

        return result;
    }
    catch (ex) { console.error(ex) }

    return new Response("Internal request failed", { status: 500 });
}

export async function SendAPIRequest(path: string, body: { [key: string]: any }): Promise<Response> {
    let options: RequestOptions = {
        host: "https://i.instagram.com/api/v1",
        method: "POST",
        body,
    }

    return await SendRequest(path, options);
}