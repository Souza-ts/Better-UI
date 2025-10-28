import { CONSTANTS } from '../utils/constants.js';
import { Helpers } from '../utils/helpers.js';

export class YouTubeMusicService {
    constructor() {
        this.currentSong = null;
        this.observers = [];
    }
    
    getCurrentSongInfo() {
        try {
            const titleElement = document.querySelector(CONSTANTS.SELECTORS.SONG_TITLE);
            const artistElement = document.querySelector(CONSTANTS.SELECTORS.SONG_ARTIST);
            
            if (!titleElement || !artistElement) {
                return null;
            }
            
            return {
                title: titleElement.textContent?.trim(),
                artist: artistElement.textContent?.trim(),
                timestamp: Date.now()
            };
        } catch (error) {
            console.error('Error getting song info:', error);
            return null;
        }
    }
    
    getCurrentTime() {
        try {
            const timeDisplay = document.querySelector(CONSTANTS.SELECTORS.TIME_INFO);
            if (timeDisplay) {
                const timeText = timeDisplay.textContent?.split('/')[0]?.trim();
                if (timeText) {
                    const [minutes, seconds] = timeText.split(':');
                    return parseInt(minutes) * 60 + parseInt(seconds);
                }
            }
            return 0;
        } catch (error) {
            return 0;
        }
    }
    
    isPlaying() {
        const playButton = document.querySelector(CONSTANTS.SELECTORS.PLAY_BUTTON);
        return playButton?.getAttribute('title')?.toLowerCase().includes('pause');
    }
    
    onSongChange(callback) {
        const debouncedCallback = Helpers.debounce(callback, 500);
        
        const observer = new MutationObserver(() => {
            const newSong = this.getCurrentSongInfo();
            if (newSong && (!this.currentSong || newSong.title !== this.currentSong.title)) {
                this.currentSong = newSong;
                debouncedCallback(newSong);
            }
        });
        
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
        
        this.observers.push(observer);
    }
    
    destroy() {
        this.observers.forEach(observer => observer.disconnect());
        this.observers = [];
    }
}