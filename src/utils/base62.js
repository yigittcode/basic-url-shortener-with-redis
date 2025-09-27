// Base62 character set (0-9, a-z, A-Z)
const BASE62_CHARS = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';

/**
 * Converts a numeric ID to Base62 format
 * @param {number} num - The numeric ID to convert
 * @returns {string} - The Base62 encoded string
 */
const toBase62 = (num) => {
    let shortCode = '';
    while (num > 0) {
        shortCode = BASE62_CHARS[num % 62] + shortCode;
        num = Math.floor(num / 62);
    }
    return shortCode || '0';
};

export { toBase62, BASE62_CHARS };
