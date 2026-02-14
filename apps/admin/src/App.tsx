import { Sidebar } from '@/components/Sidebar';
import { Dashboard } from '@/pages/Dashboard';

export default function App() {
  return (
    <div className="admin-shell">
      <Sidebar />
      <Dashboard />
    </div>
  );
}
