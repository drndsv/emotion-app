export interface GigaChatTokenResponse {
  access_token: string;
}

export interface GigaChatResponse {
  choices: Array<{
    message: {
      content: string;
    };
  }>;
}
