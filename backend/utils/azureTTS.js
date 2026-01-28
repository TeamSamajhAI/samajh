const fs = require("fs");
const path = require("path");
const sdk = require("microsoft-cognitiveservices-speech-sdk");

async function generateSpeech(text, language) {
  const speechConfig = sdk.SpeechConfig.fromSubscription(
    process.env.AZURE_SPEECH_KEY,
    process.env.AZURE_SPEECH_REGION
  );

  const voiceMap = {
    en: "en-IN-NeerjaNeural",
    hi: "hi-IN-SwaraNeural",
    kn: "kn-IN-GaganNeural",
  };

  speechConfig.speechSynthesisVoiceName =
    voiceMap[language] || voiceMap.en;

  const publicDir = path.join(__dirname, "..", "public");
  if (!fs.existsSync(publicDir)) fs.mkdirSync(publicDir);

  const fileName = `tts-${Date.now()}.mp3`;
  const filePath = path.join(publicDir, fileName);

  const audioConfig = sdk.AudioConfig.fromAudioFileOutput(filePath);
  const synthesizer = new sdk.SpeechSynthesizer(speechConfig, audioConfig);

  return new Promise((resolve, reject) => {
    synthesizer.speakSsmlAsync(
      text,
      () => {
        synthesizer.close();
        resolve(`/tts/${fileName}`);
      },
      (err) => {
        synthesizer.close();
        reject(err);
      }
    );
  });
}

module.exports = { generateSpeech };
