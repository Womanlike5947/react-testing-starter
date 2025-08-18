import { test, expect, describe } from 'vitest';
import ExpandableText from '../../src/components/ExpandableText';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

describe('ExpandableText', () => {
	const limit = 255;
	const shortText = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.';
	const longText = 'repeat'.repeat(limit);

	test('should render the full text if less than 255 characters', async () => {
		render(<ExpandableText text={shortText} />);

		expect(screen.getByText(shortText)).toBeInTheDocument();
	});

	test('should render short text on initial render', async () => {
		render(<ExpandableText text={longText} />);

		const truncatedText = `${longText.substring(0, limit)}...`;
		const button = screen.getByRole('button', { name: /more/i });

		expect(screen.getByText(truncatedText)).toBeInTheDocument();
		expect(button).toBeInTheDocument();
	});

	test("should render full text after clicking 'Show More' Button", async () => {
		render(<ExpandableText text={longText} />);
		const expandButton = screen.getByRole('button', { name: /more/i });

		const user = userEvent.setup();
		await user.click(expandButton);

		expect(screen.getByText(longText)).toBeInTheDocument();

		const shrinkButton = screen.getByRole('button', { name: /less/i });
		expect(shrinkButton).toBeInTheDocument();
	});

	test("should collapse text when 'Show Less' button is clicked", async () => {
		render(<ExpandableText text={longText} />);
		const expandButton = screen.getByRole('button', { name: /more/i });

		const truncatedText = `${longText.substring(0, limit)}...`;

		const user = userEvent.setup();
		await user.click(expandButton);

		// expect(screen.getByText(longText)).toBeInTheDocument();

		const shrinkButton = screen.getByRole('button', { name: /less/i });

		await user.click(shrinkButton);

		expect(expandButton).toBeInTheDocument();
		expect(screen.getByText(truncatedText)).toBeInTheDocument();
	});
});
