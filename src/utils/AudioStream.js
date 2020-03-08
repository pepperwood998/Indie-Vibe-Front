import MapList from './MapList';

class AudioStream {
  constructor(mime = 'audio/mpeg') {
    this.audio = new Audio();
    this.media = new MediaSource();
    this.buffer = null;
    this.mime = mime;
    this.isPlaying = false;
    this.wasPlaying = false;
    this.isClearAll = false;

    this.trackId = '';
    this.apiInfo = trackId => undefined;
    this.apiData = (trackId, start, end) => undefined;

    this.sizeTotal = 0;
    this.sizeData = 0;
    this.sizeChunk = 0;
    this.offset = 0;
    this.bitrate = 0;

    // internal
    this.data = new MapList();
    this.chunkIndicator = null;
    this.isSkip = false;
    this.isFromClean = false;
    this.isFromSeeked = false;
    this.reqInfo = {
      status: false,
      start: 0,
      end: 0,
      threshold: 0
    };

    this.onBuffer = per => undefined;
    this.onProgress = (timeProgress, per) => undefined;
    this.onTrackFormatted = duration => undefined;

    // internal event
    this.eventSourceOpen = e => undefined;
    this.eventTimeUpdate = e => undefined;
    this.eventUpdateEnd = e => undefined;
  }

  init(apiInfo, apiData, togglePaused, autoplay) {
    this.audio.src = URL.createObjectURL(this.media);
    this.audio.onplaying = () => {
      this.isPlaying = true;
      togglePaused(false);
    };
    this.audio.onpause = () => {
      this.isPlaying = false;
      togglePaused(true);
    };
    this.audio.autoplay = autoplay;

    this.eventSourceOpen = e => {
      URL.revokeObjectURL(this.audio.src);

      this.buffer = this.media.addSourceBuffer(this.mime);

      this.eventUpdateEnd = e => {
        if (this.isSkip) {
          this.isSkip = false;
          this.data.reset();
          return;
        }

        if (this.chunkIndicator.byteEnd >= this.sizeTotal - 1) {
          this.reqInfo.status = false;
          return;
        }
        if (this.isFromClean) {
          this.isFromClean = false;
          this.buffer.appendBuffer(this.chunkIndicator.data);
          return;
        }

        this.data
          .continueChunk(this.chunkIndicator, this.sizeChunk)
          .then(newIndicator => {
            this.chunkIndicator = newIndicator;
            this.buffer.appendBuffer(newIndicator.data);
          })
          .catch(reqInfo => {
            this.reqInfo.start = reqInfo.start;
            this.reqInfo.end = reqInfo.end;
            // !!! fcking hard-coded !!!!
            if (this.buffer.buffered.length) {
              this.reqInfo.threshold = this.buffer.buffered.end(0) - 5;
              this.reqInfo.status = true;
            }
          });
      };
      this.buffer.addEventListener('updateend', this.eventUpdateEnd);

      this.apiInfo = apiInfo;
      this.apiData = apiData;
    };

    this.media.addEventListener('sourceopen', this.eventSourceOpen);

    this.eventTimeUpdate = e => {
      var progressPer = (this.audio.currentTime / this.media.duration) * 100;
      this.onProgress(
        this.getFormattedTime(
          Math.round((progressPer / 100) * this.media.duration)
        ),
        progressPer
      );

      if (
        !this.isFromSeeked &&
        this.reqInfo.status &&
        this.audio.currentTime >= this.reqInfo.threshold
      ) {
        this.reqInfo.status = false;
        this.fetchChunk(this.reqInfo.start, this.reqInfo.end).then(chunk => {
          let newIndicator = this.data.insert(
            this.chunkIndicator,
            this.chunkIndicator.next,
            chunk.data,
            chunk.start,
            chunk.end
          );

          if (!this.isClearAll) {
            this.chunkIndicator = newIndicator;
            this.buffer.appendBuffer(newIndicator.data);
          }
        });
      } else {
        this.isFromSeeked = false;
      }
    };
    this.audio.addEventListener('timeupdate', this.eventTimeUpdate);

    this.data.onInsert = chunk => {
      let bufferPer =
        ((chunk.byteEnd - chunk.byteStart + 1) / this.sizeData) * 100;
      let offsetPer = ((chunk.byteStart - this.offset) / this.sizeData) * 100;
      this.onBuffer(offsetPer, bufferPer);
    };
  }

