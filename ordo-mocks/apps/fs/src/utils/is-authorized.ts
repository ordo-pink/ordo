import { decode, Jwt, JwtPayload } from 'jsonwebtoken';
import { request, verifyFromIssuer } from '@ordo/utils';
import { KeycloakIssuerResponse } from '@ordo/types';
import {
  catchError,
  from,
  map,
  mergeMap,
  Observable,
  of,
  throwError,
} from 'rxjs';

export const isAuthorized = async (authorization: string): Promise<boolean> => {
  const token = authorization.split('Bearer ')[1];
  if (token) {
    const data = decode(token, { complete: true }) as Jwt;
    const { iss } = data.payload as JwtPayload;
    return await request<KeycloakIssuerResponse>(iss)
      .then(verifyFromIssuer(token))
      .then(() => true)
      .catch((err) => false);
  }
  return false;
};

export const isAuthorized$ = (authorization: string): Observable<boolean> => {
  return of(authorization).pipe(
    map((header) => header.split('Bearer ')[1]),
    mergeMap((token: string) =>
      of(decode(token, { complete: true })).pipe(
        catchError((err) => throwError(() => err)),
        map((jwt) => jwt.payload as JwtPayload),
        map((payload) => payload.iss),
        mergeMap((iss) => from(request<KeycloakIssuerResponse>(iss))),
        mergeMap((response: KeycloakIssuerResponse) =>
          from(verifyFromIssuer(token)(response, { ignoreExpiration: false }))
        ),
        catchError((err) => throwError(() => err))
      )
    ),
    map(() => true)
  );
};
