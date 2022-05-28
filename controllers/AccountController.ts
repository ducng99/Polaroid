import { InstaLoginResponse } from "../models/InstaLoginResponse";
import { ClearFetchCookies, UserAgent } from "../utils";
import { ClearCookies, GetCookies, UpdateCookies, VerifyCookies } from "./CookiesController";
import { SendRequest } from "./InstagramAPI";

export async function IsLoggedIn() {
    if (VerifyCookies(await GetCookies())) {
        try {
            const response = await SendRequest("/accounts/edit/");

            return !response.url.includes("/accounts/login/");
        }
        catch (ex) { console.error(ex) }
    }

    return false;
}

export interface LoginResult {
    status: "ok" | "2fa" | "fail";
    two_factor_identifier?: string;
}

export async function Login(username: string, password: string): Promise<LoginResult> {
    ClearFetchCookies();
    await ClearCookies();

    try {
        await SendRequest("/accounts/login/");

        const body = new URLSearchParams({
            username: username,
            enc_password: `#PWD_INSTAGRAM_BROWSER:0:${Math.floor(Date.now() / 1000)}:${password}`,
            queryParams: "{}",
            optIntoOneTap: "false",
            stopDeletionNonce: "",
            trustedDeviceRecords: "{}"
        }).toString();

        const loginResult = await SendRequest("/accounts/login/ajax/", {
            method: "POST",
            body,
            contentType: "form",
            referer: 'https://www.instagram.com/accounts/login/'
        });

        console.log(loginResult.status);
        const loginResponseText = await loginResult.text();
        console.log(loginResponseText.substring(0, 100));

        if (loginResult.status >= 200 && loginResult.status < 300) {
            const loginResponse = JSON.parse(loginResponseText) as InstaLoginResponse;

            if (loginResponse.status === "ok" && loginResponse.authenticated) {
                return { status: "ok" };
            }
            else if (loginResponse.status === "fail" && loginResponse.two_factor_required) {
                return { status: "2fa", two_factor_identifier: loginResponse.two_factor_info?.two_factor_identifier };
            }
        }
    }
    catch (ex) { console.error(ex); }

    return { status: "fail" };
}

export async function Logout() {
    try {
        await SendRequest("/accounts/logout/ajax/", {
            method: "POST"
        });
    }
    catch (ex) { console.error(ex) }

    ClearFetchCookies();
}