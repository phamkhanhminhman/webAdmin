import { environment } from '../environments/environment';

export const SERVER = environment.serverUrl;

export const SERVICE_CONFIG = {

    LOGIN: SERVER + 'api/auth/login',
  };