export interface UserAuthData {
    userName: string;
    accessToken: string;
    refreshToken: string;
    expiryInSeconds: 0;
    result: string;
}

export interface LoginResult {
    success: boolean;
    userData: UserAuthData;
    message: string;
}
