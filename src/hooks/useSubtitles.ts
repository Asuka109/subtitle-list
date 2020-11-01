import {useMemo, useRef} from 'react'
import SubtitleList, {Subtitle} from '../commons/SubtitleList'

const useSubtitles = <ST extends Subtitle>(subtitles: ST[] = []) => {
    const subtitleList = useRef(new SubtitleList(subtitles))
    return useMemo(() => ({
        get(id: string): ST {
            return subtitleList.current.get(id)
        },
        find(start: number, end?: number): ST[] {
            return subtitleList.current.between(start, end ?? start)
        },
        fill(subtitles: ST[]) {
            subtitleList.current.subtitles = subtitles
        },
        get subtitles(): ST[] {
            return subtitleList.current.subtitles
        }
    }), [])
}

export default useSubtitles
