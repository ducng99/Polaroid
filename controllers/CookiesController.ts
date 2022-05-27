import InstaCookies from "../models/InstaCookies";
import Storage from "../models/Storage";

export async function GetCookies(): Promise<InstaCookies> {
    const cookiesStr = await Storage.get('cookies');

    if (cookiesStr) {
        try {
            return {};
        }
        catch (ex) { console.error(ex) }
    }

    const cookies = {};
    await SetCookies(cookies);

    return cookies;
}

export async function SetCookies(cookies: InstaCookies) {
    await Storage.set('cookies', JSON.stringify(cookies));
}