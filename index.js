const fs = require('fs');
const tts = require('google-translate-tts');
const chunk = require('chunk-text');
const audioconcat = require('audioconcat')
const naturalCompare = require('string-natural-compare');
const rimraf = require('rimraf');

const TMP_DIR = 'tmp';
const LIMIT = 199;

const input = 'input.txt';
const filename = '13-rozdzial.mp3';


const fileNames = [];
const existingFileParts  = fs.readdirSync(`./${TMP_DIR}/`).map(e=>TMP_DIR + "/" + e)


if (fs.existsSync(filename)){
  console.error("ERROR: File exists: " + filename + " . (Re)move file before continuing.");
  return;
}

const sentences = splitTextToSentences(input);
concatAllMp3Parts(sentences);




function splitTextToSentences(input) {

  const text = fs.readFileSync(input).toString();
  console.log("Input text no. of characters: " + text.length)

  const sentences = text.split('.').map(s=> s+'.');
  // const sentences = text.split('.').split('\n').map(s=> s+'.');
  const sentencesAndQuestions = sentences.map(s=>s.split("?")).flatMap(n=>n).map(q=> q.endsWith('.')? q : q+"?")
  const sentencesLtLimit = sentencesAndQuestions.map(s=> s.length> LIMIT ? chunk(s, LIMIT) : s).flatMap(n=>n);

  console.log("Number of sentenses to be processed: "+ sentencesLtLimit.length)
  console.log("Number of sentenses from previous ('socket hung' teminated?) processing: "+ existingFileParts.length)

  return sentencesLtLimit;
}


function concatAllMp3Parts(sentencesLtLimit) {
    Promise.all(sentencesLtLimit.map((s,index)=> createMp3Parts(s, index))).then(values=>{
    const sortedFileNames = [... new Set(fileNames)].sort(naturalCompare);

    audioconcat(fileNames)
      .concat(filename)
      .on('start', function (command) {
        console.log('ffmpeg process started:');
      })
      .on('error', function (err, stdout, stderr) {
        console.error('Error:', err)
        console.error('ffmpeg stderr:', stderr)
      })
      .on('end', function (output) {
        console.error('Audio created: ', filename)
        const cleanTmpDir = () => rimraf(`./${TMP_DIR}/*`, function () { console.log('remove tmp files done'); });
        cleanTmpDir();
    })
  })
}

async function createMp3Parts(textChunk,index){
  const fname = TMP_DIR + '/' + index+".mp3";
  fileNames.push(fname);
  if ( !existingFileParts.includes(fname)) {
    const buffer = await tts.synthesize({
      text: textChunk,
      voice: 'pl',
      slow: false // optional
    });
    fs.writeFileSync(fname, buffer);
  }
};

