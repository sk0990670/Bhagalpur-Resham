import React, { useEffect, useState } from 'react';
import api from '../../../shared/services/api';
import AdminSidebar from '../../../shared/components/AdminSidebar';
interface Inquiry {
  _id: string;
  fullName: string;
  email: string;
  subject: string;
  message: string;
  status: 'new' | 'read' | 'replied';
  createdAt: string;
}

const CustomerInquiriesPage = () => {
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  const fetchInquiries = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/contact?status=${filter}`);
      setInquiries(res.data.data);
    } catch (error) {
      console.error('Failed to fetch inquiries', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInquiries();
  }, [filter]);

  const updateStatus = async (id: string, newStatus: string) => {
    try {
      await api.put(`/contact/${id}/status`, { status: newStatus });
      fetchInquiries();
    } catch (error) {
      console.error('Failed to update status', error);
    }
  };

  const deleteInquiry = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this inquiry?')) return;
    try {
      await api.delete(`/contact/${id}`);
      fetchInquiries();
    } catch (error) {
      console.error('Failed to delete inquiry', error);
    }
  };

  return (
    <div className="min-h-screen bg-surface-container-lowest flex">
      <AdminSidebar />
      <main className="flex-1 ml-64 bg-surface-container-lowest min-h-screen">
        <div className="p-8">
          <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="font-headline-md text-headline-md text-primary mb-2">Customer Inquiries</h1>
          <p className="text-on-surface-variant font-body-md">Manage and respond to patron messages</p>
        </div>
        <div className="flex bg-surface-container-low rounded-sm border border-outline-variant/50 p-1">
          {['all', 'new', 'read', 'replied'].map(status => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-4 py-2 font-label-caps text-label-caps rounded-sm uppercase tracking-wider transition-colors ${
                filter === status 
                  ? 'bg-primary text-on-primary' 
                  : 'text-on-surface hover:bg-surface-container-high'
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-surface rounded-sm border border-outline-variant/30 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface-container-low border-b border-outline-variant/30">
                <th className="py-4 px-6 font-label-caps text-label-caps text-on-surface-variant font-semibold">Date</th>
                <th className="py-4 px-6 font-label-caps text-label-caps text-on-surface-variant font-semibold">Customer</th>
                <th className="py-4 px-6 font-label-caps text-label-caps text-on-surface-variant font-semibold">Subject</th>
                <th className="py-4 px-6 font-label-caps text-label-caps text-on-surface-variant font-semibold">Status</th>
                <th className="py-4 px-6 font-label-caps text-label-caps text-on-surface-variant font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-on-surface-variant">Loading inquiries...</td>
                </tr>
              ) : inquiries.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-on-surface-variant">No inquiries found.</td>
                </tr>
              ) : (
                inquiries.map((inquiry) => (
                  <tr key={inquiry._id} className="border-b border-outline-variant/10 hover:bg-surface-container-lowest transition-colors">
                    <td className="py-4 px-6 font-body-md text-on-surface">
                      {new Date(inquiry.createdAt).toLocaleString('en-IN', {
                        day: '2-digit', month: 'short', year: 'numeric',
                        hour: '2-digit', minute: '2-digit'
                      })}
                    </td>
                    <td className="py-4 px-6">
                      <p className="font-body-md font-semibold text-on-surface">{inquiry.fullName}</p>
                      <p className="text-xs text-on-surface-variant">{inquiry.email}</p>
                    </td>
                    <td className="py-4 px-6 font-body-md text-on-surface">
                      <p className="font-semibold">{inquiry.subject}</p>
                      <p className="text-xs text-on-surface-variant truncate max-w-xs">{inquiry.message}</p>
                    </td>
                    <td className="py-4 px-6">
                      <span className={`inline-flex items-center px-2 py-1 rounded-sm text-[10px] font-label-caps uppercase tracking-wider ${
                        inquiry.status === 'new' ? 'bg-primary-container text-primary' :
                        inquiry.status === 'read' ? 'bg-surface-container-high text-on-surface' :
                        'bg-secondary-container text-secondary'
                      }`}>
                        {inquiry.status}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-right space-x-2">
                      <a 
                        href={`mailto:${inquiry.email}?subject=Re: ${inquiry.subject}`}
                        className="p-2 inline-flex items-center justify-center rounded-sm hover:bg-surface-container-high text-primary transition-colors"
                        title="Reply via Email"
                        onClick={() => updateStatus(inquiry._id, 'replied')}
                      >
                        <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 0" }}>reply</span>
                      </a>
                      {inquiry.status !== 'read' && inquiry.status !== 'replied' && (
                        <button 
                          className="p-2 inline-flex items-center justify-center rounded-sm hover:bg-surface-container-high text-secondary transition-colors"
                          title="Mark as Read"
                          onClick={() => updateStatus(inquiry._id, 'read')}
                        >
                          <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 0" }}>mark_email_read</span>
                        </button>
                      )}
                      <button 
                        className="p-2 inline-flex items-center justify-center rounded-sm hover:bg-error-container text-error transition-colors"
                        title="Delete"
                        onClick={() => deleteInquiry(inquiry._id)}
                      >
                        <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 0" }}>delete</span>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
        </div>
      </main>
    </div>
  );
};

export default CustomerInquiriesPage;
