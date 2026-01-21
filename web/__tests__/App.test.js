const { render, screen } = require('@testing-library/react');
const App = require('../App');

test('renders App component', () => {
	render(<App />);
	const linkElement = screen.getByText(/your app text/i);
	expect(linkElement).toBeInTheDocument();
});