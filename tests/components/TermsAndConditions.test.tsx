import { test, expect, describe } from 'vitest';
import TermsAndConditions from '../../src/components/TermsAndConditions';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

describe('TermsAndConditions', () => {
	// #region Render
	const renderComponent = () => {
		render(<TermsAndConditions />);
		return {
			heading: screen.getByRole('heading'),
			checkbox: screen.getByRole('checkbox'),
			button: screen.getByRole('button'),
		};
	};
	// #endregion

	// #region Initial Render
	describe('initial render', () => {
		test('should render with correct heading', () => {
			const { heading } = renderComponent();

			expect(heading).toBeInTheDocument();
			expect(heading).toHaveTextContent('Terms & Conditions');
		});

		test('should render an unchecked checkbox upon the initial render', () => {
			const { checkbox } = renderComponent();

			expect(checkbox).toBeInTheDocument();
			expect(checkbox).not.toBeChecked();
		});

		test('should render disabled submit button when checkbox is not checked', () => {
			const { button } = renderComponent();

			expect(button).toBeInTheDocument();
			expect(button).toHaveTextContent(/submit/i);
			expect(button).toBeDisabled();
		});
	});
	// #endregion

	// #region User Interactions
	describe('User Interactions', () => {
		test('should enable the button when the checkbox is checked', async () => {
			const { checkbox, button } = renderComponent();

			const user = userEvent.setup();

			await user.click(checkbox);

			expect(button).toBeEnabled();
		});
	});
	// #endregion
});
