# text2mp3
Conversts given (longer) text to mp3 using TTS


### Requirements:
- [nodeJS](https://nodejs.org/en/) >= 14
- [ffmpeg](https://ffmpeg.org)

#### Install dependecies:
`npm ci`

# Usage:
`npm start <path_to_filename.txt>`

eg:

`npm start file/example.txt`

#### advanced usage 

`npm start <path_to_file.txt> <ouptut_file.mp3> <language>`

eg:

`npm start file/example.txt ~/audio/tts.mp3 en`

## Known issues:
1. Long text could cause "Socket Hang execption" - then re-run the conversion again (using `npm start`). It will start from where it left.
2. Due to using free TTS service, very long text >5h of using TTS could casue temporarily (few hours) TTS lock
