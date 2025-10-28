// Constantes da aplicação
export const CONSTANTS = {
    SELECTORS: {
        PLAYER_BAR: 'ytmusic-player-bar',
        SONG_TITLE: 'ytmusic-player-bar .title',
        SONG_ARTIST: 'ytmusic-player-bar .byline a',
        TIME_INFO: 'ytmusic-player-bar .time-info',
        PLAY_BUTTON: 'ytmusic-player-bar #play-pause-button'
    },
    
    API: {
        LRCLIB_BASE: 'https://lrclib.net/api',
        LRCLIB_GET: 'https://lrclib.net/api/get'
    },
    
    STORAGE_KEYS: {
        SETTINGS: 'ytmusic_lyrics_settings',
        THEME: 'ytmusic_lyrics_theme',
        POSITION: 'ytmusic_lyrics_position'
    },
    
    DEFAULT_SETTINGS: {
        autoShow: true,
        syncEnabled: true,
        theme: 'dark',
        position: 'bottom-right',
        fontSize: 14
    }
};