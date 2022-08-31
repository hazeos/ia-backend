export type NotFoundExceptionBodyType = {
  statusCode: number;
  i18nMessage: string;
  i18nErrorText: string;
};

export type BadRequestExceptionBodyType = {
  statusCode: number;
  i18nMessage: string;
  i18nArgs: {
    key: string;
    pathToValue: string;
    valueFrom: 'request' | 'host';
  }[];
  i18nErrorText: string;
};
