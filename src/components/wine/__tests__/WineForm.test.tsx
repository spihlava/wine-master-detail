
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { WineForm } from '../WineForm';
import { useRouter } from 'next/navigation';

// Mock next/navigation
vi.mock('next/navigation', () => ({
    useRouter: vi.fn(),
}));

// Mock hooks
const mockPush = vi.fn();
const mockMutateAsyncCreate = vi.fn();
const mockMutateAsyncUpdate = vi.fn();

vi.mock('@/lib/hooks/use-wines', () => ({
    useCreateWine: () => ({
        mutateAsync: mockMutateAsyncCreate,
        isPending: false,
    }),
    useUpdateWine: () => ({
        mutateAsync: mockMutateAsyncUpdate,
        isPending: false,
    }),
}));

describe('WineForm', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        (useRouter as any).mockReturnValue({
            push: mockPush,
            back: vi.fn(),
        });
    });

    it('renders correctly for new wine', () => {
        render(<WineForm />);
        expect(screen.getByText('Add New Wine')).toBeDefined();
        expect(screen.getByLabelText(/Wine Name/)).toBeDefined();
    });

    it('validates required fields', async () => {
        render(<WineForm />);
        const submitBtn = screen.getByText('Add Wine');
        fireEvent.click(submitBtn);

        // Should show error or not call mutation
        expect(mockMutateAsyncCreate).not.toHaveBeenCalled();
    });

    it('submits valid data', async () => {
        render(<WineForm />);

        fireEvent.change(screen.getByLabelText(/Wine Name/), { target: { value: 'Test Wine' } });
        fireEvent.change(screen.getByLabelText(/Vintage/), { target: { value: '2020' } });

        const submitBtn = screen.getByText('Add Wine');
        fireEvent.click(submitBtn);

        // Wait for async actions if needed, but here it's mocked
        expect(mockMutateAsyncCreate).toHaveBeenCalledWith(expect.objectContaining({
            name: 'Test Wine',
            vintage: 2020
        }));
    });
});
