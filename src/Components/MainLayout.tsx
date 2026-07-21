import NavBar from './NavBar';
import Footer from './Footer';
import { getCurrentUser } from '../Services/Auth_Service';

interface MainLayoutProps {
  children: React.ReactNode;
}

function MainLayout({ children }: MainLayoutProps) {
  const user = getCurrentUser();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <NavBar
        user_is_loged_in={user != null}
        profil_image="https://plus.unsplash.com/premium_photo-1664474619075-644dd191935f"
        logo="/logo.jpg"
      />
      {/* Spacer to clear fixed 64px navbar */}
      <main style={{ flex: 1, paddingTop: '64px' }}>
        {children}
      </main>
      <Footer />
    </div>
  );
}

export default MainLayout;