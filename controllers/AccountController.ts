import { InstaLoginResponse } from "../models/InstaLoginResponse";
import { ClearFetchCookies, UserAgent } from "../utils";
import { GetCookies, SetCookies } from "./CookiesController";

export async function IsLoggedIn() {
    try {
        const response = await fetch("https://www.instagram.com/accounts/edit/", {
            headers: {
                'User-Agent': UserAgent
            },
            credentials: 'include'
        });

        return !response.url.includes("/accounts/login/");
    }
    catch (ex) { console.error(ex) }

    return false;
}

export interface LoginResult {
    status: "ok" | "2fa" | "fail";
    two_factor_identifier?: string;
}

export async function Login(username: string, password: string): Promise<LoginResult> {
    ClearFetchCookies();
    
    try {
        const initialResult = await fetch("https://www.instagram.com/accounts/login/", {
            credentials: 'include',
            cache: 'no-cache'
        });

        const csrftoken = /csrftoken=([a-z0-9]+);/i.exec(initialResult.headers.get('set-cookie')!)![1];
        console.log("csrftoken: " + csrftoken);

        const body = new URLSearchParams({
            username: username,
            enc_password: `#PWD_INSTAGRAM_BROWSER:0:${Math.floor(Date.now() / 1000)}:${password}`,
            queryParams: "{}",
            optIntoOneTap: "false",
            stopDeletionNonce: "",
            trustedDeviceRecords: "{}"
        }).toString();

        const loginResult = await fetch("https://www.instagram.com/accounts/login/ajax/", {
            method: "POST",
            body: body,
            credentials: 'include',
            cache: "no-cache",
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'X-CSRFToken': csrftoken,
                "X-Requested-With": "XMLHttpRequest",
                'User-Agent': UserAgent,
                'Referer': 'https://www.instagram.com/accounts/login/'
            },
        });

        console.log(loginResult.status);

        const loginResponse = await loginResult.json() as InstaLoginResponse;
        console.log(loginResponse);

        if (loginResponse.status === "ok" && loginResponse.authenticated) {
            await SetCookies({ csrftoken, user_id: loginResponse.userId });
            return { status: "ok" };
        }
        else if (loginResponse.status === "fail" && loginResponse.two_factor_required) {
            return { status: "2fa", two_factor_identifier: loginResponse.two_factor_info?.two_factor_identifier };
        }
    }
    catch (ex) { console.error(ex); }

    return { status: "fail" };
}

export async function Logout() {
    try
    {
        const csrftoken = (await GetCookies()).csrftoken ?? "";
        
        await fetch("https://www.instagram.com/accounts/logout/ajax/", {
            method: "POST",
            credentials: 'include',
            cache: "no-cache",
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'X-CSRFToken': csrftoken,
                'User-Agent': UserAgent,
            }
        })
    }
    catch (ex) { console.error(ex) }
    
    ClearFetchCookies();
}