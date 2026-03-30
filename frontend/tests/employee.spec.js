import { test, expect } from '@playwright/test';

test.describe('Employee Management', () => {
    const duplicateEmail = 'kpallavi@gmail.com';

    test.beforeEach(async ({ page }) => {
        await page.goto('/login');
        await page.getByPlaceholder('admin@company.com').fill('admin@company.com');
        await page.getByPlaceholder('••••••••').fill('admin123');
        await page.getByRole('button', { name: 'Sign In' }).click();
        await page.waitForURL('/');
        await page.goto('/employees');
    });

    test('should display error when adding employee with duplicate email', async ({ page }) => {
        // Open Add Employee Modal
        await page.getByRole('button', { name: '+ Add Employee' }).click();

        // Fill Form with known duplicate email
        await page.getByLabel('First Name').fill('Test');
        await page.getByLabel('Last Name').fill('Duplicate');
        await page.getByLabel('Email').fill(duplicateEmail);
        await page.getByLabel('Department').selectOption({ index: 1 }); // Select first available department
        await page.getByLabel('Role').fill('Tester');

        // Submit
        page.on('dialog', dialog => {
            expect(dialog.message()).toContain('An employee with this email already exists');
            dialog.dismiss();
        });

        // Note: The app uses window.alert for errors currently, so we listen for dialog
        // If it uses a custom modal/toast, we would check for that element.
        await page.getByRole('button', { name: 'Save Changes' }).click();
    });

    test('should successfully add a new employee', async ({ page }) => {
        const uniqueEmail = `test.user.${Date.now()}@example.com`;

        // Open Add Employee Modal
        await page.getByRole('button', { name: '+ Add Employee' }).click();

        // Fill Form
        await page.getByLabel('First Name').fill('New');
        await page.getByLabel('Last Name').fill('User');
        await page.getByLabel('Email').fill(uniqueEmail);
        await page.getByLabel('Department').selectOption({ index: 1 });
        await page.getByLabel('Role').fill('Developer');

        // Submit
        await page.getByRole('button', { name: 'Save Changes' }).click();

        // Verify Modal Closes (or checking for success message if implemented)
        await expect(page.getByRole('dialog')).not.toBeVisible();

        // Refresh to verify data persistence
        await page.reload();
        await expect(page.getByText(uniqueEmail)).toBeVisible();
    });
});
