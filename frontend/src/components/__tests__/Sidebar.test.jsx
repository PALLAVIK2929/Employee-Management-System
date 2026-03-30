import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import Sidebar from '../Sidebar';

// Mock matchMedia for dark mode logic
Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: vi.fn().mockImplementation(query => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: vi.fn(), // Deprecated
        removeListener: vi.fn(), // Deprecated
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
    })),
});

describe('Sidebar Component', () => {
    it('renders all navigation links', () => {
        render(
            <MemoryRouter>
                <Sidebar />
            </MemoryRouter>
        );

        expect(screen.getByText('Dashboard')).toBeInTheDocument();
        expect(screen.getByText('Employees')).toBeInTheDocument();
        expect(screen.getByText('Departments')).toBeInTheDocument();
        expect(screen.getByText('Onboarding Agent')).toBeInTheDocument();
        expect(screen.getByText('Handbook Chat')).toBeInTheDocument();
    });

    it('toggles the settings popover when clicking the profile button', () => {
        render(
            <MemoryRouter>
                <Sidebar />
            </MemoryRouter>
        );

        const profileButton = screen.getByRole('button', { name: /Admin User/i });

        // Popover should not be visible initially
        expect(screen.queryByText('My Profile')).not.toBeInTheDocument();

        // Click to open
        fireEvent.click(profileButton);
        expect(screen.getByText('My Profile')).toBeInTheDocument();
        expect(screen.getByText('Notifications')).toBeInTheDocument();

        // Click to close
        fireEvent.click(profileButton);
        expect(screen.queryByText('My Profile')).not.toBeInTheDocument();
    });

    it('displays the correct user information', () => {
        render(
            <MemoryRouter>
                <Sidebar />
            </MemoryRouter>
        );

        expect(screen.getByText('Admin User')).toBeInTheDocument();
        expect(screen.getByText('admin@company.com')).toBeInTheDocument();
    });
});
