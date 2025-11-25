const { JSDOM } = require('jsdom');
const { expect } = require('chai');

// Function to be tested - copied from the user script
function extractUsername(element) {
    // 1. Try to find the username link (Timeline/Feed)
    const link = element.querySelector('a[href^="/"]');
    if (link) {
        const href = link.getAttribute('href');
        const match = href.match(/^\/([a-zA-Z0-9_]+)/); // Using the new regex
        if (match) {
            const username = match[1];
            const invalid = ['home', 'explore', 'notifications', 'messages', 'search', 'settings'];
            if (!invalid.includes(username)) {
                return username;
            } else {
                return null; // Explicitly return null if invalid
            }
        }
    }

    // 2. Profile Header Case (Username is text, not a link)
    // Look for text starting with @
    const textNodes = Array.from(element.querySelectorAll('span, div[dir="ltr"]'));
    for (const node of textNodes) {
        const text = node.textContent.trim();
        if (text.startsWith('@') && text.length > 1) {
            const username = text.substring(1);
            // Basic validation to ensure it's a username and not just random text
            if (/^[a-zA-Z0-9_]+$/.test(username)) {
                return username;
            }
        }
    }

    return null;
}

describe('extractUsername', () => {
    it('should extract username from a simple profile link', () => {
        const dom = new JSDOM(`
            <div data-testid="UserName">
                <a href="/testuser">
                    <span>@testuser</span>
                </a>
            </div>
        `);
        const element = dom.window.document.querySelector('[data-testid="UserName"]');
        const username = extractUsername(element);
        expect(username).to.equal('testuser');
    });

    it('should extract username from a profile link with a tab', () => {
        const dom = new JSDOM(`
            <div data-testid="UserName">
                <a href="/testuser/likes">
                    <span>@testuser</span>
                </a>
            </div>
        `);
        const element = dom.window.document.querySelector('[data-testid="UserName"]');
        const username = extractUsername(element);
        expect(username).to.equal('testuser');
    });

    it('should return null for invalid usernames', () => {
        const dom = new JSDOM(`
            <div data-testid="UserName">
                <a href="/home">
                    <span>@home</span>
                </a>
            </div>
        `);
        const element = dom.window.document.querySelector('[data-testid="UserName"]');
        const username = extractUsername(element);
        expect(username).to.be.null;
    });

    it('should extract username from a profile header', () => {
        const dom = new JSDOM(`
            <div data-testid="User-Name">
                <div dir="ltr">
                    <span>@testuser2</span>
                </div>
            </div>
        `);
        const element = dom.window.document.querySelector('[data-testid="User-Name"]');
        const username = extractUsername(element);
        expect(username).to.equal('testuser2');
    });
});
