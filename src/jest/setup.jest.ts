import { config } from 'dotenv';
export = async (): Promise<void> => {
  config({ path: './.env.test' });
  jest.setTimeout(60000);
};
