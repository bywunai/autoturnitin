import { HeroBanner } from '@/components/HeroBanner';
import { SubmissionForm } from '@/components/SubmissionForm';
import { StatusPanel } from '@/components/StatusPanel';

export default function App() {
  return (
    <div className="page-shell">
      <HeroBanner />
      <SubmissionForm />
      <StatusPanel />
    </div>
  );
}
