import { render, screen } from '@testing-library/react';
import { describe } from 'vitest';
import Label from '../../src/components/Label';
import { LanguageProvider } from '../../src/providers/language/LanguageProvider';
import { Language } from '../../src/providers/language/type';

describe('Label', () => {
	const renderComponent = (labelId: string, language: Language) => {
		render(
			<LanguageProvider language={language}>
				<Label labelId={labelId} />
			</LanguageProvider>
		);

		return {
			getText: (text: string) => screen.getByText(text),
		};
	};

	describe('Given the current language is EN', () => {
		test.each([
			{
				labelId: 'welcome',
				text: 'Welcome',
			},
			{
				labelId: 'new_product',
				text: 'New Product',
			},
			{
				labelId: 'edit_product',
				text: 'Edit Product',
			},
		])('should render $text for $labelId', ({ labelId, text }) => {
			const { getText } = renderComponent(labelId, 'en');

			expect(getText(text)).toBeInTheDocument();
		});
	});

	describe('Given the current language is ES', () => {
		test.each([
			{
				labelId: 'welcome',
				text: 'Bienvenidos',
			},
			{
				labelId: 'new_product',
				text: 'Nuevo Producto',
			},
			{
				labelId: 'edit_product',
				text: 'Editar Producto',
			},
		])('should render $text for $labelId', ({ labelId, text }) => {
			const { getText } = renderComponent(labelId, 'es');
			// screen.debug();

			expect(getText(text)).toBeInTheDocument();
		});
	});

	test('should show error message when current language is incorrect', () => {
		expect(() => renderComponent('!', 'en')).toThrowError();
	});
});
