class ReadingStatus {
    constructor(offset, shift) {
        this.shift = shift;
        this.cursor = offset;
        this.log = [];

        Object.defineProperty(this, 'iteration', {
            get: () => this.log.length
        });

        Object.defineProperty(this, 'previous', {
            get: () => this.log[this.log.length - 1]
        });

        Object.defineProperty(this, 'step', {
            get: () => {
                if (this.iteration === 0) {
                    // первый шаг
                    return this.shift;
                } else {
                    return Math.pow(2, 13);
//                return 2**(10 + 3 * (data.meta.iteration - 1))
//                return 2**(10 + 2 * (this.iteration - 1));
                }
            }
        });

        Object.defineProperty(this, 'range', {
            get: () => [this.cursor, this.cursor + this.step - 1]
        });
    }

    count (cursor) {
        const self = this;
        this.log.push({
            range: self.range,
            step: self.step
        });

        this.cursor = this.cursor - this.shift + this.previous.step + 1;
    }
}

sub.ReadingStatus = ReadingStatus;