  start(id) {
    if (!this.apiInfo || !this.apiData) {
      console.log('preparing resource...');
      return;
    }

    this.resetForSkip();
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

  togglePaused(paused) {
    if (this.audio.paused && !this.isPlaying) this.audio.play();
    else if (!this.audio.paused && this.isPlaying) this.audio.pause();
  }

  play() {
    if (this.audio.paused && !this.isPlaying) this.audio.play();
  }

  pause() {
    if (!this.audio.paused && this.isPlaying) this.audio.pause();
  }

  seek(per) {
    // problem:
    // should implement some queueing solution
    // prevent seeking before track info coming in
    //
    if (!this.trackId) return;
    if (this.isPlaying) this.wasPlaying = true;
    else this.wasPlaying = false;
    this.pause();
    let reqPoint = Math.round(this.sizeData * (per / 100)) + this.offset;
    let offsetTime = this.media.duration * (per / 100);

    this.data
      .seek(reqPoint, this.sizeChunk)
      .then(seeker => {
        this.fetchChunk(seeker.start, seeker.end)
          .then(chunk => {
            let newChunk = this.data.insert(
              seeker.before,
              seeker.after,
              chunk.data,
              chunk.start,
              chunk.end
            );

            // init != null, chunk is after init
            this.beginStreamSequences(seeker.init, newChunk, offsetTime);
          })
          .catch(error => console.log(error));
      })
      .catch(init => {
        // buffers ready to be appended, no insertion occurs
        this.beginStreamSequences(init, null, offsetTime);
      });
  }

  beginStreamSequences(init, newChunk, offsetTime) {
    if (this.wasPlaying) this.play();
    let canClean = false;
    let ranges = this.buffer.buffered;
    if (ranges.length) {
      if (offsetTime < ranges.start(0) || offsetTime > ranges.end(0)) {
        canClean = true;
      }
    }

    this.isFromSeeked = true;
    this.audio.currentTime = offsetTime;
    let timestampOffset = 0;

    if (init !== null || newChunk === null) {
      // click in buffered
      timestampOffset =
        ((init.byteStart - this.offset) / this.sizeData) * this.media.duration;
      if (newChunk !== null) {
        // new chunk inserted
        if (canClean) {
          console.log('buffered:', 'newchunk:', 'cleanup');
          this.chunkIndicator = init;
          this.clean(timestampOffset);
        } else {
          console.log('buffered:', 'newchunk:', 'continue');
          this.chunkIndicator = newChunk;
          this.buffer.appendBuffer(newChunk.data);
        }
      } else {
        // no insertion
        if (canClean) {
          console.log('buffered:', 'nonew:', 'cleanup');
          this.chunkIndicator = init;
          this.clean(timestampOffset);
        } else {
          console.log('buffered:', 'nonew:', 'continue');
        }
      }
    } else {
      // click in empty
      timestampOffset =
        ((newChunk.byteStart - this.offset) / this.sizeData) *
        this.media.duration;
      this.chunkIndicator = newChunk;
      if (this.buffer.buffered.length) {
        console.log('unbuffered:', 'cleanup');
        this.clean(timestampOffset);
      } else {
        console.log('unbuffered:', 'initial');
        this.buffer.timestampOffset = timestampOffset;
        this.buffer.appendBuffer(newChunk.data);
      }
    }
  }

  clean(newOffset) {
    this.buffer.abort();
    this.isFromClean = true;
    this.buffer.timestampOffset = newOffset;
    this.buffer.remove(
      this.buffer.buffered.start(0),
      this.buffer.buffered.end(0)
    );
  }

  resetForSkip() {
    this.buffer.abort();
    this.buffer.timestampOffset = 0;

    if (this.buffer.buffered.length) {
      this.isSkip = true;
      this.buffer.remove(
        this.buffer.buffered.start(0),
        this.buffer.buffered.end(0)
      );
    }
  }

  clearAll() {
    this.isClearAll = true;
    this.audio.removeEventListener('timeupdate', this.eventTimeUpdate);
    this.media.removeEventListener('sourceopen', this.eventSourceOpen);
    this.buffer.removeEventListener('updateend', this.eventUpdateEnd);

    this.audio.pause();
    this.audio.remove();
    if (this.buffer) {
      this.buffer.abort();
      if (this.buffer.length)
        this.buffer.remove(this.buffer.start(0), this.buffer.end(0));
      this.media.removeSourceBuffer(this.buffer);
    }
  }

  fetchInfo() {
    return this.apiInfo(this.trackId)
      .then(response => response.json())
      .then(info => {
        let data = info.data;
        if (!data) throw 'info not found';

        this.offset = data.mp3Offset;
        this.sizeTotal = data.fileSize128;
        this.sizeData = data.fileSize128 - data.mp3Offset;
        this.sizeChunk = ((128 * 1000) / 8) * 10;

        this.media.duration = Math.round(data.duration128 / 1000);
        this.data.size = data.fileSize128;
        this.data.offset = data.mp3Offset;

        this.onTrackFormatted(
          this.getFormattedTime(Math.round(data.duration128 / 1000))
        );
      })
      .catch(error => console.log(error));
  }

  fetchChunk(start, end) {
    return this.apiData(this.trackId, start, end)
      .then(response => {
        return response.arrayBuffer();
      })
      .then(data => {
        return {
          data,
          start,
          end: start + data.byteLength - 1
        };
      });
  }

  getFormattedTime(second) {
    // Hours, minutes and seconds
    var hrs = ~~(second / 3600);
    var mins = ~~((second % 3600) / 60);
    var secs = ~~second % 60;

    // Output like "1:01" or "4:03:59" or "123:03:59"
    var ret = '';

    if (hrs > 0) {
      ret += '' + hrs + ':' + (mins < 10 ? '0' : '');
    }

    ret += '' + mins + ':' + (secs < 10 ? '0' : '');
    ret += '' + secs;
    return ret;
  }
}

export default AudioStream;
