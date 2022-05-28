export default interface InstaCookies {
    csrftoken?: string;
    ds_user_id?: string;
    ig_did?: string;
    ig_nrcb?: string;
    sessionid?: string;
    mid?: string;
    rur?: string;
    shbid?: string;
    shbts?: string;
    [key: string]: string | undefined;
}