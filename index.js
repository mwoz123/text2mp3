const fs = require('fs');
const tts = require('google-translate-tts');
const chunk = require('chunk-text');
const audioconcat = require('audioconcat')
const naturalCompare = require('string-natural-compare');
const rimraf = require('rimraf');

const TMP_DIR = 'tmp';
const TTS_ENGINE_CHAR_LIMIT = 199;

const myArgs = process.argv.slice(2);
const inputFile = myArgs[0];
const fileName = myArgs[1]
const lang = myArgs[2]

const options = {
  input : inputFile || 'files/example.txt',  //TODO: replace with Readme
  filename : fileName  || 'files/example-output.mp3',
  language: lang || 'en',
}


const fileNames = [];
const existingFileParts  = fs.readdirSync(`./${TMP_DIR}/`).filter(e=>!e.endsWith(".gitkeep")).map(e=>TMP_DIR + "/" + e)


if (fs.existsSync(options.filename)){
  console.error("ERROR: File exists: " + options.filename + " . (Re)move file before continuing.");
  return;
}

const sentences = splitTextToSentences(options.input);
convert2mp3(sentences, options);




function splitTextToSentences(input) {

  const text = fs.readFileSync(input).toString();
  console.log("Input text no. of characters: " + text.length)

  const sentences = text.split('.').map(s=> s+'.');
  // const sentences = text.split('.').split('\n').map(s=> s+'.');
  const sentencesAndQuestions = sentences.map(s=>s.split("?")).flatMap(n=>n).map(q=> q.endsWith('.')? q : q+"?")
  const sentencesLtLimit = sentencesAndQuestions.map(s=> s.length> TTS_ENGINE_CHAR_LIMIT ? chunk(s, TTS_ENGINE_CHAR_LIMIT) : s).flatMap(n=>n);

  console.log("Number of sentenses to be processed: "+ sentencesLtLimit.length)
  console.log("Number of sentenses from previous ('socket hung' teminated?) processing: "+ existingFileParts.length)

  return sentencesLtLimit;
}


function convert2mp3(sentencesLtLimit, options) {
    Promise.all(sentencesLtLimit.map((s,index)=> createMp3Parts(s, index, options))).then(values=>{
    const sortedFileNames = [... new Set(fileNames)].sort(naturalCompare);

    audioconcat(fileNames)
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
        const cleanTmpDir = () => rimraf(`./${TMP_DIR}/*`, function () { console.log('remove tmp files done'); });
        cleanTmpDir();
    })
  })
}

async function createMp3Parts(textChunk,index, options){
  const fname = TMP_DIR + '/' + index+".mp3";
  fileNames.push(fname);
  if ( !existingFileParts.includes(fname)) {
    const buffer = await tts.synthesize({
      text: textChunk,
      voice: options.language,
      slow: false // optional
    });
    fs.writeFileSync(fname, buffer);
  }
};

