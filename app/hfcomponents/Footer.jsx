export default function Footer() {
    return (
      <footer style={footerStyle}>
        <p>&copy; 2024 Croquis. All rights reserved.</p>
      </footer>
    );
  }
  
  const footerStyle = {
    position: 'fixed',
    bottom: 0,
    width: '100%',
    height: '50px',
    backgroundColor: '#000',
    color: '#fff',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  };
  