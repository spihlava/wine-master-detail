
import { describe, it, expect } from 'vitest';
import { wineSchema, wineInsertSchema } from '../wine';

describe('Wine Zod Schemas', () => {
    describe('wineSchema', () => {
        it('should validate a valid wine object', () => {
            const validWine = {
                id: '123e4567-e89b-12d3-a456-426614174000',
                name: 'Test Wine',
                created_at: new Date(),
                updated_at: new Date(),
            };
            const result = wineSchema.safeParse(validWine);
            expect(result.success).toBe(true);
        });

        it('should fail if required fields are missing', () => {
            const invalidWine = {
                // Missing id, name, timestamps
                producer: 'Some Producer'
            };
            const result = wineSchema.safeParse(invalidWine);
            expect(result.success).toBe(false);
        });

        it('should allow optional fields to be null or undefined (nullish)', () => {
            const minimalWine = {
                id: '123e4567-e89b-12d3-a456-426614174000',
                name: 'Minimal Wine',
                created_at: new Date(),
                updated_at: new Date(),
            };
            const result = wineSchema.safeParse(minimalWine);
            expect(result.success).toBe(true);
        });
    });

    describe('wineInsertSchema', () => {
        it('should validate a valid insert object', () => {
            const validInsert = {
                name: 'New Wine',
                producer: 'New Producer',
                vintage: 2023,
                type: 'Red'
            };
            const result = wineInsertSchema.safeParse(validInsert);
            expect(result.success).toBe(true);
        });

        it('should rely on nullish for optional fields during insert', () => {
            const minimalInsert = {
                name: 'Just Name'
            };
            const result = wineInsertSchema.safeParse(minimalInsert);
            expect(result.success).toBe(true);
        });

        it('should validate enums', () => {
            const invalidEnum = {
                name: 'Bad Type',
                type: 'Blue' // Invalid type
            };
            const result = wineInsertSchema.safeParse(invalidEnum);
            expect(result.success).toBe(false);
        });

        it('should validate numeric constraints', () => {
            const invalidVintage = {
                name: 'Future Wine',
                vintage: 3000 // Out of range
            };
            const result = wineInsertSchema.safeParse(invalidVintage);
            expect(result.success).toBe(false);
        });
    });
});
