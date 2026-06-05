import React, { useState, useEffect } from 'react';
import api from '../../../shared/services/api';

interface ProfileEditDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onUpdate: () => void;
  profile: any;
}

const ProfileEditDrawer = ({ isOpen, onClose, onUpdate, profile }: ProfileEditDrawerProps) => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    pincode: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen && profile) {
      const defaultAddress = profile.addresses?.find((a: any) => a.isDefault) || profile.addresses?.[0] || {};
      setFormData({
        name: profile.name || '',
        phone: profile.phone || '',
        address: defaultAddress.addressLine1 || '',
        city: defaultAddress.city || '',
        state: defaultAddress.state || '',
        pincode: defaultAddress.pincode || ''
      });
      setError('');
    }
  }, [isOpen, profile]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Update profile basic info
      await api.patch('/users/profile', {
        name: formData.name,
        phone: formData.phone
      });

      // Update default address if provided
      if (formData.address && formData.city && formData.state && formData.pincode) {
        await api.post('/users/addresses', {
          address: {
            addressLine1: formData.address,
            city: formData.city,
            state: formData.state,
            pincode: formData.pincode,
            isDefault: true,
            label: 'Home',
            name: formData.name,
            phone: formData.phone
          }
        });
      }

      onUpdate();
      onClose();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-surface/80 backdrop-blur-sm z-50 transition-opacity" onClick={onClose} />
      <div className="fixed right-0 top-0 h-full w-full md:w-[500px] bg-surface-container-lowest border-l border-outline-variant shadow-2xl z-50 flex flex-col transform transition-transform duration-300">
        
        {/* Header */}
        <header className="px-6 py-6 border-b border-outline-variant flex items-center justify-between sticky top-0 bg-surface-container-lowest z-10">
          <h2 className="font-headline-sm text-2xl text-primary font-bold">Edit Profile</h2>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-surface-container-high text-on-surface-variant transition-colors">
            <span className="material-symbols-outlined">close</span>
          </button>
        </header>

        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">
          {error && <div className="p-3 bg-error-container text-error rounded text-sm">{error}</div>}
          
          <section>
            <h4 className="text-sm font-bold text-primary mb-3 uppercase tracking-wider">Personal Information</h4>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-label-caps text-on-surface-variant mb-1">Full Name</label>
                <input type="text" name="name" value={formData.name} onChange={handleChange} className="w-full p-2 bg-surface border border-outline-variant rounded focus:border-primary outline-none" required />
              </div>
              <div>
                <label className="block text-xs font-label-caps text-on-surface-variant mb-1">Phone Number</label>
                <input type="text" name="phone" value={formData.phone} onChange={handleChange} className="w-full p-2 bg-surface border border-outline-variant rounded focus:border-primary outline-none" />
              </div>
            </div>
          </section>

          <section>
            <h4 className="text-sm font-bold text-primary mb-3 uppercase tracking-wider">Default Address</h4>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-label-caps text-on-surface-variant mb-1">Street Address</label>
                <input type="text" name="address" value={formData.address} onChange={handleChange} className="w-full p-2 bg-surface border border-outline-variant rounded focus:border-primary outline-none" required />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-label-caps text-on-surface-variant mb-1">City</label>
                  <input type="text" name="city" value={formData.city} onChange={handleChange} className="w-full p-2 bg-surface border border-outline-variant rounded focus:border-primary outline-none" required />
                </div>
                <div>
                  <label className="block text-xs font-label-caps text-on-surface-variant mb-1">State</label>
                  <input type="text" name="state" value={formData.state} onChange={handleChange} className="w-full p-2 bg-surface border border-outline-variant rounded focus:border-primary outline-none" required />
                </div>
              </div>
              <div>
                <label className="block text-xs font-label-caps text-on-surface-variant mb-1">Pincode</label>
                <input type="text" name="pincode" value={formData.pincode} onChange={handleChange} className="w-full p-2 bg-surface border border-outline-variant rounded focus:border-primary outline-none" required />
              </div>
            </div>
          </section>

          <div className="pt-4 flex justify-end gap-3 border-t border-outline-variant mt-6 shrink-0 pb-4">
            <button type="button" onClick={onClose} className="px-6 py-2 text-on-surface-variant font-label-caps hover:bg-surface-container-highest rounded transition-colors">Cancel</button>
            <button type="submit" disabled={loading} className="px-6 py-2 bg-primary text-on-primary font-label-caps rounded hover:bg-primary/90 transition-colors disabled:opacity-50">
              {loading ? 'SAVING...' : 'SAVE CHANGES'}
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default ProfileEditDrawer;
