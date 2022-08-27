
import chunk from 'chunk-text';
import fs from 'fs';

import naturalCompare from 'string-natural-compare';
import rimraf from 'rimraf';


const TTS_ENGINE_CHAR_LIMIT = 199;



export default function splitTextToSentences(options) {

  const existingFileParts = fs.readdirSync(`./${options.engine.tmpDir}/`).filter(e => !e.endsWith(".gitkeep")).map(e => options.engine.tmpDir + "/" + e)
  options.engine.existingFileParts = existingFileParts;

  const { input } = options;
  const text = fs.readFileSync(input).toString();
  console.log("Input text no. of characters: " + text.length)

  const sentences = text.split('.').map(s => s + '.');
  // const sentences = text.split('.').split('\n').map(s=> s+'.');
  const sentencesAndQuestions = sentences.map(s => s.split("?")).flatMap(n => n).map(q => q.endsWith('.') ? q : q + "?")
  const sentencesLtLimit = sentencesAndQuestions.map(s => s.length > TTS_ENGINE_CHAR_LIMIT ? chunk(s, TTS_ENGINE_CHAR_LIMIT) : s).flatMap(n => n);

  console.log("Number of sentenses to be processed: " + sentencesLtLimit.length)
  console.log("Number of sentenses from previous ('socket hung' teminated?) processing: " + existingFileParts.length)

  return sentencesLtLimit;
}
