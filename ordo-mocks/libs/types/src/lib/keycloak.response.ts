export interface KeycloakIssuerResponse {
  realm: string;
  public_key: string;
  'token-service': string;
  'account-service': string;
  'tokens-not-before': number;
}
