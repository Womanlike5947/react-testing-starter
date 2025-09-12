import { Theme } from '@radix-ui/themes';
import { PropsWithChildren } from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';

const AllProviders = ({ children }: PropsWithChildren) => {
	const client = new QueryClient({
		defaultOptions: {
			queries: {
				retry: false,
			},
		},
	});

	return (
		<Theme>
			<QueryClientProvider client={client}>{children}</QueryClientProvider>
		</Theme>
	);
};

export default AllProviders;
