import { test, expect, describe } from 'vitest';
import ProductImageGallery from '../../src/components/ProductImageGallery';
import { render, screen } from '@testing-library/react';

describe('ProductImageGallery', () => {
	test('should be render nothing if given an empty array', async () => {
		const { container } = render(<ProductImageGallery imageUrls={[]} />);

		expect(container).toBeEmptyDOMElement();
	});

	test('should be render a list of images', () => {
		const imageUrls: string[] = [
			'https://picsum.photos/200/300',
			'https://picsum.photos/200/300/?blur',
		];

		render(<ProductImageGallery imageUrls={imageUrls} />);

		const images = screen.getAllByRole('img');

		expect(images).toHaveLength(2);

		images.forEach((url, index) => {
			expect(url).toHaveAttribute('src', imageUrls[index]);
		});
	});
});
