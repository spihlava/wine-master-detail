import { z } from 'zod';

/* -------------------------------------------------------------------------- */
/*                                BOTTLE TYPES                                */
/* -------------------------------------------------------------------------- */

export const bottleStatusEnum = z.enum([
    'cellar', 'consumed', 'gifted', 'sold', 'damaged'
]);

export type BottleStatus = z.infer<typeof bottleStatusEnum>;

export const bottleSchema = z.object({
    id: z.string().uuid(),
    wine_id: z.string().uuid(),
    size: z.string().default('750ml'),
    barcode: z.string().nullable(),
    // Current state (cached from events)
    current_status: bottleStatusEnum,
    current_location: z.string().nullable(),
    current_bin: z.string().nullable(),
    current_value: z.number().nullable(),
    // Purchase cache (denormalized)
    purchase_price: z.number().nullable(),
    purchase_location: z.string().nullable(),
    purchase_date: z.coerce.date().nullable(),
    // Consumption cache
    consumed_date: z.coerce.date().nullable(),
    created_at: z.coerce.date(),
    updated_at: z.coerce.date(),
});

export type Bottle = z.infer<typeof bottleSchema>;

export const bottleInsertSchema = bottleSchema.omit({
    id: true,
    created_at: true,
    updated_at: true,
});
export type BottleInsert = z.infer<typeof bottleInsertSchema>;

export const bottleUpdateSchema = bottleInsertSchema.partial().omit({
    wine_id: true,
});
export type BottleUpdate = z.infer<typeof bottleUpdateSchema>;


/* -------------------------------------------------------------------------- */
/*                                EVENT TYPES                                 */
/* -------------------------------------------------------------------------- */

// --- Transactions ---

export const transactionTypeEnum = z.enum([
    'purchase', 'sale', 'gift_received', 'gift_given', 'valuation'
]);

export type TransactionType = z.infer<typeof transactionTypeEnum>;

export const bottleTransactionSchema = z.object({
    id: z.string().uuid(),
    bottle_id: z.string().uuid(),
    transaction_type: transactionTypeEnum,
    transaction_date: z.coerce.date(),
    price: z.number().nullable(),
    counterparty: z.string().nullable(),
    notes: z.string().nullable(),
    created_at: z.coerce.date(),
});

export type BottleTransaction = z.infer<typeof bottleTransactionSchema>;

export const transactionInsertSchema = bottleTransactionSchema.omit({
    id: true,
    created_at: true,
});
export type TransactionInsert = z.infer<typeof transactionInsertSchema>;

// --- Movements ---

export const bottleMovementSchema = z.object({
    id: z.string().uuid(),
    bottle_id: z.string().uuid(),
    from_location: z.string().nullable(),
    to_location: z.string(),
    from_bin: z.string().nullable(),
    to_bin: z.string().nullable(),
    moved_at: z.coerce.date(),
    reason: z.string().nullable(),
    notes: z.string().nullable(),
    created_at: z.coerce.date(),
});

export type BottleMovement = z.infer<typeof bottleMovementSchema>;

export const movementInsertSchema = bottleMovementSchema.omit({
    id: true,
    created_at: true,
});
export type MovementInsert = z.infer<typeof movementInsertSchema>;

// --- Tastings ---

export const tastingStageEnum = z.enum(['sample', 'consumed']);

export type TastingStage = z.infer<typeof tastingStageEnum>;

export const bottleTastingSchema = z.object({
    id: z.string().uuid(),
    bottle_id: z.string().uuid(),
    tasted_at: z.coerce.date(),
    rating: z.number().int().min(0).max(100).nullable(),
    notes: z.string().nullable(),
    food_pairing: z.string().nullable(),
    occasion: z.string().nullable(),
    tasting_stage: tastingStageEnum,
    created_at: z.coerce.date(),
});

export type BottleTasting = z.infer<typeof bottleTastingSchema>;

export const tastingInsertSchema = bottleTastingSchema.omit({
    id: true,
    created_at: true,
});
export type TastingInsert = z.infer<typeof tastingInsertSchema>;


/* -------------------------------------------------------------------------- */
/*                              COMPUTED TYPES                                */
/* -------------------------------------------------------------------------- */

// Bottle with full history
export interface BottleWithHistory extends Bottle {
    transactions: BottleTransaction[];
    movements: BottleMovement[];
    tastings: BottleTasting[];
}

// Timeline event (unified view of all events)
export interface BottleTimelineEvent {
    id: string;
    bottle_id: string;
    event_type: 'transaction' | 'movement' | 'tasting';
    event_date: Date;
    summary: string;
    details: BottleTransaction | BottleMovement | BottleTasting;
}
