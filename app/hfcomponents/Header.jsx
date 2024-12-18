export default function Header() {
    return (
      <header style={headerStyle}>
        <h1>Croquis</h1>
        <nav>
          <a href="/" style={linkStyle}>HOME</a>
          <a href="/report" style={linkStyle}>レポートを見る</a>
        </nav>
      </header>
    );
  }
  
  const headerStyle = {
    position: 'fixed',
    top: 0,
    width: '100%',
    height: '60px',
    backgroundColor: '#000',
    color: '#fff',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '0 20px',
    zIndex: 1000,
  };
  
  const linkStyle = {
    margin: '0 10px',
    color: '#fff',
    textDecoration: 'none',
  };
  