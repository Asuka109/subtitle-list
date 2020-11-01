export interface Subtitle {
    id: string
    start: number
    end: number
}

const subtitleListSortFn = (a: Subtitle, b: Subtitle): number => a.start - b.start || a.end - b.end

export default class SubtitleList<ST extends Subtitle>{
    _subtitles: ST[] = []
    _lastIndex = 0  // between 0 and _subtitles.length - 1
    _idDict: Map<string, number> = new Map<string, number>()

    constructor(subtitles: ST[]) {
        this.subtitles = subtitles
    }

    private get _lastSubtitle(): ST {
        return this._subtitles[this._lastIndex]
    }

    get subtitles(): ST[] {
        return this._subtitles.slice()
    }

    set subtitles(subtitles: ST[]) {
        this._subtitles = subtitles.slice()
        this._subtitles.sort(subtitleListSortFn)
        this._lastIndex = 0
        this._idDict = new Map<string, number>()
        subtitles.forEach((subtitle, index) => this._idDict.set(subtitle.id, index))
    }

    private getIndex(id: string): number {
        return this._idDict.get(id) ?? -1
    }

    get(id: string): ST | undefined {
        return this._subtitles[this.getIndex(id)]
    }

    private findIndex(time: number): number {
        if (this._subtitles.length <= 0)
            return -1
        if (time < this._lastSubtitle.start)
            this._lastIndex = 0
        while(this._lastIndex < this._subtitles.length) {
            if (this._lastSubtitle.start > time)
                return -1
            if (this._lastSubtitle.start <= time && time < this._lastSubtitle.end)
                return this._lastIndex
            this._lastIndex++
        }
        return -1
    }

    find(time: number): ST | undefined {
        return this._subtitles[this.findIndex(time)]
    }

    findAll(time: number): ST[] {
        return this.between(time, time)
    }

    between(start: number, end: number): ST[] {
        const result: ST[] = []
        let index = this.findIndex(start)
        if (index < 0)
            return []
        while (this._subtitles[index] && this._subtitles[index].end > end)
            result.push(this._subtitles[index++])
        return result
    }
}
