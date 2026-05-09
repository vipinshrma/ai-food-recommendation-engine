const LRU = new Map();

export function rateLimit(ip, limit = 10, windowMs = 60000) {
    const now = Date.now();
    const windowStart = now - windowMs;

    if (!LRU.has(ip)) {
        LRU.set(ip, []);
    }

    let requests = LRU.get(ip);

    // Filter out old requests outside the current window
    requests = requests.filter(timestamp => timestamp > windowStart);

    if (requests.length >= limit) {
        return {
            success: false,
            remaining: 0,
            reset: requests[0] + windowMs
        };
    }

    requests.push(now);
    LRU.set(ip, requests);

    // Periodically clean up old IPs to prevent memory leaks
    if (LRU.size > 1000) {
        for (const [key, value] of LRU.entries()) {
            if (value[value.length - 1] < windowStart) {
                LRU.delete(key);
            }
        }
    }

    return {
        success: true,
        remaining: limit - requests.length,
        reset: now + windowMs
    };
}
