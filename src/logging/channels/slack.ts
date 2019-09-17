import fetch from 'node-fetch';

let url: string;
/**
 * Logs a message using a slack webhook
 *
 * @param {String} message the message to log
 */
export default (message: string, level: string): void => {
  if (url) {
    fetch(url, {
      body: JSON.stringify({
        text: `${level.padEnd(5).toUpperCase()}: ${message}`,
      }),
      headers: {
        'content-type': 'application/json',
      },
      method: 'POST',
    }).catch((e: Error) => {
      throw new Error('Endpoint not set for Slack logging');
    });
  }
};

export const setUrl = (webhook: string): boolean => {
  url = webhook;
  /* Test webhook */
  return true;
};
