export type Theme = {
  name: string;
  background: string; // CSS background property
  botName: string;
  botVoice: (msg: string) => string;
};

export const themes: Theme[] = [
  {
    name: "Cloudland",
    background: "linear-gradient(to bottom, #aeefff 0%, #ffffff 100%), url('/clouds-pixel.svg') repeat-x",
    botName: "Nimbus",
    botVoice: (msg) => `☁️ ${msg} ☁️`,
  },
  {
    name: "Brick Castle",
    background: "url('/bricks-pixel.svg') repeat",
    botName: "Sir Brick",
    botVoice: (msg) => `🏰 ${msg} 🏰`,
  },
  {
    name: "Overworld Path",
    background: "url('/path-pixel.svg') repeat",
    botName: "Sage Link",
    botVoice: (msg) => `🗺️ ${msg} 🗺️`,
  },
  {
    name: "Forest Maze",
    background: "linear-gradient(to bottom, #4caf50 0%, #2e7d32 100%), url('/forest-pixel.svg') repeat",
    botName: "Leafy",
    botVoice: (msg) => `🌲 ${msg} 🌲`,
  },
  {
    name: "Underwater Ruins",
    background: "linear-gradient(to bottom, #2196f3 0%, #00bcd4 100%), url('/underwater-pixel.svg') repeat",
    botName: "Coral",
    botVoice: (msg) => `🌊 ${msg} 🌊`,
  },
]; 