import { CONSTANTS } from './constants.js';

export class Helpers {
    static async sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
    
    static formatTime(seconds) {
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    }
    
    static parseLrcTime(timeString) {
        const [minutes, seconds] = timeString.split(':');
        return parseFloat(minutes) * 60 + parseFloat(seconds);
    }
    
    static debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }
}