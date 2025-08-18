import { render, screen } from '@testing-library/react';
import { test, describe, vi } from 'vitest';
import SearchBox from '../../src/components/SearchBox';
import userEvent from '@testing-library/user-event';

describe('SearchBox', () => {
	const renderSearchBox = () => {
		const onChange = vi.fn();
		render(<SearchBox onChange={onChange} />);
		return {
			input: screen.getByPlaceholderText(/search/i),
			user: userEvent.setup(),
			onChange,
		};
	};

	test('should render an input field for searching', async () => {
		const { input } = renderSearchBox();
		expect(input).toBeInTheDocument();
	});

	test('should call onChange when Enter is pressed', async () => {
		const { input, onChange } = renderSearchBox();
		const user = userEvent.setup();
		const searchTerm = 'Search';

		await user.type(input, `${searchTerm}{enter}`);

		expect(onChange).toHaveBeenCalledWith(searchTerm);
	});

	test('should not call onChange if field is empty when Enter is pressed', async () => {
		const { input, user, onChange } = renderSearchBox();

		await user.type(input, '{enter}');

		expect(onChange).not.toHaveBeenCalled();
	});
});
