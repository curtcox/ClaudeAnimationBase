// config.js: project settings.
//   duration: the video's length in seconds.
//   bpm:      the rhythm that bounces, dances and pulse() follow. Clawd always moves to some beat; if the video has music,
//             set this to the song's tempo, and set offset to the time in seconds of its first downbeat.
// A chapter of Frog or Axolotl (studio.html?chapter=N) takes its length from its generated timeline (src/gen/chNN.js) and
// an unhurried pulse; with no chapter, the kit's demo.
const PROJECT = window.CHAPTER ? { duration: CHAPTER.duration, bpm: 84, offset: 0 } : { duration: 11, bpm: 120, offset: 0 };
