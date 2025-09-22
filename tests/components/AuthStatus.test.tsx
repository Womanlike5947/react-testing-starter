import { render, screen } from '@testing-library/react';
import { describe, test } from 'vitest';
import AuthStatus from '../../src/components/AuthStatus';
import { mockAuthState } from '../utils';

describe('AuthStatus', () => {
	test('should render loading when loading', () => {
		mockAuthState({
			isLoading: true,
			isAuthenticated: false,
			user: undefined,
		});
		render(<AuthStatus />);

		expect(screen.getByText(/loading/i)).toBeInTheDocument();
	});

	test('should render John when user is authorised', () => {
		mockAuthState({
			isLoading: false,
			isAuthenticated: true,
			user: { name: 'John' },
		});
		render(<AuthStatus />);

		expect(screen.getByText(/john/i)).toBeInTheDocument();
		expect(screen.getByRole('button', { name: /log out/i })).toBeInTheDocument();
		expect(
			screen.queryByRole('button', { name: /log in/i })
		).not.toBeInTheDocument();
	});

	test('should render login button when user is unauthorised', () => {
		mockAuthState({
			isLoading: false,
			isAuthenticated: false,
			user: undefined,
		});
		render(<AuthStatus />);

		expect(screen.getByRole('button', { name: /log in/i })).toBeInTheDocument();
		expect(
			screen.queryByRole('button', { name: /log out/i })
		).not.toBeInTheDocument();
	});
});
