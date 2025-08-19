import { render, screen } from '@testing-library/react';
import { test, expect, describe } from 'vitest';
import ToastDemo from '../../src/components/ToastDemo';
import userEvent from '@testing-library/user-event';
import { Toaster } from 'react-hot-toast';

describe('ToastDemo', () => {
	// #region Render
	const renderComponents = () => {
		render(
			<>
				<ToastDemo />
				<Toaster />
			</>
		);
		return {
			button: screen.getByRole('button'),
			user: userEvent.setup(),
		};
	};
	// #endregion

	test('should render the button', () => {
		const { button } = renderComponents();
		expect(button).toBeInTheDocument();
		expect(button).toHaveTextContent(/show/i);
	});

	test('should render success after clicking ', async () => {
		const { button, user } = renderComponents();
		screen.debug(button);

		await user.click(button);

		const toast = await screen.findByText(/success/i);

		expect(toast).toBeInTheDocument();
	});
});
