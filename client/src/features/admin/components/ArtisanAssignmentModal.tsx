import { useState, useEffect } from 'react';
import api from '../../../shared/services/api';

interface ArtisanAssignmentModalProps {
  order: any;
  isOpen: boolean;
  onClose: () => void;
  onAssign: (artisanId: string) => void;
}

const ArtisanAssignmentModal = ({ order, isOpen, onClose, onAssign }: ArtisanAssignmentModalProps) => {
  const [artisans, setArtisans] = useState<any[]>([]);
  const [recommended, setRecommended] = useState<any[]>([]);
  const [selectedArtisan, setSelectedArtisan] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      fetchArtisans();
    }
  }, [isOpen]);

  const fetchArtisans = async () => {
    setLoading(true);
    try {
      // Determine required skill based on product
      const skill = order.items[0]?.name.toLowerCase().includes('tussar') ? 'Tussar' : '';
      
      const [resAll, resRec] = await Promise.all([
        api.get('/artisans?status=available'),
        api.get(`/artisans/recommended?skill=${skill}`)
      ]);
      
      if (resAll.data?.success) setArtisans(resAll.data.data.artisans);
      if (resRec.data?.success) setRecommended(resRec.data.data);
      
      if (resRec.data?.success && resRec.data.data.length > 0) {
        setSelectedArtisan(resRec.data.data[0]._id);
      }
    } catch (err) {
      console.error('Failed to fetch artisans', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAssign = () => {
    if (!selectedArtisan) return;
    onAssign(selectedArtisan);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-surface/80 backdrop-blur-sm z-[60] flex items-center justify-center p-4">
      <div className="bg-surface-container-lowest border border-outline-variant rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl">
        <header className="px-6 py-4 border-b border-outline-variant flex items-center justify-between">
          <h3 className="font-headline-sm text-primary font-bold">Assign Artisan</h3>
          <button onClick={onClose} className="text-on-surface-variant hover:text-on-surface transition-colors">
            <span className="material-symbols-outlined">close</span>
          </button>
        </header>

        <div className="p-6">
          <div className="bg-surface-container-low p-4 rounded-xl border border-outline-variant mb-6 flex items-start gap-4">
            <img src={order.items[0]?.image} alt="Product" className="w-16 h-16 object-cover rounded border border-outline-variant" />
            <div>
              <p className="font-mono text-xs text-primary">{order.orderId}</p>
              <p className="font-body-md text-on-surface font-bold">{order.items[0]?.name}</p>
              <p className="text-sm text-on-surface-variant">Qty: {order.items[0]?.qty}</p>
            </div>
          </div>

          <h4 className="font-label-caps text-xs text-on-surface-variant mb-3">Recommended Artisans</h4>
          {loading ? (
            <p className="text-sm text-on-surface-variant animate-pulse">Loading recommendations...</p>
          ) : (
            <div className="space-y-3 mb-6">
              {recommended.length === 0 ? (
                <p className="text-sm text-on-surface-variant italic">No exact match recommendations.</p>
              ) : (
                recommended.map(artisan => (
                  <label key={artisan._id} className={`flex items-center gap-4 p-4 rounded-xl border cursor-pointer transition-all ${selectedArtisan === artisan._id ? 'border-primary bg-primary/10' : 'border-outline-variant bg-surface hover:bg-surface-container-low'}`}>
                    <input 
                      type="radio" 
                      name="artisan" 
                      value={artisan._id} 
                      checked={selectedArtisan === artisan._id}
                      onChange={() => setSelectedArtisan(artisan._id)}
                      className="hidden"
                    />
                    <div className="w-10 h-10 rounded-full bg-surface-container-high flex items-center justify-center font-bold text-primary shrink-0">
                      {artisan.name.charAt(0)}
                    </div>
                    <div className="flex-1">
                      <p className="font-bold text-on-surface">{artisan.name}</p>
                      <p className="text-xs text-on-surface-variant">Rating: {artisan.qualityRating.toFixed(1)} ⭐ • Workload: {artisan.activeOrders}/{artisan.maxCapacity}</p>
                    </div>
                    <div className="text-right">
                      <span className="px-2 py-1 bg-secondary-container/50 text-on-secondary-container text-[10px] rounded uppercase font-bold tracking-wider">
                        {artisan.specialization[0] || 'Artisan'}
                      </span>
                    </div>
                  </label>
                ))
              )}
            </div>
          )}

          <h4 className="font-label-caps text-xs text-on-surface-variant mb-3">Other Available Artisans</h4>
          <div className="relative">
            <div className="flex items-center bg-surface border border-outline-variant rounded-lg p-2 focus-within:border-primary transition-colors">
              <span className="material-symbols-outlined text-on-surface-variant ml-2 mr-2">search</span>
              <input
                type="text"
                placeholder="Search by name or specialization..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                onFocus={() => setIsDropdownOpen(true)}
                className="w-full bg-transparent text-on-surface focus:outline-none p-2"
              />
              {selectedArtisan && !recommended.find(r => r._id === selectedArtisan) && (
                 <span className="text-xs bg-primary/20 text-primary px-2 py-1 rounded ml-2 whitespace-nowrap">1 Selected</span>
              )}
            </div>

            {isDropdownOpen && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-surface-container-highest border border-outline-variant rounded-lg max-h-60 overflow-y-auto shadow-xl z-10">
                {artisans
                  .filter(a => !recommended.find(r => r._id === a._id))
                  .filter(a => 
                    a.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                    a.specialization.some((s: string) => s.toLowerCase().includes(searchQuery.toLowerCase()))
                  )
                  .map(artisan => (
                    <div 
                      key={artisan._id} 
                      onClick={() => {
                        setSelectedArtisan(artisan._id);
                        setIsDropdownOpen(false);
                        setSearchQuery('');
                      }}
                      className={`p-3 cursor-pointer hover:bg-primary/10 border-b border-outline-variant/30 last:border-0 ${selectedArtisan === artisan._id ? 'bg-primary/20 text-primary font-bold' : 'text-on-surface'}`}
                    >
                      <div className="flex justify-between items-center">
                        <div>
                          <p>{artisan.name}</p>
                          <p className="text-xs text-on-surface-variant">{artisan.specialization.join(', ')}</p>
                        </div>
                        <span className="text-xs px-2 py-1 bg-surface-container-low rounded-full">
                          {artisan.activeOrders}/{artisan.maxCapacity} active
                        </span>
                      </div>
                    </div>
                ))}
                {artisans.filter(a => !recommended.find(r => r._id === a._id)).length > 0 && 
                 artisans.filter(a => !recommended.find(r => r._id === a._id)).filter(a => a.name.toLowerCase().includes(searchQuery.toLowerCase()) || a.specialization.some((s: string) => s.toLowerCase().includes(searchQuery.toLowerCase()))).length === 0 && (
                  <div className="p-4 text-center text-sm text-on-surface-variant">No artisans match your search</div>
                )}
              </div>
            )}
          </div>
          
          {isDropdownOpen && (
            <div className="fixed inset-0 z-0" onClick={() => setIsDropdownOpen(false)}></div>
          )}
        </div>

        <footer className="px-6 py-4 border-t border-outline-variant bg-surface-container-low flex justify-end gap-3">
          <button onClick={onClose} className="px-6 py-2 text-on-surface-variant font-label-caps hover:bg-surface-container-highest rounded transition-colors">Cancel</button>
          <button 
            onClick={handleAssign} 
            disabled={!selectedArtisan}
            className="px-6 py-2 bg-primary text-on-primary font-label-caps rounded hover:bg-primary/90 transition-colors disabled:opacity-50"
          >
            CONFIRM ASSIGNMENT
          </button>
        </footer>
      </div>
    </div>
  );
};

export default ArtisanAssignmentModal;
