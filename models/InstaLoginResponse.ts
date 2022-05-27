export interface InstaLoginResponse {
    status:                       "ok"|"fail";
    authenticated?:               boolean;
    message?:                     string;
    two_factor_required?:         boolean;
    two_factor_info?:             TwoFactorInfo;
    phone_verification_settings?: PhoneVerificationSettings;
    error_type?:                  string;
    user?:                        boolean;
    userId?:                      string;
}

export interface PhoneVerificationSettings {
    max_sms_count:                number;
    resend_sms_delay_sec:         number;
    robocall_count_down_time_sec: number;
    robocall_after_max_sms:       boolean;
}

export interface TwoFactorInfo {
    pk:                                  number;
    username:                            string;
    sms_two_factor_on:                   boolean;
    whatsapp_two_factor_on:              boolean;
    totp_two_factor_on:                  boolean;
    eligible_for_multiple_totp:          boolean;
    obfuscated_phone_number:             string;
    two_factor_identifier:               string;
    show_messenger_code_option:          boolean;
    show_new_login_screen:               boolean;
    show_trusted_device_option:          boolean;
    should_opt_in_trusted_device_option: boolean;
    pending_trusted_notification:        boolean;
    sms_not_allowed_reason:              null;
    trusted_notification_polling_nonce:  null;
    is_trusted_device:                   boolean;
    phone_verification_settings:         PhoneVerificationSettings;
}
