import InstaCookies from "../models/InstaCookies";
import Storage from "../models/Storage";

/**
 * Get stored cookies
 * @returns {Promise<InstaCookies>} an object containing the cookies
 */
export async function GetCookies(): Promise<InstaCookies> {
    const cookiesStr = await Storage.get('cookies');

    if (cookiesStr) {
        try {
            return JSON.parse(cookiesStr);
        }
        catch (ex) { console.error(ex) }
    }

    return {};
}

/**
 * New cookies are merged to the existing cookies
 * @param new_cookies updated values of cookies
 */
export async function UpdateCookies(new_cookies: InstaCookies) {
    let cookies = await GetCookies();
    cookies = Object.assign(cookies, new_cookies);
    
    await Storage.set('cookies', JSON.stringify(cookies));
}

export async function ClearCookies() {
    await Storage.remove('cookies');
}

export function VerifyCookies(cookies: InstaCookies): boolean {
    return (cookies.csrftoken && cookies.ds_user_id && cookies.ig_did) ? true : false;
}