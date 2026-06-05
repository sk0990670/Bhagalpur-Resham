import { useState, useEffect } from 'react';
import api from '../../../shared/services/api';

interface ArtisanProfileDrawerProps {
  artisanId: string | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdate: () => void;
}

const PRODUCTION_STAGES = [
  'assigned',
  'yarn_preparation',
  'dyeing',
  'weaving',
  'finishing',
  'quality_check',
  'ready_for_dispatch',
  'completed'
];

const ArtisanProfileDrawer = ({ artisanId, isOpen, onClose, onUpdate }: ArtisanProfileDrawerProps) => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen && artisanId) {
      fetchArtisanDetails();
    } else {
      setData(null);
    }
  }, [isOpen, artisanId]);

  const fetchArtisanDetails = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/artisans/${artisanId}`);
      if (res.data?.success) {
        setData(res.data.data);
      }
    } catch (err) {
      console.error('Failed to fetch artisan details', err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStage = async (orderId: string, stage: string) => {
    try {
      await api.patch(`/orders/${orderId}/update-production-stage`, { stage });
      fetchArtisanDetails(); // Refresh
      onUpdate();
    } catch (err) {
      console.error('Failed to update stage', err);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-surface/80 backdrop-blur-sm z-50 transition-opacity" onClick={onClose} />
      <div className="fixed right-0 top-0 h-full w-[600px] bg-surface-container-lowest border-l border-outline-variant shadow-2xl z-50 flex flex-col transform transition-transform duration-300">
        
        {/* Header */}
        <header className="px-6 py-6 border-b border-outline-variant flex items-center justify-between sticky top-0 bg-surface-container-lowest z-10">
          <h2 className="font-headline-sm text-2xl text-primary font-bold">Artisan Profile</h2>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-surface-container-high text-on-surface-variant transition-colors">
            <span className="material-symbols-outlined">close</span>
          </button>
        </header>

        {loading || !data ? (
          <div className="flex-1 flex items-center justify-center">
            <p className="text-on-surface-variant font-label-caps animate-pulse">Loading profile...</p>
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto p-6 space-y-8">
            
            {/* Profile Card */}
            <section className="flex gap-6 items-start">
              <div className="w-24 h-24 rounded-2xl bg-surface-container-high flex items-center justify-center border border-outline-variant text-4xl text-primary font-bold overflow-hidden shrink-0">
                {data.artisan.photo ? <img src={data.artisan.photo} alt={data.artisan.name} className="w-full h-full object-cover"/> : data.artisan.name.charAt(0)}
              </div>
              <div className="flex-1">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-display-sm text-3xl text-on-surface font-bold">{data.artisan.name}</h3>
                    <p className="font-mono text-primary mt-1">{data.artisan.artisanId}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                    data.artisan.status === 'available' ? 'bg-primary-container text-on-primary-container' :
                    data.artisan.status === 'busy' ? 'bg-secondary-container text-on-secondary-container' :
                    'bg-surface-container-highest text-on-surface-variant'
                  }`}>
                    {data.artisan.status.replace('_', ' ')}
                  </span>
                </div>
                
                <div className="grid grid-cols-2 gap-4 mt-4">
                  <div>
                    <p className="text-xs text-on-surface-variant font-label-caps mb-1">Location</p>
                    <p className="text-sm text-on-surface font-semibold">{data.artisan.city}, {data.artisan.state}</p>
                  </div>
                  <div>
                    <p className="text-xs text-on-surface-variant font-label-caps mb-1">Experience</p>
                    <p className="text-sm text-on-surface font-semibold">{data.artisan.experienceYears} Years</p>
                  </div>
                  <div>
                    <p className="text-xs text-on-surface-variant font-label-caps mb-1">Contact</p>
                    <p className="text-sm text-on-surface font-semibold">{data.artisan.phone}</p>
                  </div>
                  <div>
                    <p className="text-xs text-on-surface-variant font-label-caps mb-1">Rating</p>
                    <p className="text-sm text-secondary font-semibold flex items-center gap-1">
                      {data.artisan.qualityRating.toFixed(1)} <span className="material-symbols-outlined text-[14px]">star</span>
                    </p>
                  </div>
                </div>

                <div className="mt-4">
                  <p className="text-xs text-on-surface-variant font-label-caps mb-2">Specializations</p>
                  <div className="flex flex-wrap gap-2">
                    {data.artisan.specialization.map((s: string) => (
                      <span key={s} className="px-2 py-1 bg-surface-container-high border border-outline-variant text-on-surface text-xs rounded uppercase font-bold tracking-wider">{s}</span>
                    ))}
                  </div>
                </div>
              </div>
            </section>

            {/* Workload Management */}
            <section className="bg-surface-container-low border border-outline-variant rounded-xl p-6">
              <h4 className="font-headline-sm text-secondary mb-4">Workload Capacity</h4>
              <div className="space-y-4">
                <div className="flex justify-between items-end">
                  <p className="font-body-md text-on-surface-variant">Active Orders</p>
                  <p className="font-mono text-2xl text-on-surface">{data.artisan.activeOrders} <span className="text-lg text-on-surface-variant">/ {data.artisan.dailyCapacity}</span></p>
                </div>
                {/* Progress Bar */}
                <div className="w-full h-3 bg-surface-container-highest rounded-full overflow-hidden">
                  <div 
                    className={`h-full rounded-full ${data.artisan.activeOrders >= data.artisan.dailyCapacity ? 'bg-error' : 'bg-primary'}`}
                    style={{ width: `${Math.min((data.artisan.activeOrders / data.artisan.dailyCapacity) * 100, 100)}%` }}
                  />
                </div>
                <p className="text-xs text-on-surface-variant text-right">Available Capacity: {Math.max(0, data.artisan.dailyCapacity - data.artisan.activeOrders)}</p>
              </div>
            </section>

            {/* Current Assignments */}
            <section>
              <h4 className="font-headline-sm text-secondary border-b border-outline-variant pb-2 mb-4">Current Assignments</h4>
              {data.activeAssignments.length === 0 ? (
                <p className="text-on-surface-variant text-center py-4">No active assignments.</p>
              ) : (
                <div className="space-y-4">
                  {data.activeAssignments.map((assignment: any) => {
                    const order = assignment.orderId;
                    if (!order) return null;
                    const currentStageIndex = PRODUCTION_STAGES.indexOf(order.productionStage || 'assigned');
                    
                    return (
                      <div key={assignment._id} className="bg-surface-container-low border border-outline-variant rounded-xl p-4">
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <p className="font-mono text-primary text-sm font-bold">{order.orderId}</p>
                            <p className="font-body-md text-on-surface mt-1">{order.items?.[0]?.product?.name || 'Custom Product'}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-xs text-on-surface-variant">Expected Delivery</p>
                            <p className="font-mono text-sm text-error">{order.estimatedDelivery ? new Date(order.estimatedDelivery).toLocaleDateString() : 'TBD'}</p>
                          </div>
                        </div>

                        {/* Progress Tracker */}
                        <div className="mt-4">
                          <div className="flex justify-between mb-1">
                            <span className="text-xs font-label-caps text-on-surface-variant uppercase tracking-wider">Production Progress</span>
                            <span className="text-xs font-mono text-primary">{Math.round(((currentStageIndex + 1) / PRODUCTION_STAGES.length) * 100)}%</span>
                          </div>
                          <div className="flex gap-1 h-2 mb-2">
                            {PRODUCTION_STAGES.map((stage, idx) => (
                              <div 
                                key={stage} 
                                className={`flex-1 rounded-full ${idx <= currentStageIndex ? 'bg-primary' : 'bg-surface-container-highest'}`}
                                title={stage.replace('_', ' ')}
                              />
                            ))}
                          </div>
                          
                          {/* Stage Controls */}
                          <div className="flex items-center justify-between mt-4 p-3 bg-surface-container-highest rounded-lg">
                            <p className="text-sm font-bold text-on-surface uppercase tracking-wider">
                              {(order.productionStage || 'assigned').replace('_', ' ')}
                            </p>
                            {currentStageIndex < PRODUCTION_STAGES.length - 1 && (
                              <button 
                                onClick={() => handleUpdateStage(order._id, PRODUCTION_STAGES[currentStageIndex + 1])}
                                className="px-3 py-1 bg-primary text-on-primary rounded text-xs font-label-caps hover:bg-primary/90 transition-colors cursor-pointer"
                              >
                                NEXT STAGE
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </section>

            {data.artisan.bankDetails && (
              <section className="bg-surface-container-lowest border border-outline-variant rounded-xl p-6">
                <h4 className="font-headline-sm text-secondary mb-4">Bank Details</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-on-surface-variant font-label-caps mb-1">Bank Name</p>
                    <p className="text-sm text-on-surface font-semibold">{data.artisan.bankDetails.bankName || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-xs text-on-surface-variant font-label-caps mb-1">Account Name</p>
                    <p className="text-sm text-on-surface font-semibold">{data.artisan.bankDetails.accountName || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-xs text-on-surface-variant font-label-caps mb-1">Account Number</p>
                    <p className="text-sm text-on-surface font-mono font-bold">{data.artisan.bankDetails.accountNumber || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-xs text-on-surface-variant font-label-caps mb-1">IFSC Code</p>
                    <p className="text-sm text-on-surface font-mono font-bold">{data.artisan.bankDetails.ifscCode || 'N/A'}</p>
                  </div>
                </div>
              </section>
            )}

          </div>
        )}
      </div>
    </>
  );
};

export default ArtisanProfileDrawer;
