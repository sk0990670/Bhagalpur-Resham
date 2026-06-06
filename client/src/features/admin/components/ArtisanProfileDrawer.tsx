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

interface AssignmentCardProps {
  assignment: any;
  fetchArtisanDetails: () => void;
}

const AssignmentCard = ({ assignment, fetchArtisanDetails }: AssignmentCardProps) => {
  const [localCharge, setLocalCharge] = useState(assignment.artisanCharge || 0);
  const [localPaid, setLocalPaid] = useState(assignment.amountPaid || 0);
  const order = assignment.orderId;
  if (!order) return null;
  const currentStageIndex = PRODUCTION_STAGES.indexOf(order.productionStage || 'assigned');
  
  const handlePaymentUpdate = async (field: 'artisanCharge' | 'amountPaid', value: string) => {
    const numVal = Number(value);
    if (isNaN(numVal)) return;
    if (field === 'artisanCharge') setLocalCharge(numVal);
    if (field === 'amountPaid') setLocalPaid(numVal);
    
    try {
      await api.patch(`/artisans/assignments/${assignment._id}/payment`, {
        [field]: numVal
      });
      fetchArtisanDetails();
    } catch (err) {
      console.error('Failed to update payment', err);
    }
  };

  const handleMarkPaid = async () => {
    try {
      const chargeToPay = localCharge > 0 ? localCharge : assignment.artisanCharge;
      await api.patch(`/artisans/assignments/${assignment._id}/payment`, {
        amountPaid: chargeToPay
      });
      setLocalPaid(chargeToPay);
      fetchArtisanDetails();
    } catch (err) {
      console.error('Failed to update payment', err);
    }
  };

  const handleUpdateStage = async (orderId: string, stage: string) => {
    try {
      await api.patch(`/orders/${orderId}/update-production-stage`, { stage });
      fetchArtisanDetails();
    } catch (err) {
      console.error('Failed to update stage', err);
    }
  };

  const displayCharge = localCharge;
  const displayPaid = localPaid;
  const remaining = displayCharge - displayPaid;
  const isPaymentCompleted = displayPaid >= displayCharge && displayCharge > 0;

  const paymentStatus = isPaymentCompleted 
    ? 'PAID IN FULL' 
    : (displayPaid > 0 ? 'PARTIALLY PAID' : 'NOT SET');

  return (
    <div className="bg-surface-container-low border border-outline-variant rounded-xl p-4">
      <div className="flex justify-between items-start mb-4 border-b border-outline-variant pb-4">
        <div>
          <p className="font-mono text-primary text-sm font-bold">{order.orderId}</p>
          <p className="font-body-md text-on-surface mt-1">{order.items?.[0]?.name || 'Unknown Product'} <span className="text-on-surface-variant text-sm">({order.items?.[0]?.sku})</span></p>
          <p className="text-xs text-on-surface-variant mt-1">Assigned: {new Date(assignment.assignedDate).toLocaleDateString()}</p>
        </div>
        <div className="text-right">
          <p className="text-xs text-on-surface-variant">Expected Delivery</p>
          <p className="font-mono text-sm text-error">{order.estimatedDelivery ? new Date(order.estimatedDelivery).toLocaleDateString() : 'TBD'}</p>
          <div className="mt-2">
            <span className={`px-2 py-1 text-[10px] rounded uppercase font-bold tracking-wider ${
              isPaymentCompleted ? 'bg-primary-container text-on-primary-container' :
              displayPaid > 0 ? 'bg-secondary-container text-on-secondary-container' :
              'bg-surface-container-highest text-on-surface-variant'
            }`}>
              {paymentStatus}
            </span>
          </div>
        </div>
      </div>

      {/* Payment Tracker */}
      <div className="grid grid-cols-3 gap-4 mb-4">
        <div>
          <label className="text-[10px] text-on-surface-variant font-label-caps uppercase tracking-wider block mb-1">Artisan Charge (₹)</label>
          <input 
            type="number" 
            className="w-full bg-surface border border-outline-variant rounded p-2 text-sm font-mono focus:border-primary outline-none"
            value={localCharge || ''}
            onChange={(e) => setLocalCharge(Number(e.target.value))}
            onBlur={(e) => handlePaymentUpdate('artisanCharge', e.target.value)}
          />
        </div>
        <div>
          <label className="text-[10px] text-on-surface-variant font-label-caps uppercase tracking-wider block mb-1">Amount Paid (₹)</label>
          <input 
            type="number" 
            className="w-full bg-surface border border-outline-variant rounded p-2 text-sm font-mono focus:border-primary outline-none"
            value={localPaid || ''}
            onChange={(e) => setLocalPaid(Number(e.target.value))}
            onBlur={(e) => handlePaymentUpdate('amountPaid', e.target.value)}
          />
        </div>
        <div className="flex flex-col justify-end">
          <p className="text-[10px] text-on-surface-variant font-label-caps uppercase tracking-wider mb-1">Remaining</p>
          <p className="text-sm font-mono text-error font-bold pb-2">₹{remaining || 0}</p>
        </div>
      </div>

      {(!isPaymentCompleted && displayCharge > 0) && (
        <div className="mb-4 flex justify-end">
          <button onClick={handleMarkPaid} className="px-3 py-1 bg-surface-container-highest border border-outline-variant text-on-surface rounded text-xs font-label-caps hover:bg-secondary hover:text-on-secondary hover:border-secondary transition-colors cursor-pointer">
            MARK PAYMENT COMPLETE
          </button>
        </div>
      )}

      {/* Progress Tracker */}
      <div className="mt-4 border-t border-outline-variant pt-4">
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
};


const ArtisanProfileDrawer = ({ artisanId, isOpen, onClose, onUpdate }: ArtisanProfileDrawerProps) => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen && artisanId) {
      fetchArtisanDetails();
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

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-surface/50 backdrop-blur-sm z-40 transition-opacity" onClick={onClose} />
      <div className={`fixed inset-y-0 right-0 w-full max-w-2xl bg-surface shadow-2xl z-50 transform transition-transform duration-300 flex flex-col border-l border-outline-variant ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        
        <div className="flex justify-between items-center p-6 border-b border-outline-variant bg-surface-container-lowest">
          <h2 className="font-headline-md text-primary font-bold">Artisan Profile</h2>
          <button onClick={onClose} className="p-2 hover:bg-surface-container rounded-full text-on-surface-variant hover:text-on-surface transition-colors">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-8 bg-surface-container-lowest relative">
          {loading && (
            <div className="absolute inset-0 bg-surface/50 backdrop-blur-sm z-10 flex items-center justify-center">
              <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            </div>
          )}

          {data && (
            <>
              {/* Profile Header */}
              <section className="flex gap-6 items-start">
                <div className="w-32 h-32 rounded-xl bg-surface-container-high border-2 border-primary flex items-center justify-center font-bold text-primary text-4xl overflow-hidden shrink-0 shadow-lg">
                  {data.artisan.image ? (
                    <img src={data.artisan.image} alt={data.artisan.name} className="w-full h-full object-cover" onError={(e) => { e.currentTarget.src = '/assets/default-artisan.webp'; }} />
                  ) : (
                    data.artisan.name.charAt(0)
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-headline-lg text-primary text-3xl font-bold mb-1">{data.artisan.name}</h3>
                      <p className="text-secondary font-mono font-bold tracking-wider">{data.artisan.artisanId}</p>
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
                      <p className="text-xs text-on-surface-variant font-label-caps mb-1">Total Earnings</p>
                      <p className="text-sm text-secondary font-semibold flex items-center gap-1">
                        ₹{data.artisan.earnings?.toLocaleString() || 0}
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

              {/* Completed Assignments */}
              <section className="bg-surface-container-low border border-outline-variant rounded-xl p-6">
                <h4 className="font-headline-sm text-secondary mb-4">Performance Statistics</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-surface-container-highest rounded-lg text-center">
                    <p className="text-xs text-on-surface-variant font-label-caps mb-1">Total Assignments</p>
                    <p className="text-2xl font-mono text-on-surface">{data.allAssignments?.length || 0}</p>
                  </div>
                  <div className="p-4 bg-surface-container-highest rounded-lg text-center">
                    <p className="text-xs text-on-surface-variant font-label-caps mb-1">Completed</p>
                    <p className="text-2xl font-mono text-primary">{data.artisan.completedOrders}</p>
                  </div>
                </div>
              </section>

              {/* Current Assignments */}
              <section>
                <h4 className="font-headline-sm text-secondary border-b border-outline-variant pb-2 mb-4">Current Assignments</h4>
                {data.activeAssignments.length === 0 ? (
                  <p className="text-on-surface-variant text-center py-4">No active assignments.</p>
                ) : (
                <div className="space-y-4">
                  {data.activeAssignments.map((assignment: any) => (
                    <AssignmentCard 
                      key={assignment._id} 
                      assignment={assignment} 
                      fetchArtisanDetails={fetchArtisanDetails} 
                    />
                  ))}
                </div>
              )}
            </section>

            {/* Assignment History */}
            <section className="bg-surface-container-low border border-outline-variant rounded-xl overflow-hidden">
              <details className="group">
                <summary className="font-headline-sm text-secondary p-4 cursor-pointer hover:bg-surface-container-high transition-colors list-none flex justify-between items-center">
                  <span>Assigned Orders History ({data.allAssignments?.length || 0})</span>
                  <span className="material-symbols-outlined transform group-open:rotate-180 transition-transform">expand_more</span>
                </summary>
                <div className="p-4 border-t border-outline-variant space-y-3 bg-surface">
                  {data.allAssignments?.map((assignment: any) => (
                    <div key={assignment._id} className="text-sm border-b border-outline-variant/50 pb-3 last:border-0 last:pb-0">
                      <div className="flex justify-between mb-1">
                        <span className="font-mono font-bold text-primary">{assignment.orderId?.orderId || 'Unknown'}</span>
                        <span className="text-[10px] uppercase bg-surface-container-highest px-2 py-0.5 rounded font-bold tracking-wider">{assignment.currentStage?.replace('_', ' ')}</span>
                      </div>
                      <p className="text-on-surface-variant">{assignment.orderId?.items?.[0]?.name || 'Unknown Product'} <span className="text-xs">({assignment.orderId?.items?.[0]?.sku})</span></p>
                    </div>
                  ))}
                  {(!data.allAssignments || data.allAssignments.length === 0) && (
                    <p className="text-center text-sm text-on-surface-variant">No assignment history found.</p>
                  )}
                </div>
              </details>
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
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default ArtisanProfileDrawer;
