import { CONSTANTS } from '../utils/constants.js';
import { Helpers } from '../utils/helpers.js';

export class LRCLibService {
    constructor() {
        this.baseURL = CONSTANTS.API.LRCLIB_BASE;
    }
    
    async fetchLyrics(artist, title, duration = 0) {
        try {
            const params = new URLSearchParams({
                artist_name: artist,
                track_name: title,
                duration: Math.floor(duration)
            });
            
            const response = await fetch(`${CONSTANTS.API.LRCLIB_GET}?${params}`);
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            return this.processLyricsData(data);
            
        } catch (error) {
            console.error('LRCLib API Error:', error);
            throw error;
        }
    }
    
    processLyricsData(data) {
        if (!data || data.error) {
            return null;
        }
        
        return {
            syncedLyrics: data.syncedLyrics,
            plainLyrics: data.plainLyrics,
            artist: data.artistName,
            title: data.trackName,
            duration: data.duration,
            source: 'lrclib'
        };
    }
}