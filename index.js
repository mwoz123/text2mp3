import fs from 'fs'

import ttsService from './src/ttsService.js';
import textService from './src/textService.js';

const myArgs = process.argv.slice(2);
const inputFile = myArgs[0];
const fileName = myArgs[1]
const lang = myArgs[2]

const options = {
  input : inputFile || 'files/example.txt',  //TODO: replace with Readme
  filename : fileName  || 'files/example-output.mp3',
  language: lang || 'en',

  engine: {
    tmpDir: "tmp",


  }
}



if (fs.existsSync(options.filename)){
  console.error("ERROR: File exists: " + options.filename + " . (Re)move file before continuing.");
} else {
  const sentences = textService(options);
  ttsService(sentences, options);
}


