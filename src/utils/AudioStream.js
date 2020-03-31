import { getFormattedTime } from './Common';

class AudioStream {
  constructor() {
    this.audio = new Audio();
    this.isPlaying = false;
    this.trackId = '';
    this.settings = { bitrate: 0, shouldPlay: false };
    this.ready = false;
    this.recorder = {
      started: false,
      startTime: 0,
      recorded: false,
      recordedDur: 0
    };

    this.api = trackId => undefined;

    // initial event handler
    this.onProgress = (time, per) => undefined;
    this.onDurationChange = duration => undefined;

    // manual event handler
    this.onTogglePaused = paused => undefined;
    this.onRecorded = trackId => undefined;
    this.onEnded = () => undefined;

    this.onInfo = info => undefined;

    // internal event
    this.eventDurationChange = e => undefined;
    this.eventCanPlay = e => undefined;
    this.eventTimeUpdate = e => undefined;
    this.eventStarted = e => undefined;
    this.eventEnded = e => undefined;
    this.eventPlaying = e => undefined;
    this.eventPause = e => undefined;
  }

  init(audio, onProgress, onDurationChange, settings) {
    this.settings = settings;
    this.audio = audio;
    this.audio.autoplay = settings.shouldPlay;
    this.onProgress = onProgress;
    this.onDurationChange = onDurationChange;

    this.eventDurationChange = e => {
      this.onDurationChange(getFormattedTime(this.audio.duration));
    };
    this.eventCanPlay = e => {
      this.ready = true;
    };
    this.eventTimeUpdate = e => {
      let currentTime = this.audio.currentTime;
      var ratio = currentTime / this.audio.duration;
      this.onProgress(
        getFormattedTime(this.audio.duration * ratio),
        ratio * 100
      );
      const recorder = this.recorder;
      if (!recorder.recorded && recorder.recordedDur >= 5) {
        this.recorder = {
          ...recorder,
          recordedDur: 0,
          recorded: true
        };
        this.onRecorded(this.trackId);
      } else {
        this.recorder = {
          ...recorder,
          startTime: currentTime,
          recordedDur: recorder.recordedDur + (currentTime - recorder.startTime)
        };
      }
    };
    this.eventStarted = e => {
      if (!this.recorder.started) {
        this.recorder = {
          ...this.recorder,
          started: true,
          startTime: this.audio.currentTime
        };
      }
    };
    this.eventEnded = e => {
      this.onEnded();
    };
    this.eventPlaying = e => {
      this.isPlaying = true;
      this.onTogglePaused(false);
    };
    this.eventPause = e => {
      this.isPlaying = false;
      this.onTogglePaused(true);
    };

    this.audio.addEventListener('durationchange', this.eventDurationChange);
    this.audio.addEventListener('canplay', this.eventCanPlay);
    this.audio.addEventListener('timeupdate', this.eventTimeUpdate);
    this.audio.addEventListener('play', this.eventStarted);
    this.audio.addEventListener('ended', this.eventEnded);
    this.audio.addEventListener('playing', this.eventPlaying);
    this.audio.addEventListener('pause', this.eventPause);
  }

  seek(per) {
    if (!this.audio.duration) return;

    let time = (per / 100) * this.audio.duration;
    this.recorder = { ...this.recorder, startTime: time };
    this.audio.currentTime = time;
  }

  refreshApi(api) {
    this.api = api;
  }

  start(id, shouldPlay) {
    this.trackId = id;
    this.audio.autoplay = shouldPlay;
    this.fetchInfo().then(() => {
      this.seek(0);
    });
  }

  continue(id) {
    this.start(id, true);
  }

  volume(per) {
    this.audio.volume = per / 100;
  }

  toggleMute(muted) {
    this.audio.muted = muted;
  }

  togglePaused() {
    if (!this.ready) return;

    if (this.audio.paused && !this.isPlaying) this.audio.play();
    else if (!this.audio.paused && this.isPlaying) this.audio.pause();
  }

  play() {
    if (this.audio.paused && !this.isPlaying) this.audio.play();
  }

  pause() {
    if (!this.audio.paused && this.isPlaying) this.audio.pause();
  }

  setSettings(settings) {
    this.settings = { ...this.settings, ...settings };
  }

  clean() {
    this.audio.removeEventListener('durationchange', this.eventDurationChange);
    this.audio.removeEventListener('canplay', this.eventCanPlay);
    this.audio.removeEventListener('timeupdate', this.eventTimeUpdate);
    this.audio.removeEventListener('ended', this.eventEnded);
    this.audio.removeEventListener('playing', this.eventPlaying);
    this.audio.removeEventListener('pause', this.eventPause);
  }

  fetchInfo() {
    this.ready = false;
    this.audio.pause();

    return this.api(this.trackId, this.settings.bitrate)
      .then(response => response.json())
      .then(info => {
        let { data } = info;
        if (!data) throw 'Info Not Found';

        this.recorder = {
          started: false,
          startTime: 0,
          recorded: false,
          recordedDur: 0
        };
        this.audio.src = data.url;
        this.audio.load();
        if (this.audio.autoplay) this.audio.play();
        this.onInfo(data.info);
      })
      .catch(error => console.log(error));
  }
}

export default AudioStream;
