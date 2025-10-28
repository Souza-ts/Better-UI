import { YouTubeMusicService } from '../services/youtube-music.js';
import { LRCLibService } from '../services/lrclib-api.js';
import { LyricsContainer } from '../components/lyrics-container.js';
import { LyricsSync } from '../components/lyrics-sync.js';
import { StorageService } from '../services/storage.js';

class YTMusicLyricsApp {
    constructor() {
        this.ytMusic = new YouTubeMusicService();
        this.lrclib = new LRCLibService();
        this.lyricsContainer = new LyricsContainer();
        this.lyricsSync = new LyricsSync();
        this.storage = new StorageService();
        this.isInitialized = false;
        
        this.init();
    }
    
    async init() {
        try {
            await this.waitForPlayer();
            this.setupSongListener();
            this.isInitialized = true;
            console.log('YT Music Lyrics inicializado!');
        } catch (error) {
            console.error('Erro na inicialização:', error);
        }
    }
    
    async waitForPlayer() {
        return new Promise((resolve) => {
            const checkPlayer = setInterval(() => {
                const player = document.querySelector('ytmusic-player-bar');
                if (player) {
                    clearInterval(checkPlayer);
                    resolve();
                }
            }, 500);
        });
    }
    
    setupSongListener() {
        this.ytMusic.onSongChange(async (song) => {
            if (song) {
                await this.handleNewSong(song);
            }
        });
    }
    
    async handleNewSong(song) {
        try {
            this.lyricsContainer.displayLyrics(null); // Clear previous
            this.lyricsSync.stop();
            
            const settings = await this.storage.getSettings();
            if (!settings.autoShow) return;
            
            const lyrics = await this.lrclib.fetchLyrics(
                song.artist, 
                song.title, 
                this.ytMusic.getCurrentTime()
            );
            
            this.lyricsContainer.displayLyrics(lyrics);
            
            if (lyrics?.syncedLyrics && settings.syncEnabled) {
                this.lyricsSync.start(lyrics.syncedLyrics, this.ytMusic);
            }
            
        } catch (error) {
            console.error('Erro ao processar nova música:', error);
            this.lyricsContainer.displayLyrics(null);
        }
    }
    
    destroy() {
        this.ytMusic.destroy();
        this.lyricsSync.stop();
        this.isInitialized = false;
    }
}

// Inicializa a aplicação
if (window.location.hostname === 'music.youtube.com') {
    let app = null;
    
    const initApp = () => {
        if (!app) {
            app = new YTMusicLyricsApp();
        }
    };
    
    // Aguarda a página carregar
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initApp);
    } else {
        initApp();
    }
}