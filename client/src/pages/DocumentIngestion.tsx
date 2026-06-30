import React, { useRef, useState } from 'react';
import { UploadCloud, File, CheckCircle, RefreshCw } from 'lucide-react';
import { motion } from 'framer-motion';
import { trpc } from '../trpc';

export default function DocumentIngestion() {
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const utils = trpc.useUtils();
  const { data: documents, isLoading } = trpc.documents.list.useQuery();

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const formData = new FormData();
    formData.append('document', file);

    try {
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:7860';
      const response = await fetch(`${API_URL}/upload`, {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        utils.documents.list.invalidate(); // Refresh the list
      } else {
        alert('Upload failed. Please try again.');
      }
    } catch (error) {
      alert('Network error during upload.');
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      <div className="bg-gray-900/40 p-6 rounded-2xl border border-gray-800 backdrop-blur-sm">
        <h1 className="text-3xl font-mono font-bold text-white tracking-wide">Document Ingestion</h1>
        <p className="text-gray-400 mt-2 text-sm">Upload technical manuals, SOPs, and maintenance logs. Files are automatically vectorized for the Knowledge Graph and LLM RAG pipeline.</p>
      </div>

      <motion.div 
        whileHover={{ scale: 1.01 }}
        onClick={() => fileInputRef.current?.click()}
        className={`relative border-2 border-dashed border-gray-700 hover:border-accent rounded-2xl bg-gray-900/30 p-16 text-center hover:bg-accent/5 transition-all cursor-pointer group shadow-lg ${isUploading ? 'opacity-50 pointer-events-none' : ''}`}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-accent/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl"></div>
        <div className="relative z-10 flex flex-col items-center">
          <div className="p-4 bg-gray-800/80 rounded-full group-hover:bg-accent/20 transition-colors mb-6 shadow-xl">
            {isUploading ? (
               <RefreshCw className="w-12 h-12 text-accent animate-spin" />
            ) : (
               <UploadCloud className="w-12 h-12 text-gray-400 group-hover:text-accent transition-colors" />
            )}
          </div>
          <h3 className="text-xl font-bold text-white mb-2">
            {isUploading ? 'Uploading and Vectorizing...' : 'Drag and drop documents here'}
          </h3>
          <p className="text-sm text-gray-400 max-w-md">Supports PDF, DOCX, and TXT files. Maximum file size is 50MB per document.</p>
          <button 
            type="button"
            className="mt-8 bg-gray-800 border border-gray-700 text-gray-300 px-6 py-2.5 rounded-lg font-medium group-hover:bg-accent group-hover:border-accent group-hover:text-white transition-all shadow-md"
          >
            {isUploading ? 'Processing...' : 'Browse Files'}
          </button>
          
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileChange} 
            className="hidden" 
            accept=".pdf,.doc,.docx,.txt"
          />
        </div>
      </motion.div>

      <div className="mt-8">
        <h2 className="text-xl font-bold font-mono text-white mb-6 flex items-center">
          <span className="bg-accent/20 text-accent p-1.5 rounded-md mr-3 border border-accent/30"><File className="w-5 h-5"/></span>
          Recent Uploads & Indexing Status
        </h2>
        {isLoading ? (
          <div className="flex justify-center p-12">
            <div className="relative w-12 h-12">
              <div className="absolute inset-0 rounded-full border-t-2 border-accent animate-spin"></div>
            </div>
          </div>
        ) : (
          <div className="glass-card rounded-xl overflow-hidden">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-gray-800 text-sm font-medium text-gray-400 bg-gray-900/50">
                  <th className="py-4 px-6">Filename</th>
                  <th className="py-4 px-6">Format</th>
                  <th className="py-4 px-6">Vectorization Status</th>
                </tr>
              </thead>
              <tbody>
                {documents?.length === 0 ? (
                  <tr><td colSpan={3} className="py-12 text-center text-gray-500">No documents found in the storage bucket.</td></tr>
                ) : (
                  documents?.map((doc, i) => (
                    <motion.tr 
                      key={doc.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.1 }}
                      className="border-b border-gray-800/50 hover:bg-gray-800/40 transition-colors"
                    >
                      <td className="py-4 px-6 flex items-center space-x-3">
                        <File className="w-5 h-5 text-accent/70" />
                        <span className="font-medium text-gray-200">{doc.filename}</span>
                      </td>
                      <td className="py-4 px-6">
                         <span className="px-2.5 py-1 rounded bg-gray-800 text-gray-300 text-xs font-bold uppercase border border-gray-700">{doc.format}</span>
                      </td>
                      <td className="py-4 px-6">
                        {doc.status === 'indexed' ? (
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-green-500/10 text-green-400 border border-green-500/30">
                            <CheckCircle className="w-3.5 h-3.5 mr-1.5" /> Ready for AI
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-blue-500/10 text-blue-400 border border-blue-500/30">
                            <RefreshCw className="w-3.5 h-3.5 mr-1.5 animate-spin" /> Extracting Embeddings
                          </span>
                        )}
                      </td>
                    </motion.tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
