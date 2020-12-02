export interface Subtitle {
    id: string
    start: number
    end: number
}

const subtitleListSortFn = (a: Subtitle, b: Subtitle): number => a.start - b.start || a.end - b.end

export default class SubtitleList<ST extends Subtitle>{
    private _subtitles: ST[] = []
    private _lastIndex = 0  // between 0 and _subtitles.length - 1
    private _idDict: Map<string, number> = new Map<string, number>()

    constructor(subtitles: ST[]) {
        this.subtitles = subtitles
    }

    private get _lastSubtitle(): ST {
        return this._subtitles[this._lastIndex]
    }

    /*
    * Get current subtitles' copy.
    * */
    get subtitles(): ST[] {
        return this._subtitles.slice()
    }

    /*
    * Set current subtitles.
    * Note that the subtitles will be sorted first and rebuilt
    * and the mapping of id to index will be rebuilt.
    * */
    set subtitles(subtitles: ST[]) {
        this._subtitles = subtitles.slice()
        this._subtitles.sort(subtitleListSortFn)
        this._lastIndex = 0
        this._idDict = new Map<string, number>()
        subtitles.forEach((subtitle, index) => this._idDict.set(subtitle.id, index))
    }

    getIndex(id: string): number {
        return this._idDict.get(id) ?? -1
    }

    /*
    * Get a subtitle object by id.
    * */
    get(id: string): ST | undefined {
        return this._subtitles[this.getIndex(id)]
    }

    findIndex(time: number): number {
        if (this._subtitles.length <= 0)
            return -1
        if (time < this._lastSubtitle.start)
            this._lastIndex = 0
        this._lastIndex -= 1
        while(++this._lastIndex < this._subtitles.length) {
            if (this._lastSubtitle.start > time)
                return -1
            if (this._lastSubtitle.start <= time && time < this._lastSubtitle.end)
                return this._lastIndex
        }
        this._lastIndex -= 1
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
        while (this._subtitles[index] && this._subtitles[index].start <= end && this._subtitles[index].end > start)
            result.push(this._subtitles[index++])
        return result
    }
}

export const getSampleSubtitles = () => Array
    .from(Array(10))
    .map(
        (_, i) => ({
            start: i * 1000,
            end: i * 1000 + 500,
            id: `SampleSubtitle_${i}`
        })
    )
