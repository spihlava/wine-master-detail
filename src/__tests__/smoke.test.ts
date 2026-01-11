
import { describe, it, expect } from 'vitest';

describe('Smoke Test', () => {
    it('should pass', () => {
        expect(true).toBe(true);
    });

    it('should be able to import from src', async () => {
        // Dynamic import to avoid breaking if file doesn't exist, though we know it does
        const { cn } = await import('@/lib/utils/cn');
        expect(cn('a', 'b')).toBe('a b');
    });
});
