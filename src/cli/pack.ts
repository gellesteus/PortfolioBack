import fs from 'fs-extra';
import path from 'path';

/* Finish the packing process */
const pack = () => {
  /* Create the directory */
  if (!fs.existsSync(__dirname + '/../../bundle/client/build')) {
    console.log('Creating directory');
    fs.mkdirSync(__dirname + '/../../bundle/client/build', {
      recursive: true,
    });
  }
  /* Copy the files from the build client to the bundle */
  fs.copySync(
    __dirname + '/../../client/build',
    __dirname + '/../../bundle/client/build'
  );

  /* Copy the environment files to the pack */
  try {
    fs.copySync(
      __dirname + '/../../.env',
      __dirname + '/../../bundle/server/.env'
    );
    console.log('Moving server .env');
  } catch (e) {
    console.log('No server .env found');
  }

  try {
    fs.copySync(
      __dirname + '/../../client/.env',
      __dirname + '/../../bundle/client/.env'
    );
    console.log('Moving client .env');
  } catch (e) {
    console.log('No client .env found');
  }
};
console.log('Moving client data');
pack();
console.log('Client data moved');
