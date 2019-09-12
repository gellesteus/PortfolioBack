import fetch from 'node-fetch';

const url: string | undefined = process.env.SLACK_WEBHOOK;
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
      throw e;
    });
  }
};
