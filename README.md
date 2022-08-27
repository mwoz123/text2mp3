# text2mp3
Conversts given text to mp3 using TTS


# Requirements:
nodeJS >= 14

# Install dependecies:
`npm ci`

# Usage:
`npm start <path_to_filename.txt>`
eg
`npm start input/example.txt`

adavance usage 

`npm start <path_to_file.txt> <ouptut_file_path.mp3> <language_in_2_chars_format>`
eg:
`npm start input/example.txt /home/mwoz/audio/tts.mp3 en`

#Known issues:
1. Long text could cause "Socket Hang execption" - then re-run the conversion again (using `npm start`)
2. Due to using free TTS service, text with >5h of using TTS could casue temporirly (few hours) TTS lock
