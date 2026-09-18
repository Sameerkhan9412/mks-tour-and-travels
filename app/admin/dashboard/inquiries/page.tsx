'use client';

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FolderOpen, Search, Save, Calendar, Phone, Mail, User, ShieldAlert, ArrowUpDown, ChevronDown, CheckCircle2 } from 'lucide-react';

interface InquiryData {
  _id: string;
  name: string;
  email: string;
  phoneNumber: string;
  destination: string;
  travelDate: string;
  budget: number;
  travelersCount: number;
  status: 'new' | 'contacted' | 'converted' | 'closed';
  notes: string;
  createdAt: string;
}

export default function InquiriesAdminPage() {
  const [inquiries, setInquiries] = useState<InquiryData[]>([]);
  const [filteredInquiries, setFilteredInquiries] = useState<InquiryData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Search & Filter
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // Detail panel states
  const [selectedInquiry, setSelectedInquiry] = useState<InquiryData | null>(null);
  const [editStatus, setEditStatus] = useState<'new' | 'contacted' | 'converted' | 'closed'>('new');
  const [editNotes, setEditNotes] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    fetchInquiries();
  }, []);

  const fetchInquiries = async () => {
    setIsLoading(true);
    try {
      const res = await axios.get('/api/inquiries');
      setInquiries(res.data.inquiries || []);
      setFilteredInquiries(res.data.inquiries || []);
    } catch (err) {
      console.error('Fetch inquiries admin error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Filter inquiries based on search term & status
  useEffect(() => {
    let result = [...inquiries];

    if (search.trim()) {
      const term = search.toLowerCase();
      result = result.filter(
        (inq) =>
          inq.name.toLowerCase().includes(term) ||
          inq.destination.toLowerCase().includes(term) ||
          inq.phoneNumber.includes(term)
      );
    }

    if (statusFilter !== 'all') {
      result = result.filter((inq) => inq.status === statusFilter);
    }

    setFilteredInquiries(result);
  }, [search, statusFilter, inquiries]);

  const handleSelectInquiry = (inq: InquiryData) => {
    setSelectedInquiry(inq);
    setEditStatus(inq.status);
    setEditNotes(inq.notes || '');
    setSuccessMsg('');
    setErrorMsg('');
  };

  const handleSaveStatus = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedInquiry) return;

    try {
      const res = await axios.put(`/api/inquiries/${selectedInquiry._id}`, {
        status: editStatus,
        notes: editNotes,
      });

      if (res.data.success) {
        setSuccessMsg('Status & notes updated successfully.');
        setSelectedInquiry(res.data.inquiry);
        // Refresh full list in state
        setInquiries(
          inquiries.map((inq) => (inq._id === selectedInquiry._id ? res.data.inquiry : inq))
        );
        setTimeout(() => setSuccessMsg(''), 3000);
      }
    } catch (err) {
      console.error('Update inquiry error:', err);
      setErrorMsg('Failed to save status updates.');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new':
        return 'bg-blue-50 text-blue-600 border-blue-100';
      case 'contacted':
        return 'bg-yellow-50 text-yellow-600 border-yellow-100';
      case 'converted':
        return 'bg-green-50 text-green-600 border-green-100';
      case 'closed':
        return 'bg-slate-100 text-slate-500 border-slate-200';
      default:
        return 'bg-slate-50 text-slate-600';
    }
  };

  if (isLoading) {
    return <div className="text-center py-12">Loading Inquiries Board...</div>;
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-200 pb-4">
        <div>
          <h1 className="text-2xl font-black text-slate-800 flex items-center gap-2">
            <FolderOpen className="w-6 h-6 text-primary-blue" />
            Inquiries Status Management
          </h1>
          <p className="text-xs text-slate-400 font-bold uppercase mt-1">
            Track customer travel requests and conversion rates
          </p>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 bg-white p-4 border border-slate-100 rounded-3xl shadow-sm items-center">
        <div className="sm:col-span-8 relative">
          <Search className="absolute left-3 top-3 w-4.5 h-4.5 text-slate-400" />
          <input
            type="text"
            placeholder="Search traveler by name, destination, phone..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-primary-blue text-slate-800"
          />
        </div>

        <div className="sm:col-span-4 flex items-center gap-2">
          <label className="text-xs font-bold text-slate-400 uppercase tracking-wider shrink-0">Status</label>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full px-4 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-primary-blue bg-white text-slate-700"
          >
            <option value="all">All Inquiries</option>
            <option value="new">New</option>
            <option value="contacted">Contacted</option>
            <option value="converted">Converted</option>
            <option value="closed">Closed</option>
          </select>
        </div>
      </div>

      {/* Main Board Split */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Inquiries List */}
        <div className="lg:col-span-7 bg-white border border-slate-100 rounded-3xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-55 border-b border-slate-100 text-xs font-bold text-slate-400 uppercase tracking-wider">
                  <th className="p-4 sm:p-5">Traveler</th>
                  <th className="p-4 sm:p-5">Destination</th>
                  <th className="p-4 sm:p-5">Travel Date</th>
                  <th className="p-4 sm:p-5">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {filteredInquiries.map((inq) => (
                  <tr
                    key={inq._id}
                    onClick={() => handleSelectInquiry(inq)}
                    className={`hover:bg-slate-50 cursor-pointer transition-colors ${
                      selectedInquiry?._id === inq._id ? 'bg-slate-50 border-l-4 border-primary-blue' : ''
                    }`}
                  >
                    <td className="p-4 sm:p-5">
                      <div className="flex flex-col">
                        <span className="font-bold text-slate-800">{inq.name}</span>
                        <span className="text-[10px] text-slate-400 font-semibold">{inq.phoneNumber}</span>
                      </div>
                    </td>
                    <td className="p-4 sm:p-5 text-slate-600 font-semibold truncate max-w-[150px]">
                      {inq.destination}
                    </td>
                    <td className="p-4 sm:p-5 text-slate-500">
                      {inq.travelDate}
                    </td>
                    <td className="p-4 sm:p-5">
                      <span className={`px-2.5 py-0.5 text-[10px] font-bold rounded-full border capitalize ${getStatusColor(inq.status)}`}>
                        {inq.status}
                      </span>
                    </td>
                  </tr>
                ))}
                {filteredInquiries.length === 0 && (
                  <tr>
                    <td colSpan={4} className="text-center py-10 text-slate-400 italic">
                      No matching inquiries found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Selected Inquiry Detail Panel */}
        <div className="lg:col-span-5">
          {selectedInquiry ? (
            <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-md space-y-6">
              <div className="border-b border-slate-100 pb-4">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Inquiry File</span>
                <h3 className="text-lg font-black text-slate-800 mt-1">{selectedInquiry.name}</h3>
              </div>

              {/* Inquiry properties */}
              <div className="grid grid-cols-2 gap-4 text-xs font-semibold">
                <div className="flex gap-2.5 items-center">
                  <Phone className="w-4 h-4 text-slate-400" />
                  <div>
                    <span className="text-[9px] text-slate-400 uppercase block">Phone</span>
                    <a href={`tel:${selectedInquiry.phoneNumber}`} className="text-slate-700 hover:text-primary-blue">
                      {selectedInquiry.phoneNumber}
                    </a>
                  </div>
                </div>

                <div className="flex gap-2.5 items-center">
                  <Mail className="w-4 h-4 text-slate-400" />
                  <div>
                    <span className="text-[9px] text-slate-400 uppercase block">Email</span>
                    <a href={`mailto:${selectedInquiry.email}`} className="text-slate-700 hover:text-primary-blue truncate max-w-[150px]">
                      {selectedInquiry.email}
                    </a>
                  </div>
                </div>

                <div className="flex gap-2.5 items-center">
                  <Calendar className="w-4 h-4 text-slate-400" />
                  <div>
                    <span className="text-[9px] text-slate-400 uppercase block">Date</span>
                    <span className="text-slate-700">{selectedInquiry.travelDate}</span>
                  </div>
                </div>

                <div className="flex gap-2.5 items-center">
                  <User className="w-4 h-4 text-slate-400" />
                  <div>
                    <span className="text-[9px] text-slate-400 uppercase block">Travelers / Budget</span>
                    <span className="text-slate-700">
                      {selectedInquiry.travelersCount} Pax / ₹{selectedInquiry.budget.toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>
              </div>

              <div className="border-t border-slate-100 pt-4 bg-slate-50 p-4 rounded-2xl">
                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Submitted Destination</span>
                <p className="text-sm font-bold text-slate-700 mt-1">{selectedInquiry.destination}</p>
              </div>

              {/* Form updates */}
              <form onSubmit={handleSaveStatus} className="space-y-4 border-t border-slate-100 pt-6">
                {successMsg && (
                  <div className="p-2.5 text-xs bg-green-50 text-green-600 rounded-lg border border-green-100">
                    {successMsg}
                  </div>
                )}
                {errorMsg && (
                  <div className="p-2.5 text-xs bg-red-50 text-red-600 rounded-lg border border-red-100">
                    {errorMsg}
                  </div>
                )}

                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Update Status</label>
                  <select
                    value={editStatus}
                    onChange={(e) => setEditStatus(e.target.value as any)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none bg-white text-slate-700"
                  >
                    <option value="new">New (Uncontacted)</option>
                    <option value="contacted">Contacted (In Process)</option>
                    <option value="converted">Converted (Booked)</option>
                    <option value="closed">Closed (Lost/No Deal)</option>
                  </select>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Agent Consultation Notes</label>
                  <textarea
                    value={editNotes}
                    onChange={(e) => setEditNotes(e.target.value)}
                    rows={4}
                    placeholder="Add notes about calls, client budget negotiation details, hotel package custom requests..."
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs focus:outline-none text-slate-700 bg-white"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 rounded-xl font-bold text-white bg-primary-blue hover:bg-opacity-95 transition-all flex items-center justify-center gap-1.5 cursor-pointer text-xs shadow-sm"
                >
                  <Save className="w-4 h-4 text-accent-gold" />
                  Save Pipeline Status
                </button>
              </form>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center text-center p-8 bg-white border border-slate-100 rounded-3xl h-80 shadow-sm text-slate-400">
              <ShieldAlert className="w-10 h-10 text-slate-300 animate-pulse mb-3" />
              <h4 className="font-bold text-sm text-slate-800">No Lead Selected</h4>
              <p className="text-xs mt-1 max-w-[200px]">Click any traveler inquiry on the left board to review logs, phone numbers, and save notes.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
