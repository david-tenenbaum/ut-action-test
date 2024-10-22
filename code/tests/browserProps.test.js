import { describe, it, expect, vi } from 'vitest';
import { browserProps } from '../browserProps';
import { isBot } from '../isValidUngovernedEvent';
import UAParser from 'ua-parser-js';

vi.mock('../isValidUngovernedEvent');
vi.mock('ua-parser-js');

describe('browserProps', () => {
    it('should return empty object if event is from a bot', () => {
        isBot.mockReturnValue(true);
        const event = { original_user_agent: 'Mozilla/5.0' };
        const result = browserProps(event);
        
        expect(result).toEqual({});
    });

    it('should return empty object if user agent is not available', () => {
        isBot.mockReturnValue(false);
        const event = {};
        const result = browserProps(event);
        expect(result).toEqual({});
    });

    it('should return browser properties if user agent is available and not a bot', () => {
        isBot.mockReturnValue(false);
        const event = { original_user_agent: 'Mozilla/5.0' };
        const parserResult = {
            browser: { name: 'Chrome', version: '89.0.4389.82' },
            device: { type: 'desktop' },
            os: { name: 'Windows' },
            language: 'en-US'
        };
        UAParser.mockImplementation(() => ({
            setUA: vi.fn(),
            getResult: () => parserResult
        }));

        const result = browserProps(event);
        expect(result).toEqual({
            browser_name: 'Chrome',
            browser_version: '89',
            browser: 'Chrome 89',
            browser_full_version: '89.0.4389.82',
            device_name: 'desktop',
            platform_name: 'Windows',
            user_agent: 'Mozilla/5.0',
            language: 'en-US',
            client: 'WEB'
        });
    });

    it('should prioritize event data over parsed results', () => {
        isBot.mockReturnValue(false);
        const event = {
            original_user_agent: 'Mozilla/5.0',
            browser_name: 'Firefox',
            browser_version: '85',
            browser_full_version: '85.0',
            device_name: 'Laptop',
            platform_name: 'Linux',
            language: 'fr-FR'
        };
        const parserResult = {
            browser: { name: 'Chrome', version: '89.0.4389.82' },
            device: { type: 'desktop' },
            os: { name: 'Linux' },
            language: 'en-US'
        };
        UAParser.mockImplementation(() => ({
            setUA: vi.fn(),
            getResult: () => parserResult
        }));

        const result = browserProps(event);
        expect(result).toEqual({
            browser_name: 'Firefox',
            browser_version: '85',
            browser: 'Firefox 85',
            browser_full_version: '85.0',
            device_name: 'Laptop',
            platform_name: 'Linux',
            user_agent: 'Mozilla/5.0',
            language: 'fr-FR',
            client: 'WEB'
        });
    });
});