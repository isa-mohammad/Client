import Dashboard from './components/Dashboard';
import Auth from './components/Auth';
import { useAuthStore } from './store/useAuthStore';

function App() {
  const user = useAuthStore((state) => state.user);

  return (
    <main>
      {user ? <Dashboard /> : <Auth />}
      
      {/* Background Orbs for Premium feel */}
      <div className="orb orb-1"></div>
      <div className="orb orb-2"></div>

      <style>{`
        main {
          position: relative;
          min-height: 100vh;
          overflow: hidden;
        }

        .orb {
          position: absolute;
          width: 400px;
          height: 400px;
          border-radius: 50%;
          filter: blur(80px);
          z-index: -1;
          opacity: 0.15;
        }

        .orb-1 {
          top: -100px;
          right: -100px;
          background: var(--accent-primary);
        }

        .orb-2 {
          bottom: -100px;
          left: -100px;
          background: var(--accent-secondary);
        }
      `}</style>
    </main>
  );
}

export default App;
