import * as http from 'http';
import * as https from 'https';
import {HttpStatus} from '@marblejs/http';

export const request = <T>(
  url: string,
  options: https.RequestOptions | http.RequestOptions = {
    method: 'GET',
  },
  body: unknown = undefined
): Promise<T> => {
  const uri = new URL(url);
  const protocol = uri.protocol.startsWith('https:') ? https : http;
  return new Promise((resolve, reject) => {
    const handle = protocol.request(
      url,
      options,
      (response: http.IncomingMessage) => {
        const [statusName, statusCode] = Object.entries(HttpStatus).find(
          ([_, value]) => value === response.statusCode
        );
        if (response.statusCode < 400) {
          const chunks = [];
          response.on('data', (chunk) => chunks.push(chunk));
          response.on('end', () => {
            const body = Buffer.concat(chunks).toString();
            if (response.headers['content-type'].includes('application/json')) {
              resolve(JSON.parse(body));
            } else {
              resolve(body as unknown as T);
            }
            response.once('error', reject);
          });
        } else {
          reject(new Error(`${url}, ${statusName} - ${statusCode}`));
        }
      }
    );

    handle.once('error', reject);
    if (body) {
      handle.write(body);
    }
    handle.end();
  });
};
