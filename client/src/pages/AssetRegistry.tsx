import React, { useState } from 'react';
import { trpc } from '../trpc';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircle, Plus, Wrench, CheckCircle, Database, X } from 'lucide-react';

export default function AssetRegistry() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedAsset, setSelectedAsset] = useState<any>(null);
  const [formData, setFormData] = useState({ name: '', type: 'Turbine', location: '', status: 'operational' });
  
  const utils = trpc.useUtils();
  const { data: assets, isLoading, error } = trpc.assets.list.useQuery();
  
  const createMutation = trpc.assets.create.useMutation({
    onSuccess: () => {
      utils.assets.list.invalidate(); // Refresh the table
      setIsModalOpen(false);
      setFormData({ name: '', type: 'Turbine', location: '', status: 'operational' });
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createMutation.mutate(formData);
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto relative">
      <div className="flex justify-between items-center bg-gray-900/40 p-6 rounded-2xl border border-gray-800 backdrop-blur-sm">
        <div className="flex items-center space-x-4">
          <div className="p-3 bg-accent/20 rounded-xl border border-accent/30 shadow-[0_0_15px_rgba(6,182,212,0.2)]">
            <Database className="w-8 h-8 text-accent" />
          </div>
          <div>
            <h1 className="text-3xl font-mono font-bold text-white tracking-wide">Asset Registry</h1>
            <p className="text-gray-400 mt-1 text-sm">Monitor and manage all active industrial equipment.</p>
          </div>
        </div>
        <motion.button 
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsModalOpen(true)}
          className="bg-accent text-white px-5 py-2.5 rounded-lg font-medium flex items-center space-x-2 shadow-[0_0_20px_rgba(6,182,212,0.4)] hover:shadow-[0_0_25px_rgba(6,182,212,0.6)] transition-all cursor-pointer"
        >
          <Plus className="w-5 h-5" />
          <span>Add Asset</span>
        </motion.button>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="relative w-16 h-16">
            <div className="absolute inset-0 rounded-full border-t-2 border-accent animate-spin"></div>
            <div className="absolute inset-2 rounded-full border-b-2 border-blue-500 animate-spin" style={{ animationDirection: 'reverse' }}></div>
          </div>
        </div>
      ) : error ? (
        <div className="bg-red-900/30 text-red-400 p-4 rounded-lg border border-red-900/50">
          Error loading assets: {error.message}
        </div>
      ) : (
        <div className="glass-card rounded-xl overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-800 text-sm font-medium text-gray-400 bg-gray-900/50">
                <th className="py-4 px-6">Name</th>
                <th className="py-4 px-6">Type</th>
                <th className="py-4 px-6">Location</th>
                <th className="py-4 px-6">Status</th>
              </tr>
            </thead>
            <tbody>
              {assets?.length === 0 ? (
                <tr>
                  <td colSpan={4} className="py-12 text-center text-gray-500">
                    No assets found. Click 'Add Asset' to create one.
                  </td>
                </tr>
              ) : (
                assets?.map((asset, i) => (
                  <motion.tr 
                    key={asset.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    onClick={() => setSelectedAsset(asset)}
                    className="border-b border-gray-800/50 hover:bg-gray-800/40 transition-colors cursor-pointer group"
                  >
                    <td className="py-5 px-6 font-medium text-gray-200 group-hover:text-accent transition-colors">
                      {asset.name}
                    </td>
                    <td className="py-5 px-6 text-gray-400">{asset.type}</td>
                    <td className="py-5 px-6 text-gray-400">{asset.location || 'N/A'}</td>
                    <td className="py-5 px-6">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border ${
                        asset.status === 'operational' ? 'bg-green-500/10 text-green-400 border-green-500/30 shadow-[0_0_10px_rgba(16,185,129,0.2)]' :
                        asset.status === 'maintenance' ? 'bg-amber-500/10 text-amber-400 border-amber-500/30 shadow-[0_0_10px_rgba(245,158,11,0.2)]' :
                        'bg-red-500/10 text-red-400 border-red-500/30 shadow-[0_0_10px_rgba(239,68,68,0.2)]'
                      }`}>
                        {asset.status === 'operational' && <CheckCircle className="w-3.5 h-3.5 mr-1.5" />}
                        {asset.status === 'maintenance' && <Wrench className="w-3.5 h-3.5 mr-1.5" />}
                        {asset.status === 'offline' && <AlertCircle className="w-3.5 h-3.5 mr-1.5" />}
                        {asset.status}
                      </span>
                    </td>
                  </motion.tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Add Asset Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-gray-900 border border-gray-800 p-8 rounded-2xl shadow-2xl w-full max-w-md relative"
            >
              <button 
                onClick={() => setIsModalOpen(false)}
                className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
              <h2 className="text-2xl font-bold font-mono text-white mb-6">Add New Asset</h2>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Asset Name</label>
                  <input 
                    required 
                    value={formData.name}
                    onChange={e => setFormData({...formData, name: e.target.value})}
                    type="text" 
                    className="w-full bg-gray-800/50 border border-gray-700 text-white rounded-lg px-4 py-2.5 focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent"
                    placeholder="e.g. Turbine Generator B"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Equipment Type</label>
                  <select 
                    value={formData.type}
                    onChange={e => setFormData({...formData, type: e.target.value})}
                    className="w-full bg-gray-800/50 border border-gray-700 text-white rounded-lg px-4 py-2.5 focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent"
                  >
                    <option value="Turbine">Turbine</option>
                    <option value="Hydraulic Press">Hydraulic Press</option>
                    <option value="Conveyor Belt">Conveyor Belt</option>
                    <option value="HVAC">HVAC System</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Location</label>
                  <input 
                    value={formData.location}
                    onChange={e => setFormData({...formData, location: e.target.value})}
                    type="text" 
                    className="w-full bg-gray-800/50 border border-gray-700 text-white rounded-lg px-4 py-2.5 focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent"
                    placeholder="e.g. Sector 4, Bay 12"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Initial Status</label>
                  <select 
                    value={formData.status}
                    onChange={e => setFormData({...formData, status: e.target.value})}
                    className="w-full bg-gray-800/50 border border-gray-700 text-white rounded-lg px-4 py-2.5 focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent"
                  >
                    <option value="operational">Operational</option>
                    <option value="maintenance">Maintenance</option>
                    <option value="offline">Offline</option>
                  </select>
                </div>
                <div className="pt-4 flex space-x-3">
                  <button 
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="flex-1 px-4 py-2.5 rounded-lg font-medium bg-gray-800 text-gray-300 hover:bg-gray-700 hover:text-white transition-colors"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    disabled={createMutation.isPending}
                    className="flex-1 px-4 py-2.5 rounded-lg font-medium bg-accent text-white shadow-[0_0_15px_rgba(6,182,212,0.4)] hover:bg-accentHover hover:shadow-[0_0_20px_rgba(6,182,212,0.6)] transition-all disabled:opacity-50 flex justify-center"
                  >
                    {createMutation.isPending ? (
                      <div className="w-5 h-5 rounded-full border-t-2 border-white animate-spin"></div>
                    ) : (
                      'Save Asset'
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Asset Details Modal */}
      <AnimatePresence>
        {selectedAsset && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-gray-900 border border-gray-800 p-8 rounded-2xl shadow-2xl w-full max-w-lg relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-64 h-64 bg-accent/5 rounded-full blur-3xl"></div>
              
              <button 
                onClick={() => setSelectedAsset(null)}
                className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors z-10"
              >
                <X className="w-6 h-6" />
              </button>
              
              <div className="relative z-10">
                <div className="flex items-center space-x-4 mb-6">
                  <div className="p-3 bg-gray-800 rounded-xl border border-gray-700 shadow-inner">
                    <Database className="w-8 h-8 text-accent" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold font-mono text-white">{selectedAsset.name}</h2>
                    <p className="text-sm font-bold text-gray-500 uppercase tracking-widest">{selectedAsset.type}</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="bg-gray-950 p-4 rounded-xl border border-gray-800">
                    <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Location & Identification</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <span className="text-gray-400 text-sm block">Facility Location</span>
                        <span className="text-white font-medium">{selectedAsset.location || 'N/A'}</span>
                      </div>
                      <div>
                        <span className="text-gray-400 text-sm block">System ID</span>
                        <span className="text-white font-medium font-mono text-sm">{selectedAsset.id}</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-950 p-4 rounded-xl border border-gray-800">
                    <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Current Status</h3>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400 text-sm">Operational Health</span>
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border ${
                        selectedAsset.status === 'operational' ? 'bg-green-500/10 text-green-400 border-green-500/30' :
                        selectedAsset.status === 'maintenance' ? 'bg-amber-500/10 text-amber-400 border-amber-500/30' :
                        'bg-red-500/10 text-red-400 border-red-500/30'
                      }`}>
                        {selectedAsset.status === 'operational' && <CheckCircle className="w-3.5 h-3.5 mr-1.5" />}
                        {selectedAsset.status === 'maintenance' && <Wrench className="w-3.5 h-3.5 mr-1.5" />}
                        {selectedAsset.status === 'offline' && <AlertCircle className="w-3.5 h-3.5 mr-1.5" />}
                        {selectedAsset.status}
                      </span>
                    </div>
                  </div>

                  <div className="bg-gray-950 p-4 rounded-xl border border-gray-800">
                    <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Historical Data</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <span className="text-gray-400 text-sm block">Last Indexed</span>
                        <span className="text-white font-medium text-sm">Today</span>
                      </div>
                      <div>
                        <span className="text-gray-400 text-sm block">Active Alerts</span>
                        <span className="text-white font-medium text-sm">{selectedAsset.status === 'operational' ? '0' : '1'}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-6 flex justify-end space-x-3">
                  <button 
                    onClick={() => setSelectedAsset(null)}
                    className="px-6 py-2.5 rounded-lg font-medium bg-gray-800 text-white hover:bg-gray-700 transition-colors"
                  >
                    Close Details
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
