// components/layout/MainLayout.js
import Header from './Header';
import Footer from './Footer';
import DaftarGuru from './DaftarGuru';
import ArticleSection from './ArticleSection';

export default function MainLayout({ children }) {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-6">
        {children}
        <DaftarGuru/>
        <ArticleSection/>
      </main>
      <Footer />
    </div>
  );
}
