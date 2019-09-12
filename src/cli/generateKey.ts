import crypto from 'crypto';
import * as fs from 'fs';
import * as os from 'os';
import * as path from 'path';
import * as readline from 'readline';

const addSecret = (filePath?: string) => {
  const fPath: string = filePath || path.join(__dirname + '/../../.env');

  if (fs.existsSync(fPath)) {
    try {
      fs.accessSync(fPath);
    } catch (e) {
      console.error(
        'Read/Write access denied. Please check the permissions of the file'
      );
      console.log(e.message);
      return;
    }
    const stream = fs.createReadStream(fPath);
    const rl = readline.createInterface({ input: stream });

    let rLine = 0;
    let foundSecret = false;
    let secretLine = 0;

    rl.on('line', line => {
      rLine++;
      if (!foundSecret) {
        if (line.startsWith('SECRET_KEY=')) {
          foundSecret = true;
          secretLine = rLine;
          console.log('Found Secret');
        }
      }
    });

    rl.on('close', () => {
      if (!foundSecret) {
        /* Write a new secret to the file */
        console.log('Generating new key');
        fs.appendFileSync(
          fPath,
          `SECRET_KEY=${crypto.randomBytes(24).toString('hex')}${os.EOL}`
        );
      } else {
        /* Replace the key with a new one */
        console.log('Generating new key');
        const data = fs
          .readFileSync(fPath)
          .toString()
          .split(os.EOL);
        data[secretLine - 1] = `SECRET_KEY=${crypto
          .randomBytes(24)
          .toString('hex')}${os.EOL}`;

        fs.writeFileSync(fPath, data.join(os.EOL).trimRight());
      }
    });
  } else {
    try {
      /* Create the .env file */
      fs.writeFileSync(
        fPath,
        `SECRET_KEY=${crypto.randomBytes(24).toString('hex')}${os.EOL}`
      );
      console.log('Generating .env and adding key');
    } catch (e) {
      console.error(
        'Error creating .env on path. Please check the permissions'
      );
    }
  }
};

addSecret();

export default addSecret;
