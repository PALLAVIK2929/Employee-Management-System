import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import Dashboard from '../Dashboard';
import { api } from '../../api';

// Mock the API
vi.mock('../../api', () => ({
    api: {
        getEmployees: vi.fn(),
        getDepartments: vi.fn(),
    },
}));

// Mock Recharts to avoid issues with JSDOM
vi.mock('recharts', () => ({
    ResponsiveContainer: ({ children }) => <div>{children}</div>,
    BarChart: ({ children }) => <div>{children}</div>,
    Bar: () => <div>Bar</div>,
    XAxis: () => <div>XAxis</div>,
    YAxis: () => <div>YAxis</div>,
    CartesianGrid: () => <div>CartesianGrid</div>,
    Tooltip: () => <div>Tooltip</div>,
}));

const mockEmployees = [
    { id: 1, first_name: 'John', last_name: 'Doe', role: 'Developer', department_id: 1 },
    { id: 2, first_name: 'Jane', last_name: 'Smith', role: 'Manager', department_id: 2 },
];

const mockDepartments = [
    { id: 1, name: 'Engineering' },
    { id: 2, name: 'HR' },
];

describe('Dashboard Component', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        api.getEmployees.mockResolvedValue(mockEmployees);
        api.getDepartments.mockResolvedValue(mockDepartments);
    });

    it('renders the dashboard title and subtitle', async () => {
        render(<Dashboard />);
        await waitFor(() => {
            expect(screen.getByText('Dashboard')).toBeInTheDocument();
            expect(screen.getByText(/Overview of company metrics/i)).toBeInTheDocument();
        });
    });

    it('displays the correct statistics from API data', async () => {
        render(<Dashboard />);

        await waitFor(() => {
            expect(screen.getByText('Total Employees')).toBeInTheDocument();
            expect(screen.getAllByText('2')[0]).toBeInTheDocument(); // Total Employees count
            expect(screen.getByText('Departments')).toBeInTheDocument();
            expect(screen.getAllByText('2')[1]).toBeInTheDocument(); // Departments count
        });
    });

    it('renders the recent activity list with employee names', async () => {
        render(<Dashboard />);

        await waitFor(() => {
            expect(screen.getByText('Recent Activity')).toBeInTheDocument();
            expect(screen.getByText('John Doe')).toBeInTheDocument();
            expect(screen.getByText('Jane Smith')).toBeInTheDocument();
            expect(screen.getByText('Joined as Developer')).toBeInTheDocument();
        });
    });
});
