const RCTNetworking = require('react-native/Libraries/Network/RCTNetworking')

export function GenerateRandomString(length = 64) {
    let text = '';
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

    for (let i = 0; i < length; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }

    return text;
}

export function Sleep(time: number) {
    return new Promise(resolve => setTimeout(() => resolve(null), time));
}

export function IsValidCreds(username: string, password: string) {
    return username.length > 0 && password.length > 5;
}

export const UserAgent = "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:100.0) Gecko/20100101 Firefox/100.0";

export function ClearFetchCookies() {
    RCTNetworking.clearCookies(() => { })
}

export function UniqueMerge<T>(array1: Array<T>, array2: Array<T>, comparer: (a: T, b: T) => boolean): Array<T> {
    let result = array1.slice();

    array2.forEach(item => {
        if (!result.some(x => comparer(x, item)))
            result.push(item);
    });

    return result;
}

export const LinkRegex = /([#@])((?:\p{L}|[0-9_])+)/u;