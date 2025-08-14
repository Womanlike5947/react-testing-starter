import { render, screen } from '@testing-library/react';
import Greet from '../../src/components/Greet';

describe('Greet', () => {
	test('should render Hello with the name when name is provided', () => {
		render(<Greet name="Holly" />);

		const heading = screen.getByRole('heading');

		expect(heading).toBeInTheDocument();
		expect(heading).toHaveTextContent(/hello holly/i);
	});

	test('should render login button when name is not provided', () => {
		render(<Greet />);

		const loginButton = screen.getByRole('button');

		expect(loginButton).toBeInTheDocument();
		expect(loginButton).toHaveTextContent(/login/i);
	});
});
