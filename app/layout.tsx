import Header from './hfcomponents/Header';
import Footer from './hfcomponents/Footer';
import { ReactNode } from 'react'; // 追加

export const metadata = {
  title: 'Croquis',
  description: '固定ヘッダーとフッター付きのNext.jsアプリ',
};

interface RootLayoutProps {
  children: ReactNode; // 追加
}

const bodyStyle = {
  margin: 0,
  padding: 0,
  fontFamily: 'Arial, sans-serif',
};

const mainStyle = {
  paddingTop: '80px', // ヘッダーの高さ分の余白
  paddingBottom: '50px', // フッターの高さ分の余白
  minHeight: '100vh',
  boxSizing: 'border-box' as const,
};

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en">
      <body style={bodyStyle}>
        <Header />
        <main style={mainStyle}>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
