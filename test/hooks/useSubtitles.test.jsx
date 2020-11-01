import { renderHook, act } from '@testing-library/react-hooks'
import useSubtitles from '~/src/hooks/useSubtitles'
import {getSampleSubtitles} from '~/src/commons/SubtitleList'

it('should use hook correctly', () => {
    const subtitles = getSampleSubtitles()
    const { result } = renderHook(() => useSubtitles(subtitles))
    expect(result.current).toBeDefined()
})

it('should init with empty data correctly', () => {
    const { result } = renderHook(() => useSubtitles([]))
    expect(result.current.subtitles).toStrictEqual([])
})

it('should fill data correctly', () => {
    const subtitles = getSampleSubtitles()
    const { result } = renderHook(() => useSubtitles([]))
    act(() => result.current.fill(subtitles))
    expect(result.current.subtitles).toStrictEqual(subtitles)
})

it('should get subtitle by id', () => {
    const subtitles = getSampleSubtitles()
    const { result } = renderHook(() => useSubtitles(subtitles))
    const target = subtitles[2]
    const query = result.current.get(target.id)
    expect(query).toStrictEqual(target)
})

it('should find all subtitles by time', () => {
    const subtitles = [
        { start: 1000, end: 2000, id: 'a1' },
        { start: 1000, end: 1500, id: 'a2' },
        { start: 1500, end: 2000, id: 'a3' }
    ]
    const { result } = renderHook(() => useSubtitles(subtitles))
    const query = result.current.find(1500)
    expect(query).toEqual([
        { start: 1000, end: 2000, id: 'a1' },
        { start: 1500, end: 2000, id: 'a3' }
    ])
})
