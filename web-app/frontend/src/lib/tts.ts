
export function speak(text: string, lang: 'ar' | 'en') {
    if (!text) return

    // If Arabic, try Online YOUDAO first (very reliable), then Google, then Native
    if (lang === 'ar') {
        playOnline(text, 'ar', () => {
            // If online fails, try native as last resort
            playNative(text, 'ar')
        })
        return
    }

    // For English, Native is usually good and faster
    playNative(text, 'en')
}

function playNative(text: string, lang: string) {
    const voices = window.speechSynthesis.getVoices()
    let nativeVoice = null

    if (lang === 'ar') {
        nativeVoice = voices.find(v => v.lang.includes('ar') || v.name.toLowerCase().includes('arabic'))
    } else {
        nativeVoice = voices.find(v => v.lang.startsWith('en'))
    }

    // Attempt to speak even if explicit voice not found, relying on 'lang' property
    const u = new SpeechSynthesisUtterance(text)
    if (nativeVoice) u.voice = nativeVoice
    u.lang = nativeVoice ? nativeVoice.lang : (lang === 'ar' ? 'ar-SA' : 'en-US')
    window.speechSynthesis.speak(u)
}

const ARABIC_TTS_URLS = (encoded: string) => [
    `https://dict.youdao.com/dictvoice?audio=${encoded}&le=ar`,
    `https://translate.google.com/translate_tts?ie=UTF-8&client=tw-ob&tl=ar&q=${encoded}`
]

function playOnline(text: string, lang: string, onFail: () => void) {
    if (lang !== 'ar') {
        // For non-Arabic, just try Google or fallback immediately
        onFail()
        return
    }

    const encoded = encodeURIComponent(text)
    const urls = ARABIC_TTS_URLS(encoded)

    let index = 0

    const tryNext = () => {
        if (index >= urls.length) {
            onFail()
            return
        }
        const url = urls[index]
        index++

        const audio = new Audio(url)
        // audio.oncanplaythrough = () => audio.play().catch(() => tryNext()) 
        // Just play, handle error
        const p = audio.play()
        if (p !== undefined) {
            p.then(() => { /* started */ }).catch((e) => {
                console.error('TTS Play failed', url, e)
                tryNext()
            })
        }

        audio.onerror = () => tryNext()
        // If it hangs, we can't easily timeout without complex logic, but audio.onerror usually catches 404s
    }

    tryNext()
}
