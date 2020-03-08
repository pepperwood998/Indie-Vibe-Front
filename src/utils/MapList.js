class Chunk {
  constructor(data, start, end) {
    this.next = null; // Chunk
    this.prev = null; // Chunk
    this.byteStart = start;
    this.byteEnd = end;
    this.data = data; // ArrayBuffer
  }
}

class MapList {
  constructor(size = 0, offset = 0) {
    this.head = null;
    this.tail = null;
    this.size = size;
    this.offset = offset;

    this.onInsert = chunk => undefined;
  }

  reset() {
    this.head = null;
    this.tail = null;
  }

  insert(before, after, data, start, end) {
    let chunk = new Chunk(data, start, end);
    if (before === null && after === null) {
      this.head = this.tail = chunk;
    } else {
      if (before === null) {
        if (this.head === after) {
          this.head = chunk;
        }
        chunk.next = after;
        after.prev = chunk;
      } else if (after === null) {
        if (this.tail === before) {
          this.tail = chunk;
        }
        before.next = chunk;
        chunk.prev = before;
      } else {
        chunk.prev = before;
        chunk.next = after;
        before.next = chunk;
        after.prev = chunk;
      }
    }

    this.onInsert(chunk);
    return chunk;
  }

  seek(point, maxSize) {
    return new Promise((resolve, reject) => {
      let before = null;
      let after = null;

      if (!this.isEmpty()) {
        if (this.tail.byteEnd === this.size - 1) {
          if (this.tail.byteStart <= point) reject(this.tail);
        }

        let temp = this.head;
        while (temp !== null) {
          if (point < temp.byteStart) {
            // ? - p - o
            before = temp.prev;
            after = temp;
            break;
          }

          if (temp.byteStart <= point && point <= temp.byteEnd) {
            // o(p)
            before = temp;
            after = temp.next;
            break;
          }

          temp = temp.next;
        }

        if (temp === null) {
          // o - p - x
          before = this.tail;
          after = null;
        }
      }

      this.evaluateInsertion(before, after, point, maxSize)
        .then(range => {
          resolve({
            before,
            after,
            ...range
          });
        })
        .catch(init => {
          reject(init);
        });
    });
  }

  evaluateInsertion(before, after, point, maxSize) {
    return new Promise((resolve, reject) => {
      let start = 0;
      let end = 0;
      let init = null;

      if (before === null && after === null) {
        // x - p - x
        start = point;
        end = point + maxSize - 1;
      } else if (before === null) {
        // x - p - o
        start = Math.min(
          point,
          Math.max(this.offset, after.byteStart - maxSize)
        );

        if (after.byteStart - start > maxSize) {
          end = start + maxSize - 1;
        } else {
          end = start + (after.byteStart - start) - 1;
        }
      } else {
        // o - p - ?
        start = Math.max(before.byteEnd + 1, point);
        if (point <= before.byteEnd) {
          // o(p) - ?
          init = before;
        }

        if (after === null) {
          // o - p - x
          end = start + maxSize - 1;
        } else {
          // o - p - o
          if (before.byteEnd + 1 === after.byteStart) {
            reject(before);
          }

          let diff = after.byteStart - before.byteEnd - 1;
          diff = Math.min(diff, maxSize);
          start = Math.min(start, after.byteStart - diff);
          end = start + diff - 1;
        }
      }

      resolve({
        init,
        start,
        end
      });
    });
  }

  continueChunk(indicator, maxSize) {
    return new Promise((resolve, reject) => {
      let after = indicator.next;

      if (after === null) {
        reject({
          start: indicator.byteEnd + 1,
          end: indicator.byteEnd + maxSize
        });
      }

      if (after !== null) {
        if (indicator.byteEnd + 1 === after.byteStart) {
          resolve(after);
        }

        reject({
          start: indicator.byteEnd + 1,
          end: Math.min(indicator.byteEnd + maxSize, after.byteStart - 1)
        });
      }
    });
  }

  isEmpty() {
    return this.head === null;
  }

  print() {
    let temp = this.head;
    let str = '';

    while (temp !== null) {
      str += `[${temp.byteStart},${temp.byteEnd}] `;
      temp = temp.next;
    }

    console.log(str);
  }
}

export default MapList;
