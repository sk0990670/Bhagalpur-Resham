import React, { useState, useEffect } from 'react';
import api from '../../../shared/services/api';

interface AddArtisanModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  artisan?: any; // If provided, acts as Edit mode
}

const AddArtisanModal = ({ isOpen, onClose, onSuccess, artisan }: AddArtisanModalProps) => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    address: '',
    city: '',
    state: '',
    experienceYears: 0,
    specialization: '',
    dailyCapacity: 5,
    accountName: '',
    accountNumber: '',
    ifscCode: '',
    bankName: '',
    notes: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (artisan && isOpen) {
      setFormData({
        name: artisan.name || '',
        phone: artisan.phone || '',
        email: artisan.email || '',
        address: artisan.address || '',
        city: artisan.city || '',
        state: artisan.state || '',
        experienceYears: artisan.experienceYears || 0,
        specialization: artisan.specialization ? artisan.specialization.join(', ') : '',
        dailyCapacity: artisan.dailyCapacity || 5,
        accountName: artisan.bankDetails?.accountName || '',
        accountNumber: artisan.bankDetails?.accountNumber || '',
        ifscCode: artisan.bankDetails?.ifscCode || '',
        bankName: artisan.bankDetails?.bankName || '',
        notes: artisan.notes || ''
      });
    } else if (isOpen) {
      setFormData({
        name: '', phone: '', email: '', address: '', city: '', state: '',
        experienceYears: 0, specialization: '', dailyCapacity: 5,
        accountName: '', accountNumber: '', ifscCode: '', bankName: '', notes: ''
      });
    }
  }, [artisan, isOpen]);

  if (!isOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'experienceYears' || name === 'dailyCapacity' ? Number(value) : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!formData.name || !formData.phone || !formData.specialization || !formData.address || !formData.city || !formData.state) {
      setError('Please fill in all required fields (*).');
      return;
    }

    try {
      setIsSubmitting(true);
      
      const payload = {
        name: formData.name,
        phone: formData.phone,
        email: formData.email,
        address: formData.address,
        city: formData.city,
        state: formData.state,
        experienceYears: formData.experienceYears,
        specialization: formData.specialization.split(',').map(s => s.trim()).filter(Boolean),
        dailyCapacity: formData.dailyCapacity,
        bankDetails: {
          accountName: formData.accountName,
          accountNumber: formData.accountNumber,
          ifscCode: formData.ifscCode,
          bankName: formData.bankName
        },
        notes: formData.notes
      };

      if (artisan) {
        await api.patch(`/artisans/${artisan._id}`, payload);
      } else {
        await api.post('/artisans', payload);
      }
      
      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err.response?.data?.message || `Failed to ${artisan ? 'update' : 'add'} artisan`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-surface/80 backdrop-blur-sm z-[60] flex items-center justify-center p-4">
      <div className="bg-surface-container-lowest border border-outline-variant rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        <header className="px-6 py-4 border-b border-outline-variant flex items-center justify-between shrink-0">
          <h3 className="font-headline-sm text-primary font-bold">{artisan ? 'Edit Artisan' : 'Add New Artisan'}</h3>
          <button onClick={onClose} className="text-on-surface-variant hover:text-on-surface transition-colors">
            <span className="material-symbols-outlined">close</span>
          </button>
        </header>

        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">
          {error && <div className="p-3 bg-error-container text-error rounded text-sm">{error}</div>}
          
          <section>
            <h4 className="text-sm font-bold text-primary mb-3 uppercase tracking-wider">Personal Information</h4>
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <label className="block text-xs font-label-caps text-on-surface-variant mb-1">Full Name *</label>
                <input type="text" name="name" value={formData.name} onChange={handleChange} className="w-full p-2 bg-surface border border-outline-variant rounded focus:border-primary outline-none" required />
              </div>
              <div>
                <label className="block text-xs font-label-caps text-on-surface-variant mb-1">Phone Number *</label>
                <input type="text" name="phone" value={formData.phone} onChange={handleChange} className="w-full p-2 bg-surface border border-outline-variant rounded focus:border-primary outline-none" required />
              </div>
              <div>
                <label className="block text-xs font-label-caps text-on-surface-variant mb-1">Email</label>
                <input type="email" name="email" value={formData.email} onChange={handleChange} className="w-full p-2 bg-surface border border-outline-variant rounded focus:border-primary outline-none" />
              </div>
            </div>
          </section>

          <section>
            <h4 className="text-sm font-bold text-primary mb-3 uppercase tracking-wider">Location</h4>
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <label className="block text-xs font-label-caps text-on-surface-variant mb-1">Street Address *</label>
                <input type="text" name="address" value={formData.address} onChange={handleChange} className="w-full p-2 bg-surface border border-outline-variant rounded focus:border-primary outline-none" required />
              </div>
              <div>
                <label className="block text-xs font-label-caps text-on-surface-variant mb-1">City *</label>
                <input type="text" name="city" value={formData.city} onChange={handleChange} className="w-full p-2 bg-surface border border-outline-variant rounded focus:border-primary outline-none" required />
              </div>
              <div>
                <label className="block text-xs font-label-caps text-on-surface-variant mb-1">State *</label>
                <input type="text" name="state" value={formData.state} onChange={handleChange} className="w-full p-2 bg-surface border border-outline-variant rounded focus:border-primary outline-none" required />
              </div>
            </div>
          </section>

          <section>
            <h4 className="text-sm font-bold text-primary mb-3 uppercase tracking-wider">Professional Details</h4>
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <label className="block text-xs font-label-caps text-on-surface-variant mb-1">Specializations * (comma separated)</label>
                <input type="text" name="specialization" value={formData.specialization} onChange={handleChange} className="w-full p-2 bg-surface border border-outline-variant rounded focus:border-primary outline-none" placeholder="e.g. Tussar Silk, Dyeing" required />
              </div>
              <div>
                <label className="block text-xs font-label-caps text-on-surface-variant mb-1">Experience (Years) *</label>
                <input type="number" name="experienceYears" value={formData.experienceYears} onChange={handleChange} className="w-full p-2 bg-surface border border-outline-variant rounded focus:border-primary outline-none" min="0" required />
              </div>
              <div>
                <label className="block text-xs font-label-caps text-on-surface-variant mb-1">Daily Capacity *</label>
                <input type="number" name="dailyCapacity" value={formData.dailyCapacity} onChange={handleChange} className="w-full p-2 bg-surface border border-outline-variant rounded focus:border-primary outline-none" min="1" required />
              </div>
            </div>
          </section>

          <section>
            <h4 className="text-sm font-bold text-primary mb-3 uppercase tracking-wider">Bank Details</h4>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-label-caps text-on-surface-variant mb-1">Account Name</label>
                <input type="text" name="accountName" value={formData.accountName} onChange={handleChange} className="w-full p-2 bg-surface border border-outline-variant rounded focus:border-primary outline-none" />
              </div>
              <div>
                <label className="block text-xs font-label-caps text-on-surface-variant mb-1">Bank Name</label>
                <input type="text" name="bankName" value={formData.bankName} onChange={handleChange} className="w-full p-2 bg-surface border border-outline-variant rounded focus:border-primary outline-none" />
              </div>
              <div>
                <label className="block text-xs font-label-caps text-on-surface-variant mb-1">Account Number</label>
                <input type="text" name="accountNumber" value={formData.accountNumber} onChange={handleChange} className="w-full p-2 bg-surface border border-outline-variant rounded focus:border-primary outline-none" />
              </div>
              <div>
                <label className="block text-xs font-label-caps text-on-surface-variant mb-1">IFSC Code</label>
                <input type="text" name="ifscCode" value={formData.ifscCode} onChange={handleChange} className="w-full p-2 bg-surface border border-outline-variant rounded focus:border-primary outline-none" />
              </div>
            </div>
          </section>

          <section>
            <label className="block text-xs font-label-caps text-on-surface-variant mb-1">Notes</label>
            <textarea name="notes" value={formData.notes} onChange={handleChange} className="w-full p-2 bg-surface border border-outline-variant rounded focus:border-primary outline-none h-20" />
          </section>

          <div className="pt-4 flex justify-end gap-3 border-t border-outline-variant mt-6 shrink-0 pb-4">
            <button type="button" onClick={onClose} className="px-6 py-2 text-on-surface-variant font-label-caps hover:bg-surface-container-highest rounded transition-colors">Cancel</button>
            <button type="submit" disabled={isSubmitting} className="px-6 py-2 bg-primary text-on-primary font-label-caps rounded hover:bg-primary/90 transition-colors disabled:opacity-50">
              {isSubmitting ? 'SAVING...' : artisan ? 'UPDATE ARTISAN' : 'ADD ARTISAN'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddArtisanModal;
