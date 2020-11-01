import SubtitleList, {getSampleSubtitles} from '~/src/commons/SubtitleList'
import {nanoid} from 'nanoid'

let stList = new SubtitleList(getSampleSubtitles())

beforeEach(() => stList = new SubtitleList(getSampleSubtitles()))

it('should instantiates SubtitleList correctly', () => {
    expect(stList).toBeInstanceOf(SubtitleList)
})

it('should sorts subtitles after init', () => {
    const unsorted = [
        { start: 1000, end: 1500, id: 'a1' },
        { start: 1000, end: 1700, id: 'a2' },
        { start: 500, end: 1000, id: 'a3' }
    ]
    const sorted = [
        { start: 500, end: 1000, id: 'a3' },
        { start: 1000, end: 1500, id: 'a1' },
        { start: 1000, end: 1700, id: 'a2' }
    ]
    stList.subtitles = unsorted
    expect(stList.subtitles).toEqual(sorted)
})

it('should get object by id correctly', () => {
    stList.subtitles.forEach(subtitle => {
        const result = stList.get(subtitle.id)
        expect(result).toBe(subtitle)
    })
})

it('should find object by time', () => {
    const subtitles = getSampleSubtitles()
    expect(stList.find(0)).toStrictEqual(subtitles[0])
    expect(stList.find(250)).toStrictEqual(subtitles[0])
    expect(stList.find(500)).toBeUndefined()
})

it('should find first object with lapped time periods', () => {
    const subtitles = getSampleSubtitles()
    subtitles[1] = { start: 0, end: 100, id: 'a1' }
    stList.subtitles = subtitles
    expect(stList.find(0)).toBe(subtitles[1])
})

it('should find all objects by time', () => {
    stList.subtitles = [
        { start: 1000, end: 2000, id: 'a1' },
        { start: 1000, end: 1500, id: 'a2' },
        { start: 1500, end: 2000, id: 'a3' }
    ]
    const result = stList.findAll(1500)
    expect(result).toEqual([
        { start: 1000, end: 2000, id: 'a1' },
        { start: 1500, end: 2000, id: 'a3' }
    ])
})

it('should find object under 8ms', () => {
    const cycles = 10000
    const subtitles = Array
        .from(Array(cycles))
        .map(
            (_, i) => ({
                start: i * 1000,
                end: i * 1000 + 500,
                id: nanoid()
            })
        )
    stList.subtitles = subtitles
    const startTime = Date.now()
    subtitles.forEach(subtitle => stList.find(subtitle.start))
    const endTime = Date.now()
    expect((endTime - startTime) / cycles).toBeLessThan(8)
})
