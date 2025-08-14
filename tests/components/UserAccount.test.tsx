import { render, screen } from '@testing-library/react';

import { test, expect, describe } from 'vitest';
import UserAccount from '../../src/components/UserAccount';
import { User } from '../../src/entities';

describe('UserAccount', () => {
	const user: User = {
		id: 1,
		name: 'Holly',
		isAdmin: false,
	};

	test("should render the user's name", async () => {
		render(<UserAccount user={user} />);

		const username = screen.getByText(user.name);

		expect(username).toBeTruthy();
	});

	test('should render edit button if user is admin', () => {
		render(<UserAccount user={{ ...user, isAdmin: true }} />);

		screen.debug();

		const button = screen.getByRole('button');

		expect(button).toBeInTheDocument();
		expect(button).toHaveTextContent(/edit/i);
	});

	test('should not render edit button when user is not  admin', () => {
		render(<UserAccount user={user} />);
		screen.debug();

		const button = screen.queryByRole('button');

		expect(button).not.toBeInTheDocument();
	});
});
