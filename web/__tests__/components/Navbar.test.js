const { render, screen } = require('@testing-library/react');
const Navbar = require('../../components/Navbar');

test('renders Navbar component', () => {
    render(<Navbar />);
    const linkElement = screen.getByText(/home/i);
    expect(linkElement).toBeInTheDocument();
});