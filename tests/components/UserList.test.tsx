import { render, screen } from '@testing-library/react';
import { test, expect, describe } from 'vitest';
import UserList from '../../src/components/UserList';
import { User } from '../../src/entities';

describe('UserList', () => {
	test('should render no users when the users array is empty', () => {
		render(<UserList users={[]} />);

		const text = screen.getByText(/no users/i);
		expect(text).toBeInTheDocument();
	});

	test('should render a list of users', () => {
		const users: User[] = [
			{ id: 1, name: 'Holly', isAdmin: true },
			{ id: 2, name: 'Mosh', isAdmin: false },
		];

		render(<UserList users={users} />);

		users.forEach((user) => {
			const link = screen.getByRole('link', { name: user.name });
			expect(link).toBeInTheDocument();
			expect(link).toHaveAttribute('href', `/users/${user.id}`);
		});
	});
});
