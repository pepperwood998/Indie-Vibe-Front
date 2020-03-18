import { getFormattedTime } from './Common';

class AudioStream {
  constructor() {
    this.audio = new Audio();
    this.isPlaying = false;
    this.trackId = '';
    this.bitrate = 0;
    this.ready = false;

    this.api = trackId => undefined;

    // initial event handler
    this.onProgress = (time, per) => undefined;
    this.onDurationChange = duration => undefined;

    // manual event handler
    this.onTogglePaused = paused => undefined;
    this.onEnded = () => undefined;

    this.onInfo = info => undefined;

    // internal event
    this.eventDurationChange = e => undefined;
    this.eventCanPlay = e => undefined;
    this.eventTimeUpdate = e => undefined;
    this.eventEnded = e => undefined;
    this.eventPlaying = e => undefined;
    this.eventPause = e => undefined;
  }

  init(audio, onProgress, onDurationChange, autoplay, bitrate) {
    this.audio = audio;
    this.audio.autoplay = autoplay;
    this.onProgress = onProgress;
    this.onDurationChange = onDurationChange;
    this.bitrate = bitrate;

    this.eventDurationChange = e => {
      this.onDurationChange(getFormattedTime(this.audio.duration));
    };
    this.eventCanPlay = e => {
      this.ready = true;
    };
    this.eventTimeUpdate = e => {
      var ratio = this.audio.currentTime / this.audio.duration;
      this.onProgress(
        getFormattedTime(this.audio.duration * ratio),
        ratio * 100
      );
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
    this.audio.addEventListener('ended', this.eventEnded);
    this.audio.addEventListener('playing', this.eventPlaying);
    this.audio.addEventListener('pause', this.eventPause);
  }

  seek(per) {
    if (!this.audio.duration) return;
    let time = (per / 100) * this.audio.duration;
    this.audio.currentTime = time;
  }

  refreshApi(api) {
    this.api = api;
  }

  start(id) {
    this.trackId = id;
    this.fetchInfo().then(() => {
      this.seek(0);
    });
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

    return this.api(this.trackId, this.bitrate)
      .then(response => response.json())
      .then(info => {
        let { data } = info;
        if (!data) throw 'Info Not Found';

        this.audio.src = data.url;
        this.audio.load();
        if (this.isPlaying) this.audio.play();
        this.onInfo(data.info);
      })
      .catch(error => console.log(error));
  }
}

export default AudioStream;
