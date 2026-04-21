import './globals.css';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

export const metadata = {
  title: 'Rajasthan Fire Analysis | NASA FIRMS Forest Fire Monitoring',
  description: 'Comprehensive forest fire monitoring across all 33 districts and Aravalli Range of Rajasthan using NASA FIRMS satellite data, KDE analysis, and real-time GIS mapping.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-slate-950">
        <Navbar />
        <main className="min-h-screen">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
