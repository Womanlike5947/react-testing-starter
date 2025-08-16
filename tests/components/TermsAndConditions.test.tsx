import { test, expect, describe } from 'vitest';
import TermsAndConditions from '../../src/components/TermsAndConditions';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

describe('TermsAndConditions', () => {
	// #region render
	beforeEach(() => {
		render(<TermsAndConditions />);
	});
	// #endregion

	// #region Initial Render
	describe('initial render', () => {
		test('should render with correct heading', () => {
			const header = screen.getByRole('heading', { name: 'Terms & Conditions' });
			expect(header).toBeInTheDocument();
		});

		test('should render an unchecked checkbox upon the initial render', () => {
			const checkbox = screen.getByRole('checkbox');

			expect(checkbox).toBeInTheDocument();
			expect(checkbox).not.toBeChecked();
		});

		test('should render disabled submit button when checkbox is not checked', () => {
			const button = screen.getByRole('button');

			expect(button).toBeInTheDocument();
			expect(button).toHaveTextContent(/submit/i);
			expect(button).toBeDisabled();
		});
	});
	// #endregion

	// #region User Interactions
	describe('User Interactions', () => {
		test('should enable the button when the checkbox is checked', async () => {
			const checkbox = screen.getByRole('checkbox');
			const user = userEvent.setup();

			await user.click(checkbox);

			expect(screen.getByRole('button')).toBeEnabled();
		});
	});
	// #endregion
});
