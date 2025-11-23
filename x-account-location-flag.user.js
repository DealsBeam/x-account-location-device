// ==UserScript==
// @name         X Account Location & Device Info
// @namespace    http://tampermonkey.net/
// @version      1.0.0
// @description  Shows country flag emojis and device/platform emojis next to X usernames with hover tooltips
// @author       Alexander Hagenah (@xaitax)
// @homepage     https://github.com/xaitax/x-account-location-device
// @supportURL   https://primepage.de
// @supportURL   https://www.linkedin.com/in/alexhagenah/
// @match        *://*x.com/*
// @match        *://*twitter.com/*
// @grant        unsafeWindow
// ==/UserScript==

(function() {
    'use strict';

    console.log('🚀 X Account Location & Device Info userscript loaded');

    // Immediately expose to global scope
    unsafeWindow.XFlagScript = {
        clearCache: () => console.log('clearCache function available'),
        getCacheInfo: () => console.log('getCacheInfo function available'),
        removeAllFlags: () => console.log('removeAllFlags function available'),
        processUsernames: () => console.log('processUsernames function available'),
        version: '1.7.0'
    };

    // Also try window
    if (typeof window !== 'undefined') {
        window.XFlagScript = unsafeWindow.XFlagScript;
    }

    // Country name to flag emoji mapping
    const COUNTRY_FLAGS = {
        // A
        "Afghanistan": "🇦🇫",
        "Albania": "🇦🇱",
        "Algeria": "🇩🇿",
        "Andorra": "🇦🇩",
        "Angola": "🇦🇴",
        "Antigua and Barbuda": "🇦🇬",
        "Argentina": "🇦🇷",
        "Armenia": "🇦🇲",
        "Australia": "🇦🇺",
        "Austria": "🇦🇹",
        "Azerbaijan": "🇦🇿",
        
        // B
        "Bahamas": "🇧🇸",
        "Bahrain": "🇧🇭",
        "Bangladesh": "🇧🇩",
        "Barbados": "🇧🇧",
        "Belarus": "🇧🇾",
        "Belgium": "🇧🇪",
        "Belize": "🇧🇿",
        "Benin": "🇧🇯",
        "Bhutan": "🇧🇹",
        "Bolivia": "🇧🇴",
        "Bosnia and Herzegovina": "🇧🇦",
        "Bosnia": "🇧🇦",
        "Botswana": "🇧🇼",
        "Brazil": "🇧🇷",
        "Brunei": "🇧🇳",
        "Bulgaria": "🇧🇬",
        "Burkina Faso": "🇧🇫",
        "Burundi": "🇧🇮",
        
        // C
        "Cambodia": "🇰🇭",
        "Cameroon": "🇨🇲",
        "Canada": "🇨🇦",
        "Cape Verde": "🇨🇻",
        "Central African Republic": "🇨🇫",
        "Chad": "🇹🇩",
        "Chile": "🇨🇱",
        "China": "🇨🇳",
        "Colombia": "🇨🇴",
        "Comoros": "🇰🇲",
        "Congo": "🇨🇬",
        "Costa Rica": "🇨🇷",
        "Croatia": "🇭🇷",
        "Cuba": "🇨🇺",
        "Cyprus": "🇨🇾",
        "Czech Republic": "🇨🇿",
        "Czechia": "🇨🇿",
        
        // D
        "Democratic Republic of the Congo": "🇨🇩",
        "Denmark": "🇩🇰",
        "Djibouti": "🇩🇯",
        "Dominica": "🇩🇲",
        "Dominican Republic": "🇩🇴",
        
        // E
        "East Timor": "🇹🇱",
        "Ecuador": "🇪🇨",
        "Egypt": "🇪🇬",
        "El Salvador": "🇸🇻",
        "England": "🏴󠁧󠁢󠁥󠁮󠁧󠁿",
        "Equatorial Guinea": "🇬🇶",
        "Eritrea": "🇪🇷",
        "Estonia": "🇪🇪",
        "Eswatini": "🇸🇿",
        "Ethiopia": "🇪🇹",
        "Europe": "🇪🇺",
        "European Union": "🇪🇺",
        
        // F
        "Fiji": "🇫🇯",
        "Finland": "🇫🇮",
        "France": "🇫🇷",
        
        // G
        "Gabon": "🇬🇦",
        "Gambia": "🇬🇲",
        "Georgia": "🇬🇪",
        "Germany": "🇩🇪",
        "Ghana": "🇬🇭",
        "Greece": "🇬🇷",
        "Grenada": "🇬🇩",
        "Guatemala": "🇬🇹",
        "Guinea": "🇬🇳",
        "Guinea-Bissau": "🇬🇼",
        "Guyana": "🇬🇾",
        
        // H
        "Haiti": "🇭🇹",
        "Honduras": "🇭🇳",
        "Hong Kong": "🇭🇰",
        "Hungary": "🇭🇺",
        
        // I
        "Iceland": "🇮🇸",
        "India": "🇮🇳",
        "Indonesia": "🇮🇩",
        "Iran": "🇮🇷",
        "Iraq": "🇮🇶",
        "Ireland": "🇮🇪",
        "Israel": "🇮🇱",
        "Italy": "🇮🇹",
        "Ivory Coast": "🇨🇮",
        
        // J
        "Jamaica": "🇯🇲",
        "Japan": "🇯🇵",
        "Jordan": "🇯🇴",
        
        // K
        "Kazakhstan": "🇰🇿",
        "Kenya": "🇰🇪",
        "Kiribati": "🇰🇮",
        "Korea": "🇰🇷",
        "Kosovo": "🇽🇰",
        "Kuwait": "🇰🇼",
        "Kyrgyzstan": "🇰🇬",
        
        // L
        "Laos": "🇱🇦",
        "Latvia": "🇱🇻",
        "Lebanon": "🇱🇧",
        "Lesotho": "🇱🇸",
        "Liberia": "🇱🇷",
        "Libya": "🇱🇾",
        "Liechtenstein": "🇱🇮",
        "Lithuania": "🇱🇹",
        "Luxembourg": "🇱🇺",
        
        // M
        "Macao": "🇲🇴",
        "Macau": "🇲🇴",
        "Madagascar": "🇲🇬",
        "Malawi": "🇲🇼",
        "Malaysia": "🇲🇾",
        "Maldives": "🇲🇻",
        "Mali": "🇲🇱",
        "Malta": "🇲🇹",
        "Marshall Islands": "🇲🇭",
        "Mauritania": "🇲🇷",
        "Mauritius": "🇲🇺",
        "Mexico": "🇲🇽",
        "Micronesia": "🇫🇲",
        "Moldova": "🇲🇩",
        "Monaco": "🇲🇨",
        "Mongolia": "🇲🇳",
        "Montenegro": "🇲🇪",
        "Morocco": "🇲🇦",
        "Mozambique": "🇲🇿",
        "Myanmar": "🇲🇲",
        "Burma": "🇲🇲",
        
        // N
        "Namibia": "🇳🇦",
        "Nauru": "🇳🇷",
        "Nepal": "🇳🇵",
        "Netherlands": "🇳🇱",
        "New Zealand": "🇳🇿",
        "Nicaragua": "🇳🇮",
        "Niger": "🇳🇪",
        "Nigeria": "🇳🇬",
        "North Korea": "🇰🇵",
        "North Macedonia": "🇲🇰",
        "Macedonia": "🇲🇰",
        "Norway": "🇳🇴",
        
        // O
        "Oman": "🇴🇲",
        
        // P
        "Pakistan": "🇵🇰",
        "Palau": "🇵🇼",
        "Palestine": "🇵🇸",
        "Panama": "🇵🇦",
        "Papua New Guinea": "🇵🇬",
        "Paraguay": "🇵🇾",
        "Peru": "🇵🇪",
        "Philippines": "🇵🇭",
        "Poland": "🇵🇱",
        "Portugal": "🇵🇹",
        "Puerto Rico": "🇵🇷",
        
        // Q
        "Qatar": "🇶🇦",
        
        // R
        "Romania": "🇷🇴",
        "Russia": "🇷🇺",
        "Russian Federation": "🇷🇺",
        "Rwanda": "🇷🇼",
        
        // S
        "Saint Kitts and Nevis": "🇰🇳",
        "Saint Lucia": "🇱🇨",
        "Saint Vincent and the Grenadines": "🇻🇨",
        "Samoa": "🇼🇸",
        "San Marino": "🇸🇲",
        "Sao Tome and Principe": "🇸🇹",
        "Saudi Arabia": "🇸🇦",
        "Scotland": "🏴󠁧󠁢󠁳󠁣󠁴󠁿",
        "Senegal": "🇸🇳",
        "Serbia": "🇷🇸",
        "Seychelles": "🇸🇨",
        "Sierra Leone": "🇸🇱",
        "Singapore": "🇸🇬",
        "Slovakia": "🇸🇰",
        "Slovenia": "🇸🇮",
        "Solomon Islands": "🇸🇧",
        "Somalia": "🇸🇴",
        "South Africa": "🇿🇦",
        "South Korea": "🇰🇷",
        "South Sudan": "🇸🇸",
        "Spain": "🇪🇸",
        "Sri Lanka": "🇱🇰",
        "Sudan": "🇸🇩",
        "Suriname": "🇸🇷",
        "Sweden": "🇸🇪",
        "Switzerland": "🇨🇭",
        "Syria": "🇸🇾",
        
        // T
        "Taiwan": "🇹🇼",
        "Tajikistan": "🇹🇯",
        "Tanzania": "🇹🇿",
        "Thailand": "🇹🇭",
        "Timor-Leste": "🇹🇱",
        "Togo": "🇹🇬",
        "Tonga": "🇹🇴",
        "Trinidad and Tobago": "🇹🇹",
        "Tunisia": "🇹🇳",
        "Turkey": "🇹🇷",
        "Türkiye": "🇹🇷",
        "Turkmenistan": "🇹🇲",
        "Tuvalu": "🇹🇻",
        
        // U
        "Uganda": "🇺🇬",
        "Ukraine": "🇺🇦",
        "United Arab Emirates": "🇦🇪",
        "UAE": "🇦🇪",
        "United Kingdom": "🇬🇧",
        "UK": "🇬🇧",
        "Great Britain": "🇬🇧",
        "Britain": "🇬🇧",
        "United States": "🇺🇸",
        "USA": "🇺🇸",
        "US": "🇺🇸",
        "Uruguay": "🇺🇾",
        "Uzbekistan": "🇺🇿",
        
        // V
        "Vanuatu": "🇻🇺",
        "Vatican City": "🇻🇦",
        "Venezuela": "🇻🇪",
        "Vietnam": "🇻🇳",
        
        // W
        "Wales": "🏴󠁧󠁢󠁷󠁬󠁳󠁿",
        
        // Y
        "Yemen": "🇾🇪",
        
        // Z
        "Zambia": "🇿🇲",
        "Zimbabwe": "🇿🇼"
    };

    function getCountryFlag(countryName) {
        if (!countryName) return null;

        // Try exact match first
        if (COUNTRY_FLAGS[countryName]) {
            return COUNTRY_FLAGS[countryName];
        }

        // Try case-insensitive match
        const normalized = countryName.trim();
        for (const [country, flag] of Object.entries(COUNTRY_FLAGS)) {
            if (country.toLowerCase() === normalized.toLowerCase()) {
                return flag;
            }
        }

        return null;
    }

    // Device/platform to emoji mapping
    function getDeviceEmoji(deviceInfo) {
        if (!deviceInfo) return null;

        const device = deviceInfo.toLowerCase();

        // Specific device mappings
        if (device.includes('android')) return '📱';
        if (device.includes('iphone') || device.includes('ipad')) return '📱';
        if (device.includes('mac')) return '💻';
        if (device.includes('windows')) return '🖥️';
        if (device.includes('linux')) return '💻';
        if (device.includes('web')) return '🌐';

        // Generic mobile/web fallbacks
        if (device.includes('mobile') || device.includes('phone')) return '📱';
        if (device.includes('desktop') || device.includes('computer')) return '🖥️';

        // Default to mobile
        return '📱';
    }

    // Cache for user locations - persistent storage
    let locationCache = new Map();
    const CACHE_KEY = 'x_location_cache';
    const CACHE_EXPIRY_HOURS = 24; // Cache for 24 hours

    // Rate limiting
    const requestQueue = [];
    let isProcessingQueue = false;
    let lastRequestTime = 0;
    const MIN_REQUEST_INTERVAL = 2000; // 2 seconds between requests
    const MAX_CONCURRENT_REQUESTS = 2; // Reduced concurrent requests
    let activeRequests = 0;
    let rateLimitResetTime = 0; // Unix timestamp when rate limit resets

    // Observer for dynamically loaded content
    let observer = null;

    // Extension enabled state
    let extensionEnabled = true;
    const TOGGLE_KEY = 'extension_enabled';
    const DEFAULT_ENABLED = true;

    // Track usernames currently being processed to avoid duplicate requests
    const processingUsernames = new Set();

    // Store headers from X's own API calls
    let xHeaders = null;
    let headersReady = false;

    // Function to capture headers from X's API calls
    function captureHeaders(headers) {
        if (!headers) return;

        const headerObj = {};
        if (headers instanceof Headers) {
            headers.forEach((value, key) => {
                headerObj[key] = value;
            });
        } else if (headers instanceof Object) {
            // Copy all headers
            for (const [key, value] of Object.entries(headers)) {
                headerObj[key] = value;
            }
        }

        // Replace headers completely (don't merge) to ensure we get auth tokens
        xHeaders = headerObj;
        headersReady = true;
        console.log('Captured X API headers:', Object.keys(headerObj));
    }

    // Intercept fetch to capture X's headers
    const originalFetch = window.fetch;
    window.fetch = function(...args) {
        const url = args[0];
        const options = args[1] || {};

        // If it's a X GraphQL API call, capture ALL headers
        if (typeof url === 'string' && url.includes('x.com/i/api/graphql')) {
            if (options.headers) {
                captureHeaders(options.headers);
                console.log('Captured X headers from fetch:', Object.keys(xHeaders || {}));
            }
        }

        return originalFetch.apply(this, args);
    };

    // Also intercept XMLHttpRequest to capture X's headers
    const originalXHROpen = XMLHttpRequest.prototype.open;
    const originalXHRSend = XMLHttpRequest.prototype.send;

    XMLHttpRequest.prototype.open = function(method, url, ...rest) {
        this._url = url;
        return originalXHROpen.apply(this, [method, url, ...rest]);
    };

    XMLHttpRequest.prototype.send = function(...args) {
        if (this._url && this._url.includes('x.com/i/api/graphql')) {
            const headers = {};
            // Try to get headers from setRequestHeader
            if (this._headers) {
                Object.assign(headers, this._headers);
            }
            captureHeaders(headers);
            console.log('Captured X headers from XMLHttpRequest:', Object.keys(xHeaders || {}));
        }
        return originalXHRSend.apply(this, args);
    };

    const originalSetRequestHeader = XMLHttpRequest.prototype.setRequestHeader;
    XMLHttpRequest.prototype.setRequestHeader = function(header, value) {
        if (!this._headers) this._headers = {};
        this._headers[header] = value;
        return originalSetRequestHeader.apply(this, [header, value]);
    };

    // Wait a bit for X to make some API calls first
    setTimeout(() => {
        if (!headersReady) {
            console.log('No X headers captured yet, using defaults');
            xHeaders = {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            };
            headersReady = true;
        }
    }, 3000);

    // Load enabled state
    async function loadEnabledState() {
        try {
            const result = localStorage.getItem(TOGGLE_KEY);
            extensionEnabled = result !== null ? JSON.parse(result) : DEFAULT_ENABLED;
            console.log('Extension enabled:', extensionEnabled);
        } catch (error) {
            console.error('Error loading enabled state:', error);
            extensionEnabled = DEFAULT_ENABLED;
        }
    }

    // Load cache from persistent storage
    async function loadCache() {
        try {
            const result = localStorage.getItem(CACHE_KEY);
            if (result) {
                const parsed = JSON.parse(result);
                if (parsed && typeof parsed === 'object') {
                    const now = Date.now();
                    let loadedCount = 0;

                    // Filter out expired entries
                    for (const [key, data] of Object.entries(parsed)) {
                        if (data.expiry && data.expiry > now) {
                            // Load location data
                            if (data.location !== null && !key.includes('_device') && !key.includes('_info')) {
                                locationCache.set(key, data.location);
                                loadedCount++;
                            }
                            // Load device info
                            else if (key.includes('_device') && data.location !== null) {
                                locationCache.set(key, data.location);
                                loadedCount++;
                            }
                            // Load combined info
                            else if (key.includes('_info') && data.location !== null) {
                                locationCache.set(key, data.location);
                                loadedCount++;
                            }
                        }
                    }
                    console.log(`Loaded ${loadedCount} cached entries`);
                }
            }
        } catch (error) {
            console.error('Error loading cache:', error);
        }
    }

    // Save cache to persistent storage
    async function saveCache() {
        try {
            const cacheObj = {};
            const now = Date.now();
            const expiry = now + (CACHE_EXPIRY_HOURS * 60 * 60 * 1000);

            for (const [key, value] of locationCache.entries()) {
                cacheObj[key] = {
                    location: value,
                    expiry: expiry,
                    cachedAt: now
                };
            }

            localStorage.setItem(CACHE_KEY, JSON.stringify(cacheObj));
        } catch (error) {
            console.error('Error saving cache:', error);
        }
    }

    // Save a single entry to cache
    async function saveCacheEntry(username, location) {
        locationCache.set(username, location);
        // Debounce saves - only save every 5 seconds
        if (!saveCache.timeout) {
            saveCache.timeout = setTimeout(async () => {
                await saveCache();
                saveCache.timeout = null;
            }, 5000);
        }
    }

    // Process request queue with rate limiting
    async function processRequestQueue() {
        if (isProcessingQueue || requestQueue.length === 0) {
            return;
        }

        // Check if we're rate limited
        if (rateLimitResetTime > 0) {
            const now = Math.floor(Date.now() / 1000);
            if (now < rateLimitResetTime) {
                const waitTime = (rateLimitResetTime - now) * 1000;
                console.log(`Rate limited. Waiting ${Math.ceil(waitTime / 1000 / 60)} minutes...`);
                setTimeout(processRequestQueue, Math.min(waitTime, 60000)); // Check every minute max
                return;
            } else {
                // Rate limit expired, reset
                rateLimitResetTime = 0;
            }
        }

        isProcessingQueue = true;

        while (requestQueue.length > 0 && activeRequests < MAX_CONCURRENT_REQUESTS) {
            const now = Date.now();
            const timeSinceLastRequest = now - lastRequestTime;

            // Wait if needed to respect rate limit
            if (timeSinceLastRequest < MIN_REQUEST_INTERVAL) {
                await new Promise(resolve => setTimeout(resolve, MIN_REQUEST_INTERVAL - timeSinceLastRequest));
            }

            const { screenName, resolve, reject } = requestQueue.shift();
            activeRequests++;
            lastRequestTime = Date.now();

            // Make the request
            try {
                const location = await makeLocationRequest(screenName);
                resolve(location);
            } catch (error) {
                reject(error);
            } finally {
                activeRequests--;
                // Continue processing queue
                setTimeout(processRequestQueue, 200);
            }
        }

        isProcessingQueue = false;
    }

    // Make actual API request using fetch with captured headers
    async function makeLocationRequest(screenName) {
        // Wait for headers to be ready
        if (!headersReady) {
            let waitCount = 0;
            while (!headersReady && waitCount < 30) {
                await new Promise(resolve => setTimeout(resolve, 100));
                waitCount++;
            }
        }

        try {
            const variables = JSON.stringify({ screenName });
            const url = `https://x.com/i/api/graphql/XRqGa7EeokUU5kppkh13EA/AboutAccountQuery?variables=${encodeURIComponent(variables)}`;

            // Use captured headers or minimal defaults
            const headers = xHeaders || {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            };

            // Ensure credentials are included
            const response = await fetch(url, {
                method: 'GET',
                credentials: 'include',
                headers: headers,
                referrer: window.location.href,
                referrerPolicy: 'origin-when-cross-origin'
            });

            let location = null;
            if (response.ok) {
                const data = await response.json();
                console.log(`API response for ${screenName}:`, data);

                // Extract both location and device info from the same API call
                const profile = data?.data?.user_result_by_screen_name?.result?.about_profile;
                location = profile?.account_based_in || null;
                const deviceSource = profile?.source || null;

                console.log(`Extracted location for ${screenName}:`, location);
                console.log(`Extracted device source for ${screenName}:`, deviceSource);

                // Cache device info if found
                if (deviceSource) {
                    const deviceCacheKey = `${screenName}_device`;
                    locationCache.set(deviceCacheKey, deviceSource);
                    saveCacheEntry(deviceCacheKey, deviceSource);
                }

                // Debug: log the full path to see what's available
                if (!location && data?.data?.user_result_by_screen_name?.result) {
                    console.log('User result available but no location:', {
                        hasAboutProfile: !!data.data.user_result_by_screen_name.result.about_profile,
                        aboutProfile: data.data.user_result_by_screen_name.result.about_profile
                    });
                }
            } else {
                const errorText = await response.text().catch(() => '');

                // Handle rate limiting
                if (response.status === 429) {
                    const resetTime = response.headers.get('x-rate-limit-reset');
                    const remaining = response.headers.get('x-rate-limit-remaining');
                    const limit = response.headers.get('x-rate-limit-limit');

                    if (resetTime) {
                        const resetDate = new Date(parseInt(resetTime) * 1000);
                        const now = Date.now();
                        const waitTime = resetDate.getTime() - now;

                        console.log(`Rate limited! Limit: ${limit}, Remaining: ${remaining}`);
                        console.log(`Rate limit resets at: ${resetDate.toLocaleString()}`);
                        console.log(`Waiting ${Math.ceil(waitTime / 1000 / 60)} minutes before retrying...`);

                        // Store rate limit info
                        rateLimitResetTime = parseInt(resetTime);
                    }
                } else {
                    console.log(`X API error for ${screenName}:`, response.status, response.statusText, errorText.substring(0, 200));
                }
            }

            // Only cache if not rate limited
            if (!response || response.status !== 429) {
                saveCacheEntry(screenName, location || null);
            } else {
                console.log(`Not caching null for ${screenName} due to rate limit`);
            }

            return location || null;
        } catch (error) {
            console.error('Error fetching location:', error);
            return null;
        }
    }

    // Function to query X GraphQL API for user location AND device info (with rate limiting)
    async function getUserLocation(screenName) {
        // Check cache first
        if (locationCache.has(screenName)) {
            const cached = locationCache.get(screenName);
            // Don't return cached null - retry if it was null before
            if (cached !== null) {
                console.log(`Using cached location for ${screenName}: ${cached}`);
                return cached;
            } else {
                console.log(`Found null in cache for ${screenName}, will retry API call`);
                locationCache.delete(screenName);
            }
        }

        console.log(`Queueing API request for ${screenName}`);
        // Queue the request
        return new Promise((resolve, reject) => {
            requestQueue.push({ screenName, resolve, reject });
            processRequestQueue();
        });
    }

    // Function to get both location and device info in one call
    async function getUserInfo(screenName) {
        // Check combined cache first
        const infoKey = `${screenName}_info`;
        if (locationCache.has(infoKey)) {
            const cached = locationCache.get(infoKey);
            if (cached) {
                console.log(`Using cached info for ${screenName}:`, cached);
                return cached;
            }
        }

        console.log(`Making API call for ${screenName} info`);
        // Make the API call - this will extract and cache both location and device info
        const location = await getUserLocation(screenName);
        console.log(`Got location for ${screenName}: ${location}`);

        if (!location) {
            console.log(`No location found for ${screenName}`);
            return { location: null, device: null };
        }

        // Get device info that was cached during the location API call
        const deviceKey = `${screenName}_device`;
        let device = locationCache.get(deviceKey) || null;
        console.log(`Got device info for ${screenName}: ${device}`);

        // Fallback: if no device info from API, provide basic platform detection
        if (!device) {
            // Simple user agent based detection for testing
            const ua = navigator.userAgent.toLowerCase();
            if (ua.includes('android')) device = 'Android';
            else if (ua.includes('iphone') || ua.includes('ipad')) device = 'iOS';
            else if (ua.includes('mac')) device = 'macOS';
            else if (ua.includes('windows')) device = 'Windows';
            else device = 'Web';

            console.log(`Using fallback device detection for ${screenName}: ${device}`);
        }

        const info = { location, device };
        // Cache the combined result
        locationCache.set(infoKey, info);
        saveCacheEntry(infoKey, info);

        return info;
    }


    // Function to extract username from various X UI elements
    function extractUsername(element) {
        // Try data-testid="UserName" or "User-Name" first (most reliable)
        const usernameElement = element.querySelector('[data-testid="UserName"], [data-testid="User-Name"]');
        if (usernameElement) {
            const links = usernameElement.querySelectorAll('a[href^="/"]');
            for (const link of links) {
                const href = link.getAttribute('href');
                const match = href.match(/^\/([^\/\?]+)/);
                if (match && match[1]) {
                    const username = match[1];
                    // Filter out common routes
                    const excludedRoutes = ['home', 'explore', 'notifications', 'messages', 'i', 'compose', 'search', 'settings', 'bookmarks', 'lists', 'communities'];
                    if (!excludedRoutes.includes(username) &&
                        !username.startsWith('hashtag') &&
                        !username.startsWith('search') &&
                        username.length > 0 &&
                        username.length < 20) { // Usernames are typically short
                        return username;
                    }
                }
            }
        }

        // Try finding username links in the entire element (broader search)
        const allLinks = element.querySelectorAll('a[href^="/"]');
        const seenUsernames = new Set();

        for (const link of allLinks) {
            const href = link.getAttribute('href');
            if (!href) continue;

            const match = href.match(/^\/([^\/\?]+)/);
            if (!match || !match[1]) continue;

            const potentialUsername = match[1];

            // Skip if we've already checked this username
            if (seenUsernames.has(potentialUsername)) continue;
            seenUsernames.add(potentialUsername);

            // Filter out routes and invalid usernames
            const excludedRoutes = ['home', 'explore', 'notifications', 'messages', 'i', 'compose', 'search', 'settings', 'bookmarks', 'lists', 'communities', 'hashtag'];
            if (excludedRoutes.some(route => potentialUsername === route || potentialUsername.startsWith(route))) {
                continue;
            }

            // Skip status/tweet links
            if (potentialUsername.includes('status') || potentialUsername.match(/^\d+$/)) {
                continue;
            }

            // Check link text/content for username indicators
            const text = link.textContent?.trim() || '';
            const linkText = text.toLowerCase();
            const usernameLower = potentialUsername.toLowerCase();

            // If link text starts with @, it's definitely a username
            if (text.startsWith('@')) {
                return potentialUsername;
            }

            // If link text matches the username (without @), it's likely a username
            if (linkText === usernameLower || linkText === `@${usernameLower}`) {
                return potentialUsername;
            }

            // Check if link is in a UserName container or has username-like structure
            const parent = link.closest('[data-testid="UserName"], [data-testid="User-Name"]');
            if (parent) {
                // If it's in a UserName container and looks like a username, return it
                if (potentialUsername.length > 0 && potentialUsername.length < 20 && !potentialUsername.includes('/')) {
                    return potentialUsername;
                }
            }

            // Also check if link text is @username format
            if (text && text.trim().startsWith('@')) {
                const atUsername = text.trim().substring(1);
                if (atUsername === potentialUsername) {
                    return potentialUsername;
                }
            }
        }

        // Last resort: look for @username pattern in text content and verify with link
        const textContent = element.textContent || '';
        const atMentionMatches = textContent.matchAll(/@([a-zA-Z0-9_]+)/g);
        for (const match of atMentionMatches) {
            const username = match[1];
            // Verify it's actually a link in a User-Name container
            const link = element.querySelector(`a[href="/${username}"], a[href^="/${username}?"]`);
            if (link) {
                // Make sure it's in a username context, not just mentioned in tweet text
                const isInUserNameContainer = link.closest('[data-testid="UserName"], [data-testid="User-Name"]');
                if (isInUserNameContainer) {
                    return username;
                }
            }
        }

        return null;
    }

    // Create loading shimmer placeholder
    function createLoadingShimmer() {
        const shimmer = document.createElement('span');
        shimmer.setAttribute('data-x-flag-shimmer', 'true');
        shimmer.style.display = 'inline-block';
        shimmer.style.width = '20px';
        shimmer.style.height = '16px';
        shimmer.style.marginLeft = '4px';
        shimmer.style.marginRight = '4px';
        shimmer.style.verticalAlign = 'middle';
        shimmer.style.borderRadius = '2px';
        shimmer.style.background = 'linear-gradient(90deg, rgba(113, 118, 123, 0.2) 25%, rgba(113, 118, 123, 0.4) 50%, rgba(113, 118, 123, 0.2) 75%)';
        shimmer.style.backgroundSize = '200% 100%';
        shimmer.style.animation = 'shimmer 1.5s infinite';

        // Add animation keyframes if not already added
        if (!document.getElementById('x-flag-shimmer-style')) {
            const style = document.createElement('style');
            style.id = 'x-flag-shimmer-style';
            style.textContent = `
                @keyframes shimmer {
                    0% {
                        background-position: -200% 0;
                    }
                    100% {
                        background-position: 200% 0;
                    }
                }
            `;
            document.head.appendChild(style);
        }

        return shimmer;
    }

    // Function to add flag and device info to username element
    async function addFlagToUsername(usernameElement, screenName) {
        // Check if flag already added
        if (usernameElement.dataset.flagAdded === 'true') {
            return;
        }

        // Check if this username is already being processed (prevent duplicate API calls)
        if (processingUsernames.has(screenName)) {
            // Wait a bit and check if flag was added by the other process
            await new Promise(resolve => setTimeout(resolve, 500));
            if (usernameElement.dataset.flagAdded === 'true') {
                return;
            }
            // If still not added, mark this container as waiting
            usernameElement.dataset.flagAdded = 'waiting';
            return;
        }

        // Mark as processing to avoid duplicate requests
        usernameElement.dataset.flagAdded = 'processing';
        processingUsernames.add(screenName);

        // Find User-Name container for shimmer placement
        const userNameContainer = usernameElement.querySelector('[data-testid="UserName"], [data-testid="User-Name"]');

        // Create and insert loading shimmer
        const shimmerSpan = createLoadingShimmer();
        let shimmerInserted = false;

        if (userNameContainer) {
            // Try to insert shimmer before handle section (same place flag will go)
            const handleSection = findHandleSection(userNameContainer, screenName);
            if (handleSection && handleSection.parentNode) {
                try {
                    handleSection.parentNode.insertBefore(shimmerSpan, handleSection);
                    shimmerInserted = true;
                } catch (e) {
                    // Fallback: insert at end of container
                    try {
                        userNameContainer.appendChild(shimmerSpan);
                        shimmerInserted = true;
                    } catch (e2) {
                        console.log('Failed to insert shimmer');
                    }
                }
            } else {
                // Fallback: insert at end of container
                try {
                    userNameContainer.appendChild(shimmerSpan);
                    shimmerInserted = true;
                } catch (e) {
                    console.log('Failed to insert shimmer');
                }
            }
        }

        try {
            console.log(`Processing flag for ${screenName}...`);

            // Get both location and device info in one API call
            const userInfo = await getUserInfo(screenName);
            const location = userInfo.location;
            const deviceInfo = userInfo.device;
            console.log(`Location for ${screenName}:`, location);
            console.log(`Device info for ${screenName}:`, deviceInfo);

            // Remove shimmer
            if (shimmerInserted && shimmerSpan.parentNode) {
                shimmerSpan.remove();
            }

            // Create display text
            let displayText = '';

            // Add flag if location found
            if (location) {
                const flag = getCountryFlag(location);
                if (flag) {
                    displayText += ` ${flag}`;
                    console.log(`Found flag ${flag} for ${screenName} (${location})`);
                }
            }

            // Add device info if found
            if (deviceInfo) {
                displayText += ` ${deviceInfo}`;
                console.log(`Found device info ${deviceInfo} for ${screenName}`);
            }

            if (!displayText.trim()) {
                console.log(`No location or device info found for ${screenName}, marking as failed`);
                usernameElement.dataset.flagAdded = 'failed';
                return;
            }

            // Find the username link - try multiple strategies
            // Priority: Find the @username link, not the display name link
            let usernameLink = null;

            // Find the User-Name container (reuse from above if available, otherwise find it)
            const containerForLink = userNameContainer || usernameElement.querySelector('[data-testid="UserName"], [data-testid="User-Name"]');

            // Strategy 1: Find link with @username text content (most reliable - this is the actual handle)
            if (containerForLink) {
                const containerLinks = containerForLink.querySelectorAll('a[href^="/"]');
                for (const link of containerLinks) {
                    const text = link.textContent?.trim();
                    const href = link.getAttribute('href');
                    const match = href.match(/^\/([^\/\?]+)/);

                    // Prioritize links that have @username as text
                    if (match && match[1] === screenName) {
                        if (text === `@${screenName}` || text === screenName) {
                            usernameLink = link;
                            break;
                        }
                    }
                }
            }

            // Strategy 2: Find any link with @username text in UserName container
            if (!usernameLink && containerForLink) {
                const containerLinks = containerForLink.querySelectorAll('a[href^="/"]');
                for (const link of containerLinks) {
                    const text = link.textContent?.trim();
                    if (text === `@${screenName}`) {
                        usernameLink = link;
                        break;
                    }
                }
            }

            // Strategy 3: Find link with exact matching href that has @username text anywhere in element
            if (!usernameLink) {
                const links = usernameElement.querySelectorAll('a[href^="/"]');
                for (const link of links) {
                    const href = link.getAttribute('href');
                    const text = link.textContent?.trim();
                    if ((href === `/${screenName}` || href.startsWith(`/${screenName}?`)) &&
                        (text === `@${screenName}` || text === screenName)) {
                        usernameLink = link;
                        break;
                    }
                }
            }

            // Strategy 4: Fallback to any matching href (but prefer ones not in display name area)
            if (!usernameLink) {
                const links = usernameElement.querySelectorAll('a[href^="/"]');
                for (const link of links) {
                    const href = link.getAttribute('href');
                    const match = href.match(/^\/([^\/\?]+)/);
                    if (match && match[1] === screenName) {
                        // Skip if this looks like a display name link (has verification badge nearby)
                        const hasVerificationBadge = link.closest('[data-testid="User-Name"]')?.querySelector('[data-testid="icon-verified"]');
                        if (!hasVerificationBadge || link.textContent?.trim() === `@${screenName}`) {
                            usernameLink = link;
                            break;
                        }
                    }
                }
            }

            if (!usernameLink) {
                console.error(`Could not find username link for ${screenName}`);
                console.error('Available links in container:', Array.from(usernameElement.querySelectorAll('a[href^="/"]')).map(l => ({
                    href: l.getAttribute('href'),
                    text: l.textContent?.trim()
                })));
                // Remove shimmer on error
                if (shimmerInserted && shimmerSpan.parentNode) {
                    shimmerSpan.remove();
                }
                usernameElement.dataset.flagAdded = 'failed';
                return;
            }

            console.log(`Found username link for ${screenName}:`, usernameLink.href, usernameLink.textContent?.trim());

            // Check if flag already exists (check in the entire container, not just parent)
            const existingFlag = usernameElement.querySelector('[data-x-flag]');
            if (existingFlag) {
                // Remove shimmer if flag already exists
                if (shimmerInserted && shimmerSpan.parentNode) {
                    shimmerSpan.remove();
                }
                usernameElement.dataset.flagAdded = 'true';
                return;
            }

            // Add flag and device info with hover tooltip
            const containerSpan = document.createElement('span');
            containerSpan.setAttribute('data-x-flag', 'true');
            containerSpan.style.marginLeft = '4px';
            containerSpan.style.marginRight = '4px';
            containerSpan.style.display = 'inline';
            containerSpan.style.verticalAlign = 'middle';

            // Add flag emoji
            if (location) {
                const flag = getCountryFlag(location);
                if (flag) {
                    const flagSpan = document.createElement('span');
                    flagSpan.textContent = flag;
                    flagSpan.style.fontFamily = '"Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji", "Android Emoji", "EmojiSymbols", "EmojiOne Mozilla", "Twemoji Mozilla", "Segoe UI", sans-serif';
                    flagSpan.style.fontVariantEmoji = 'unicode';
                    containerSpan.appendChild(flagSpan);
                }
            }

            // Add device info with device emoji
            if (deviceInfo) {
                // Add small space between flag and device emoji
                const spaceSpan = document.createElement('span');
                spaceSpan.textContent = ' ';
                spaceSpan.style.display = 'inline';
                containerSpan.appendChild(spaceSpan);

                // Add device emoji
                const deviceEmoji = getDeviceEmoji(deviceInfo);
                if (deviceEmoji) {
                    const deviceSpan = document.createElement('span');
                    deviceSpan.textContent = deviceEmoji;
                    deviceSpan.style.cursor = 'help';
                    deviceSpan.title = `Connected via: ${deviceInfo}`;
                    deviceSpan.style.opacity = '0.8';
                    deviceSpan.style.fontSize = '14px';
                    deviceSpan.style.verticalAlign = 'middle';
                    deviceSpan.onmouseover = () => {
                        deviceSpan.style.opacity = '1';
                        deviceSpan.style.transform = 'scale(1.1)';
                    };
                    deviceSpan.onmouseout = () => {
                        deviceSpan.style.opacity = '0.8';
                        deviceSpan.style.transform = 'scale(1)';
                    };
                    containerSpan.appendChild(deviceSpan);
                }
            }

            // Use userNameContainer found above, or find it if not found
            const containerForFlag = userNameContainer || usernameElement.querySelector('[data-testid="UserName"], [data-testid="User-Name"]');

            if (!containerForFlag) {
                console.error(`Could not find UserName container for ${screenName}`);
                // Remove shimmer on error
                if (shimmerInserted && shimmerSpan.parentNode) {
                    shimmerSpan.remove();
                }
                usernameElement.dataset.flagAdded = 'failed';
                return;
            }

            // Find the verification badge (SVG with data-testid="icon-verified")
            const verificationBadge = containerForFlag.querySelector('[data-testid="icon-verified"]');

            // Find the handle section - the div that contains the @username link
            // The structure is: User-Name > div (display name) > div (handle section with @username)
            const handleSection = findHandleSection(containerForFlag, screenName);

            let inserted = false;

            // Strategy 1: Insert right before the handle section div (which contains @username)
            // The handle section is a direct child of User-Name container
            if (handleSection && handleSection.parentNode === containerForFlag) {
                try {
                    containerForFlag.insertBefore(containerSpan, handleSection);
                    inserted = true;
                    console.log(`✓ Inserted info before handle section for ${screenName}`);
                } catch (e) {
                    console.log('Failed to insert before handle section:', e);
                }
            }

            // Strategy 2: Find the handle section's parent and insert before it
            if (!inserted && handleSection && handleSection.parentNode) {
                try {
                    // Insert before the handle section's parent (if it's not User-Name)
                    const handleParent = handleSection.parentNode;
                    if (handleParent !== containerForFlag && handleParent.parentNode) {
                        handleParent.parentNode.insertBefore(containerSpan, handleParent);
                        inserted = true;
                        console.log(`✓ Inserted info before handle parent for ${screenName}`);
                    } else if (handleParent === containerForFlag) {
                        // Handle section is direct child, insert before it
                        containerForFlag.insertBefore(containerSpan, handleSection);
                        inserted = true;
                        console.log(`✓ Inserted info before handle section (direct child) for ${screenName}`);
                    }
                } catch (e) {
                    console.log('Failed to insert before handle parent:', e);
                }
            }

            // Strategy 3: Find display name container and insert after it, before handle section
            if (!inserted && handleSection) {
                try {
                    // Find the display name link (first link)
                    const displayNameLink = containerForFlag.querySelector('a[href^="/"]');
                    if (displayNameLink) {
                        // Find the div that contains the display name link
                        const displayNameContainer = displayNameLink.closest('div');
                        if (displayNameContainer && displayNameContainer.parentNode) {
                            // Check if handle section is a sibling
                            if (displayNameContainer.parentNode === handleSection.parentNode) {
                                displayNameContainer.parentNode.insertBefore(containerSpan, handleSection);
                                inserted = true;
                                console.log(`✓ Inserted info between display name and handle (siblings) for ${screenName}`);
                            } else {
                                // Try inserting after display name container
                                displayNameContainer.parentNode.insertBefore(containerSpan, displayNameContainer.nextSibling);
                                inserted = true;
                                console.log(`✓ Inserted info after display name container for ${screenName}`);
                            }
                        }
                    }
                } catch (e) {
                    console.log('Failed to insert after display name:', e);
                }
            }

            // Strategy 4: Insert at the end of User-Name container (fallback)
            if (!inserted) {
                try {
                    containerForFlag.appendChild(containerSpan);
                    inserted = true;
                    console.log(`✓ Inserted info at end of UserName container for ${screenName}`);
                } catch (e) {
                    console.error('Failed to append info to User-Name container:', e);
                }
            }

            if (inserted) {
                // Mark as processed
                usernameElement.dataset.flagAdded = 'true';
                const flagText = location ? getCountryFlag(location) : '';
                const deviceText = deviceInfo ? ` ℹ️(${deviceInfo})` : '';
                console.log(`✓ Successfully added ${flagText}${deviceText} for ${screenName}`);

                // Also mark any other containers waiting for this username
                const waitingContainers = document.querySelectorAll(`[data-flag-added="waiting"]`);
                waitingContainers.forEach(container => {
                    const waitingUsername = extractUsername(container);
                    if (waitingUsername === screenName) {
                        // Try to add flag to this container too
                        addFlagToUsername(container, screenName).catch(() => {});
                    }
                });
            } else {
                console.error(`✗ Failed to insert info for ${screenName} - tried all strategies`);
                console.error('Username link:', usernameLink);
                console.error('Parent structure:', usernameLink.parentNode);
                // Remove shimmer on failure
                if (shimmerInserted && shimmerSpan.parentNode) {
                    shimmerSpan.remove();
                }
                usernameElement.dataset.flagAdded = 'failed';
            }
        } catch (error) {
            console.error(`Error processing info for ${screenName}:`, error);
            // Remove shimmer on error
            if (shimmerInserted && shimmerSpan.parentNode) {
                shimmerSpan.remove();
            }
            usernameElement.dataset.flagAdded = 'failed';
        } finally {
            // Remove from processing set
            processingUsernames.delete(screenName);
        }
    }

    // Function to remove all flags
    function removeAllFlags() {
        const flags = document.querySelectorAll('[data-x-flag]');
        flags.forEach(flag => flag.remove());

        // Also remove any loading shimmers
        const shimmers = document.querySelectorAll('[data-x-flag-shimmer]');
        shimmers.forEach(shimmer => shimmer.remove());

        // Reset flag added markers
        const containers = document.querySelectorAll('[data-flag-added]');
        containers.forEach(container => {
            delete container.dataset.flagAdded;
        });

        console.log('Removed all flags');
    }

    // Function to clear cache
    function clearCache() {
        try {
            locationCache.clear();
            localStorage.removeItem(CACHE_KEY);
            console.log('Cache cleared successfully');
            // Re-process usernames to fetch fresh data
            setTimeout(() => {
                removeAllFlags(); // Remove existing flags
                processUsernames(); // Re-fetch data
            }, 1000);
        } catch (error) {
            console.error('Error clearing cache:', error);
        }
    }

    // Function to get cache info
    function getCacheInfo() {
        const info = {
            size: locationCache.size,
            entries: Array.from(locationCache.entries()).map(([key, value]) => ({
                key,
                type: key.includes('_device') ? 'device' : key.includes('_info') ? 'combined' : 'location',
                value
            }))
        };
        console.log('Cache info:', info);
        return info;
    }

    // Function to process all username elements on the page
    async function processUsernames() {
        console.log('processUsernames called');

        // Check if extension is enabled
        if (!extensionEnabled) {
            console.log('Extension disabled, skipping');
            return;
        }

        // Find all tweet/article containers and user cells
        const containers = document.querySelectorAll('article[data-testid="tweet"], [data-testid="UserCell"], [data-testid="User-Names"], [data-testid="User-Name"]');

        console.log(`Processing ${containers.length} containers for usernames`);
        console.log('Containers found:', containers);

        let foundCount = 0;
        let processedCount = 0;
        let skippedCount = 0;

        for (const container of containers) {
            const screenName = extractUsername(container);
            if (screenName) {
                foundCount++;
                const status = container.dataset.flagAdded;
                if (!status || status === 'failed') {
                    processedCount++;
                    // Process in parallel but limit concurrency
                    addFlagToUsername(container, screenName).catch(err => {
                        console.error(`Error processing ${screenName}:`, err);
                        container.dataset.flagAdded = 'failed';
                    });
                } else {
                    skippedCount++;
                }
            } else {
                // Debug: log containers that don't have usernames
                const hasUserName = container.querySelector('[data-testid="UserName"], [data-testid="User-Name"]');
                if (hasUserName) {
                    console.log('Found UserName container but no username extracted');
                }
            }
        }

        if (foundCount > 0) {
            console.log(`Found ${foundCount} usernames, processing ${processedCount} new ones, skipped ${skippedCount} already processed`);
        } else {
            console.log('No usernames found in containers');
        }
    }

    // Initialize observer for dynamically loaded content
    function initObserver() {
        if (observer) {
            observer.disconnect();
        }

        observer = new MutationObserver((mutations) => {
            // Don't process if extension is disabled
            if (!extensionEnabled) {
                return;
            }

            let shouldProcess = false;
            for (const mutation of mutations) {
                if (mutation.addedNodes.length > 0) {
                    shouldProcess = true;
                    break;
                }
            }

            if (shouldProcess) {
                // Debounce processing
                setTimeout(processUsernames, 500);
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    // Helper function to find handle section
    function findHandleSection(container, screenName) {
        return Array.from(container.querySelectorAll('div')).find(div => {
            const link = div.querySelector(`a[href="/${screenName}"]`);
            if (link) {
                const text = link.textContent?.trim();
                return text === `@${screenName}`;
            }
            return false;
        });
    }

    // Main initialization
    async function init() {
        console.log('X Account Location & Device Info userscript initialized - starting init');

        // Load enabled state first
        await loadEnabledState();

        // Load persistent cache
        await loadCache();

        // Only proceed if extension is enabled
        if (!extensionEnabled) {
            console.log('Userscript is disabled');
            return;
        }

        // Wait a bit for page to fully load, then process
        setTimeout(() => {
            processUsernames();
        }, 2000);

        // Also try again after 5 and 10 seconds in case React hasn't loaded yet
        setTimeout(() => {
            processUsernames();
        }, 5000);

        setTimeout(() => {
            processUsernames();
        }, 10000);

        // Set up observer for new content
        initObserver();

        // Re-process on navigation (X uses SPA)
        let lastUrl = location.href;
        new MutationObserver(() => {
            const url = location.href;
            if (url !== lastUrl) {
                lastUrl = url;
                console.log('Page navigation detected, reprocessing usernames');
                setTimeout(processUsernames, 2000);
            }
        }).observe(document, { subtree: true, childList: true });

        // Save cache periodically
        setInterval(saveCache, 30000); // Save every 30 seconds
    }

    // Update global functions with real implementations
    unsafeWindow.XFlagScript.clearCache = clearCache;
    unsafeWindow.XFlagScript.getCacheInfo = getCacheInfo;
    unsafeWindow.XFlagScript.removeAllFlags = removeAllFlags;
    unsafeWindow.XFlagScript.processUsernames = processUsernames;

    // Also update window if available
    if (typeof window !== 'undefined') {
        window.XFlagScript = unsafeWindow.XFlagScript;
    }

    console.log('X Flag Script commands available:');
    console.log('- XFlagScript.clearCache() - Clear all cached data');
    console.log('- XFlagScript.getCacheInfo() - Show cache statistics');
    console.log('- XFlagScript.removeAllFlags() - Remove all displayed flags');
    console.log('- XFlagScript.processUsernames() - Re-process all usernames');

    // Test that functions are available
    setTimeout(() => {
        if (typeof window.XFlagScript !== 'undefined') {
            console.log('✓ XFlagScript functions loaded successfully');
        } else {
            console.error('✗ XFlagScript functions not available');
        }
    }, 1000);

    // Wait for page to load
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();