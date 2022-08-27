
import fs from 'fs';
import tts from 'google-translate-tts';

import audioconcat from 'audioconcat';
import naturalCompare from 'string-natural-compare';
import rimraf from 'rimraf';



export default function convert2mp3(sentencesLtLimit, options) {

  options.filenames = [];

  Promise.all(sentencesLtLimit.map((s, index) => createMp3Parts(s, index, options))).then(values => {
    const sortedFileNames = [... new Set(options.filenames)].sort(naturalCompare);

    audioconcat(sortedFileNames)
      .concat(options.filename)
      .on('start', function (command) {
        console.log('ffmpeg process started:');
      })
      .on('error', function (err, stdout, stderr) {
        console.error('Error:', err)
        console.error('ffmpeg stderr:', stderr)
      })
      .on('end', function (output) {
        console.log('Audio created: ', options.filename)
        const cleanTmpDir = () => rimraf(`./${options.engine.tmpDir}/*`, function () { console.log('remove tmp files done'); });
        cleanTmpDir();
      })
  })
}

async function createMp3Parts(textChunk, index, options) {
  const fname = options.engine.tmpDir + '/' + index + ".mp3";
  options.filenames.push(fname);
  if (!options.engine.existingFileParts.includes(fname)) {
    const buffer = await tts.synthesize({
      text: textChunk,
      voice: options.language,
      slow: false // optional
    });
    fs.writeFileSync(fname, buffer);
  }
};

