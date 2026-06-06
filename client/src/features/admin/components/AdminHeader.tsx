import { useSelector } from 'react-redux';
import { RootState } from '../../../app/store';

export const AdminHeader = () => {
  const { user } = useSelector((state: RootState) => state.auth);

  const now = new Date();
  const dateStr = now.toLocaleDateString('en-IN', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="flex items-center justify-between py-2 mb-2">
      <p className="text-xs text-on-surface-variant font-label-caps uppercase tracking-wider">
        {dateStr}
      </p>
      <div className="flex items-center gap-3">
        <span className="text-xs text-on-surface-variant font-label-caps uppercase tracking-wider">
          Welcome, {user?.name || 'Admin'}
        </span>
        <div className="w-8 h-8 rounded-full bg-primary-container flex items-center justify-center text-primary font-bold text-sm">
          {(user?.name || 'A').charAt(0).toUpperCase()}
        </div>
      </div>
    </div>
  );
};

export default AdminHeader;
