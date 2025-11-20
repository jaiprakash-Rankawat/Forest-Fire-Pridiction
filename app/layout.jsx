import './globals.css';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

export const metadata = {
  title: 'Forest Fire Prediction | Understanding & Preventing Wildfires',
  description: 'Educational platform for understanding forest fire causes, predicting fire risk, and learning prevention strategies based on real-world case studies.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-gradient-to-b from-orange-50 to-white">
        <Navbar />
        <main className="min-h-screen">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
