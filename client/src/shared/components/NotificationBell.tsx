import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../app/store';
import api from '../services/api';

interface DBNotification {
  _id: string;
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
}

const NotificationBell: React.FC = () => {
  const { isAuthenticated, token } = useSelector((state: RootState) => state.auth);
  const [notifications, setNotifications] = useState<DBNotification[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  const hasValidToken = Boolean(token && token.split('.').length === 3);

  const fetchNotifications = async () => {
    if (!isAuthenticated || !hasValidToken) return;
    try {
      const res = await api.get('/notifications');
      setNotifications(res.data.data);
    } catch (err) {
      console.error('Failed to fetch notifications', err);
    }
  };

  useEffect(() => {
    fetchNotifications();
    // Refresh every 5 minutes
    const interval = setInterval(fetchNotifications, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, [isAuthenticated, hasValidToken]);

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const markAllRead = async () => {
    if (unreadCount === 0) return;
    try {
      await api.patch('/notifications/read-all');
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
    } catch (err) {
      console.error('Failed to mark all read', err);
    }
  };

  const toggleOpen = () => {
    if (!isOpen) markAllRead();
    setIsOpen(!isOpen);
  };

  if (!isAuthenticated) return null;

  return (
    <div className="relative group">
      <button 
        aria-label="Notifications" 
        onClick={toggleOpen}
        className="relative text-on-surface-variant hover:text-primary transition-colors focus:outline-none cursor-pointer active:scale-95"
      >
        <span className="material-symbols-outlined transition-all duration-200" style={{ fontVariationSettings: unreadCount > 0 ? "'FILL' 1" : "'FILL' 0" }}>
          notifications
        </span>
        {unreadCount > 0 && (
          <span className="absolute -top-1.5 -right-1.5 w-[18px] h-[18px] flex items-center justify-center rounded-full text-[9px] font-bold leading-none bg-primary text-on-primary">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)}></div>
          <div className="absolute right-0 mt-3 w-80 bg-surface-container-lowest rounded-md ambient-shadow py-2 border border-outline-variant/30 z-50 overflow-hidden max-h-[400px] flex flex-col">
            <div className="px-4 py-2 border-b border-outline-variant/30 flex justify-between items-center bg-surface">
              <h3 className="font-label-caps text-sm text-primary font-bold">Notifications</h3>
            </div>
            <div className="overflow-y-auto flex-1 p-2">
              {notifications.length === 0 ? (
                <div className="text-center py-6 text-on-surface-variant text-sm">
                  <span className="material-symbols-outlined block text-3xl mb-2 opacity-50">notifications_paused</span>
                  No notifications yet.
                </div>
              ) : (
                <div className="flex flex-col gap-2">
                  {notifications.map(n => (
                    <div key={n._id} className={`p-3 rounded-md text-sm border ${n.isRead ? 'bg-surface border-outline-variant/20' : 'bg-primary/5 border-primary/20'}`}>
                      <div className="font-bold text-on-surface mb-1 flex justify-between">
                        <span>{n.title}</span>
                        <span className="text-[10px] font-normal opacity-70">{new Date(n.createdAt).toLocaleDateString()}</span>
                      </div>
                      <p className="text-on-surface-variant text-xs">{n.message}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default NotificationBell;
