import SearchBox from '../components/SearchBox';

const PlaygroundPage = () => {
	// return <Onboarding />;
	// return <TermsAndConditions />;
	return <SearchBox onChange={(text) => console.log(text)} />;
};

export default PlaygroundPage;
