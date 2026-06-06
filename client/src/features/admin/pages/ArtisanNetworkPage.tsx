import { useState, useEffect } from 'react';
import api from '../../../shared/services/api';
import AdminSidebar from '../../../shared/components/AdminSidebar';
import { AdminHeader } from '../components/AdminHeader';
import ArtisanProfileDrawer from '../components/ArtisanProfileDrawer';
import AddArtisanModal from '../components/AddArtisanModal';

const ArtisanNetworkPage = () => {
  const [stats, setStats] = useState<any>(null);
  const [artisans, setArtisans] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [sortOption, setSortOption] = useState('highest_rated');
  const [selectedArtisanId, setSelectedArtisanId] = useState<string | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [artisanToEdit, setArtisanToEdit] = useState<any>(null);

  useEffect(() => {
    fetchStats();
  }, []);

  useEffect(() => {
    fetchArtisans();
  }, [searchTerm, statusFilter, sortOption]);

  const fetchStats = async () => {
    try {
      const res = await api.get('/artisans/stats');
      if (res.data?.success) {
        setStats(res.data.data);
      }
    } catch (err) {
      console.error('Failed to fetch artisan stats', err);
    }
  };

  const fetchArtisans = async () => {
    try {
      setLoading(true);
      const res = await api.get('/artisans', {
        params: { search: searchTerm, status: statusFilter, sort: sortOption }
      });
      if (res.data?.success) {
        setArtisans(res.data.data.artisans || []);
      }
    } catch (err) {
      console.error('Failed to fetch artisans', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteArtisan = async (id: string, name: string) => {
    if (window.confirm(`Are you sure you want to delete ${name}?`)) {
      try {
        await api.delete(`/artisans/${id}`);
        fetchArtisans();
        fetchStats();
      } catch (err) {
        console.error('Failed to delete artisan', err);
      }
    }
  };

  return (
    <div className="min-h-screen bg-surface flex">
      <AdminSidebar />
      <main className="flex-1 ml-64 p-8">
        <header className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="font-display-lg text-4xl text-primary font-bold mb-2 tracking-tight">Artisan Network</h1>
            <p className="font-body-md text-on-surface-variant text-lg">Manage artisans, workloads, and production progress</p>
          </div>
          <button onClick={() => { setArtisanToEdit(null); setIsAddModalOpen(true); }} className="flex items-center gap-2 bg-primary text-on-primary px-6 py-3 rounded hover:bg-primary/90 transition-colors font-label-caps cursor-pointer">
            <span className="material-symbols-outlined">add</span> ADD NEW ARTISAN
          </button>
        </header>

        {/* Dashboard Stats */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-6 mb-8">
            {[
              { label: 'Total Artisans', value: stats.totalArtisans, icon: 'groups' },
              { label: 'Active Artisans', value: stats.activeArtisans, icon: 'engineering', color: 'text-secondary' },
              { label: 'In Production', value: stats.productsInProduction, icon: 'precision_manufacturing', color: 'text-primary' },
              { label: 'Total Payouts', value: `₹${stats.totalPayoutsThisMonth.toLocaleString()}`, icon: 'payments', color: 'text-secondary' },
              { label: 'Delayed', value: stats.delayedProductions, icon: 'warning', color: 'text-error' },
            ].map((stat, idx) => (
              <div key={idx} className="bg-surface-container-low border border-outline-variant rounded-xl p-5 hover:border-primary/30 transition-colors">
                <div className="flex items-center justify-between mb-3">
                  <span className={`material-symbols-outlined ${stat.color || 'text-on-surface-variant'}`}>{stat.icon}</span>
                </div>
                <h3 className="font-headline-sm text-2xl text-on-surface font-bold mb-1">{stat.value}</h3>
                <p className="font-label-sm text-xs text-on-surface-variant uppercase tracking-wider">{stat.label}</p>
              </div>
            ))}
          </div>
        )}

        {/* Filters */}
        <div className="flex flex-wrap gap-4 mb-6 bg-surface-container-lowest p-4 rounded-xl border border-outline-variant">
          <div className="flex-1 min-w-[300px] relative">
            <span className="material-symbols-outlined absolute left-3 top-3 text-on-surface-variant">search</span>
            <input 
              type="text" 
              placeholder="Search by Artisan Name, ID, Specialization..." 
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full bg-surface border border-outline-variant rounded-lg py-3 pl-11 pr-4 text-on-surface focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
            />
          </div>
          <div className="flex gap-4">
            <select 
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value)}
              className="bg-surface border border-outline-variant rounded-lg px-4 py-3 text-on-surface focus:border-primary outline-none"
            >
              <option value="">All Statuses</option>
              <option value="available">Available</option>
              <option value="busy">Busy</option>
              <option value="on_leave">On Leave</option>
            </select>
            <select 
              value={sortOption}
              onChange={e => setSortOption(e.target.value)}
              className="bg-surface border border-outline-variant rounded-lg px-4 py-3 text-on-surface focus:border-primary outline-none"
            >
              <option value="highest_rated">Experience</option>
              <option value="lowest_workload">Lowest Workload</option>
              <option value="most_experienced">Most Experienced</option>
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="bg-surface-container-lowest border border-outline-variant rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-outline-variant bg-surface-container-low">
                  <th className="py-4 px-6 font-label-caps text-xs text-on-surface-variant font-semibold tracking-wider">Artisan</th>
                  <th className="py-4 px-6 font-label-caps text-xs text-on-surface-variant font-semibold tracking-wider">Specialization</th>
                  <th className="py-4 px-6 font-label-caps text-xs text-on-surface-variant font-semibold tracking-wider text-center">Active Orders</th>
                  <th className="py-4 px-6 font-label-caps text-xs text-on-surface-variant font-semibold tracking-wider text-center">Completed</th>
                  <th className="py-4 px-6 font-label-caps text-xs text-on-surface-variant font-semibold tracking-wider">Earnings</th>
                  <th className="py-4 px-6 font-label-caps text-xs text-on-surface-variant font-semibold tracking-wider text-center">Status</th>
                  <th className="py-4 px-6 font-label-caps text-xs text-on-surface-variant font-semibold tracking-wider text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/50">
                {loading ? (
                  <tr>
                    <td colSpan={7} className="py-8 text-center text-on-surface-variant">Loading artisans...</td>
                  </tr>
                ) : artisans.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-24 text-center">
                      <span className="material-symbols-outlined text-6xl text-on-surface-variant mb-4">engineering</span>
                      <h3 className="font-headline-sm text-2xl text-on-surface font-bold mb-2">No artisans have been added yet.</h3>
                      <p className="font-body-md text-on-surface-variant mb-6">Build your artisan network to start assigning orders.</p>
                      <button onClick={() => { setArtisanToEdit(null); setIsAddModalOpen(true); }} className="bg-primary text-on-primary px-8 py-3 rounded font-label-caps hover:bg-primary/90 transition-colors inline-flex items-center gap-2">
                        <span className="material-symbols-outlined">add</span> ADD FIRST ARTISAN
                      </button>
                    </td>
                  </tr>
                ) : (
                  artisans.map((artisan) => (
                    <tr key={artisan._id} className="hover:bg-surface-container-low/50 transition-colors">
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-surface-container-high border border-outline-variant flex items-center justify-center font-bold text-primary overflow-hidden shrink-0">
                            {artisan.image ? (
                              <img src={artisan.image} alt={artisan.name} className="w-full h-full object-cover" onError={(e) => { e.currentTarget.src = '/assets/default-artisan.webp'; }} />
                            ) : (
                              <img src="/assets/default-artisan.webp" alt="Default Artisan" className="w-full h-full object-cover" />
                            )}
                          </div>
                          <div>
                            <p className="font-bold text-on-surface">{artisan.name}</p>
                            <p className="text-xs text-on-surface-variant font-mono">{artisan.artisanId}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex flex-wrap gap-1">
                          {artisan.specialization.slice(0, 2).map((s: string) => (
                            <span key={s} className="px-2 py-1 bg-secondary-container/50 text-on-secondary-container text-[10px] rounded uppercase font-bold tracking-wider">{s}</span>
                          ))}
                          {artisan.specialization.length > 2 && <span className="px-2 py-1 bg-surface-container-high text-[10px] rounded">+{artisan.specialization.length - 2}</span>}
                        </div>
                      </td>
                      <td className="py-4 px-6 text-center">
                        <span className="font-mono text-on-surface">{artisan.activeOrders} <span className="text-on-surface-variant text-sm">/ {artisan.dailyCapacity}</span></span>
                      </td>
                      <td className="py-4 px-6 text-center font-mono text-on-surface">{artisan.completedOrders}</td>
                      <td className="py-4 px-6 font-mono text-secondary">₹{artisan.earnings?.toLocaleString() || 0}</td>
                      <td className="py-4 px-6 text-center">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                          artisan.status === 'available' ? 'bg-primary-container text-on-primary-container' :
                          artisan.status === 'busy' ? 'bg-secondary-container text-on-secondary-container' :
                          'bg-surface-container-highest text-on-surface-variant'
                        }`}>
                          {artisan.status.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-right">
                        <div className="flex justify-end gap-2">
                          <button 
                            onClick={() => setSelectedArtisanId(artisan._id)}
                            className="p-2 bg-surface-container-high text-on-surface rounded hover:bg-primary hover:text-on-primary transition-colors tooltip-trigger relative group"
                          >
                            <span className="material-symbols-outlined text-[18px]">visibility</span>
                            <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-surface-container-highest text-on-surface text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10 whitespace-nowrap">View Profile</span>
                          </button>
                          <button 
                            onClick={() => { setArtisanToEdit(artisan); setIsAddModalOpen(true); }}
                            className="p-2 bg-surface-container-high text-on-surface rounded hover:bg-secondary hover:text-on-secondary transition-colors tooltip-trigger relative group"
                          >
                            <span className="material-symbols-outlined text-[18px]">edit</span>
                            <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-surface-container-highest text-on-surface text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10 whitespace-nowrap">Edit Artisan</span>
                          </button>
                          <button 
                            onClick={() => handleDeleteArtisan(artisan._id, artisan.name)}
                            className="p-2 bg-surface-container-high text-error rounded hover:bg-error hover:text-white transition-colors tooltip-trigger relative group"
                          >
                            <span className="material-symbols-outlined text-[18px]">delete</span>
                            <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-surface-container-highest text-on-surface text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10 whitespace-nowrap">Delete Artisan</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* Artisan Profile Drawer */}
      <ArtisanProfileDrawer 
        artisanId={selectedArtisanId} 
        isOpen={!!selectedArtisanId} 
        onClose={() => setSelectedArtisanId(null)}
        onUpdate={fetchArtisans}
      />

      {/* Add / Edit Artisan Modal */}
      <AddArtisanModal 
        isOpen={isAddModalOpen} 
        onClose={() => {
          setIsAddModalOpen(false);
          setArtisanToEdit(null);
        }} 
        onSuccess={() => {
          fetchArtisans();
          fetchStats();
        }}
        artisan={artisanToEdit}
      />
    </div>
  );
};

export default ArtisanNetworkPage;
