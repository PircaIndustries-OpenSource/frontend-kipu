export interface OAuthUser {
  name: string;
  email: string;
  givenName?: string;
  familyName?: string;
  provider: 'google' | 'microsoft';
}
