import { StorageService } from '../services/storage.js';

export class LyricsContainer {
    constructor() {
        this.container = null;
        this.storage = new StorageService();
        this.isVisible = true;
        this.init();
    }
    
    init() {
        this.createContainer();
        this.loadSettings();
    }
    
    createContainer() {
        this.container = document.createElement('div');
        this.container.id = 'ytmusic-lrc-container';
        this.container.className = 'lrc-container';
        
        this.container.innerHTML = `
            <div class="lrc-header">
                <h3>🎵 Letras Sincronizadas</h3>
                <div class="lrc-controls">
                    <button class="lrc-toggle">−</button>
                    <button class="lrc-close">×</button>
                </div>
            </div>
            <div class="lrc-content">
                <div class="lrc-loading">Carregando letras...</div>
            </div>
            <div class="lrc-footer">
                <span class="lrc-source">Fonte: LRCLib.net</span>
            </div>
        `;
        
        this.setupEventListeners();
        this.injectIntoPage();
    }
    
    setupEventListeners() {
        // Toggle visibility
        this.container.querySelector('.lrc-toggle').addEventListener('click', () => {
            this.toggleVisibility();
        });
        
        // Close container
        this.container.querySelector('.lrc-close').addEventListener('click', () => {
            this.hide();
        });
    }
    
    injectIntoPage() {
        const playerBar = document.querySelector('ytmusic-player-bar');
        if (playerBar) {
            playerBar.appendChild(this.container);
        } else {
            document.body.appendChild(this.container);
        }
    }
    
    async loadSettings() {
        const settings = await this.storage.getSettings();
        this.applySettings(settings);
    }
    
    applySettings(settings) {
        if (settings.theme) {
            this.container.setAttribute('data-theme', settings.theme);
        }
        
        if (settings.position) {
            this.container.setAttribute('data-position', settings.position);
        }
        
        if (settings.fontSize) {
            this.container.style.setProperty('--font-size', `${settings.fontSize}px`);
        }
    }
    
    displayLyrics(lyricsData) {
        const content = this.container.querySelector('.lrc-content');
        
        if (!lyricsData) {
            content.innerHTML = '<div class="lrc-error">Letras não encontradas</div>';
            return;
        }
        
        if (lyricsData.syncedLyrics) {
            content.innerHTML = this.formatSyncedLyrics(lyricsData.syncedLyrics);
        } else if (lyricsData.plainLyrics) {
            content.innerHTML = `<div class="lrc-plain">${lyricsData.plainLyrics}</div>`;
        }
    }
    
    formatSyncedLyrics(lyrics) {
        return lyrics.split('\n')
            .map(line => {
                const match = line.match(/^\[(\d+:\d+\.\d+)\](.*)/);
                if (match) {
                    const [, time, text] = match;
                    return `<div class="lrc-line" data-time="${time}">${text.trim()}</div>`;
                }
                return `<div class="lrc-line">${line.trim()}</div>`;
            })
            .join('');
    }
    
    show() {
        this.container.style.display = 'block';
        this.isVisible = true;
    }
    
    hide() {
        this.container.style.display = 'none';
        this.isVisible = false;
    }
    
    toggleVisibility() {
        if (this.isVisible) {
            this.hide();
        } else {
            this.show();
        }
    }
    
    updatePosition(position) {
        this.container.setAttribute('data-position', position);
        this.storage.saveSetting('position', position);
    }
}