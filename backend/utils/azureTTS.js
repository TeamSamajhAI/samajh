import fs from "fs";
import path from "path";
import sdk from "microsoft-cognitiveservices-speech-sdk";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Audio output directory
const AUDIO_DIR = path.join(__dirname, "..", "public", "tts");

if (!fs.existsSync(AUDIO_DIR)) {
  fs.mkdirSync(AUDIO_DIR, { recursive: true });
}

export async function generateSpeech(ssml, language = "en") {
  return new Promise((resolve, reject) => {
    try {
      const speechConfig = sdk.SpeechConfig.fromSubscription(
        process.env.AZURE_SPEECH_KEY,
        process.env.AZURE_SPEECH_REGION
      );

      speechConfig.speechSynthesisOutputFormat =
        sdk.SpeechSynthesisOutputFormat.Audio16Khz32KBitRateMonoMp3;

      const fileName = `tts_${Date.now()}.mp3`;
      const filePath = path.join(AUDIO_DIR, fileName);

      const audioConfig = sdk.AudioConfig.fromAudioFileOutput(filePath);
      const synthesizer = new sdk.SpeechSynthesizer(
        speechConfig,
        audioConfig
      );

      synthesizer.speakSsmlAsync(
        ssml,
        () => {
          synthesizer.close();
          resolve(`/tts/${fileName}`);
        },
        (err) => {
          synthesizer.close();
          reject(err);
        }
      );
    } catch (err) {
      reject(err);
    }
  });
}
