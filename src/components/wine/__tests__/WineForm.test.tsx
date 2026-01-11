import { render, screen, fireEvent } from '@testing-library/react';
import { useRouter } from 'next/navigation';
import { describe, it, expect, vi, beforeEach, type Mock } from 'vitest';
import { ToastProvider } from '@/components/ui/Toast';
import { WineForm } from '../WineForm';

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

// Wrapper with required providers
function TestWrapper({ children }: { children: React.ReactNode }) {
    return <ToastProvider>{children}</ToastProvider>;
}

describe('WineForm', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        (useRouter as Mock).mockReturnValue({
            push: mockPush,
            back: vi.fn(),
        });
    });

    it('renders correctly for new wine', () => {
        render(<WineForm />, { wrapper: TestWrapper });
        expect(screen.getByText('Add New Wine')).toBeDefined();
        expect(screen.getByLabelText(/Wine Name/)).toBeDefined();
    });

    it('validates required fields', async () => {
        render(<WineForm />, { wrapper: TestWrapper });
        const submitBtn = screen.getByText('Add Wine');
        fireEvent.click(submitBtn);

        // Should show error or not call mutation
        expect(mockMutateAsyncCreate).not.toHaveBeenCalled();
    });

    it('submits valid data', async () => {
        render(<WineForm />, { wrapper: TestWrapper });

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
