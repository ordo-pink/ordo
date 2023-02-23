import {KeycloakIssuerResponse} from '@ordo/types';
import {
  Secret,
  GetPublicKeyOrSecret,
  verify,
  VerifyOptions,
  JwtPayload,
  decode as _decode,
  Jwt,
} from 'jsonwebtoken';
import {catchError, map, Observable, of, throwError} from 'rxjs';

export const verifyAsync = (
  token: string,
  secretOrPublicKey: Secret | GetPublicKeyOrSecret,
  options?: VerifyOptions
): Promise<string | JwtPayload | Jwt> =>
  new Promise((resolve, reject) =>
    verify(token, secretOrPublicKey, options, (error, jwt) =>
      error ? reject(error) : resolve(jwt)
    )
  );

export const verifyFromIssuer =
  (token: string) =>
    ({public_key}: KeycloakIssuerResponse, options: VerifyOptions = {}) =>
      verifyAsync(
        token,
        `-----BEGIN PUBLIC KEY-----\n${public_key}\n-----END PUBLIC KEY-----`,
        options
      );

export const decode = (token: string): Jwt =>
  _decode(token, {complete: true});

export const decode$ = (token: string): Observable<JwtPayload> =>
  of(_decode(token, {complete: true})).pipe(
    catchError((err) => throwError(() => err)),
    map((jwt) => jwt.payload as JwtPayload)
  );

export const getUserId = (authorization: string): string => {
  const {sub, preferred_username, email} = decode(authorization.split('Bearer ')[1])
    ?.payload as JwtPayload;
  return sub || email || preferred_username;
};
