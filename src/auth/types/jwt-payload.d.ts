export interface JwtPayload {
    sub: number; // user id
    email: string;
    iat?: number;
    exp?: number;
}
