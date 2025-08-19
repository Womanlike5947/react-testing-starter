import '@testing-library/jest-dom/vitest';
import ResizeObserver from 'resize-observer-polyfill';

/** Stops the ResizeObserver error displaying */
global.ResizeObserver = ResizeObserver;

/** Below needed to stop 'target.hasPointerCapture' error message displaying */
window.HTMLElement.prototype.scrollIntoView = vi.fn();
window.HTMLElement.prototype.hasPointerCapture = vi.fn();
window.HTMLElement.prototype.releasePointerCapture = vi.fn();

// Needed because the success message in ToastDemo is rendered within the a node environment instead of the browser
Object.defineProperty(window, 'matchMedia', {
	writable: true,
	value: vi.fn().mockImplementation((query) => ({
		matches: false,
		media: query,
		onchange: null,
		addListener: vi.fn(), // deprecated
		removeListener: vi.fn(), // deprecated
		addEventListener: vi.fn(),
		removeEventListener: vi.fn(),
		dispatchEvent: vi.fn(),
	})),
});
