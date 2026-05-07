import React, { useState, useEffect } from "react";
import Modal from "../UI/Modal";
import axios from "axios";
import { Plus, Edit2, Trash2, AlertCircle } from "lucide-react"; // Icons kaga

const EventPayment: React.FC<any> = ({ isOpen, onClose, event }: any) => {
    const [vendorsList, setVendorsList] = useState<any[]>([]); // Current event vendors
    const [allMasterVendors, setAllMasterVendors] = useState<any[]>([]); // Master list for Select
    const [loading, setLoading] = useState(false);
      const baseURL = import.meta.env.VITE_API_BASE_URL;
      
    // Modals State
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [selectedId, setSelectedId] = useState<number | null>(null);

    const [formData, setFormData] = useState({
        vendorId: "",
        amount: "0",
        percentage: 0
    });

    const API_BASE = "/payment_vendors";

    useEffect(() => {
        if (isOpen) {
            fetchEventVendors();
            // fetchMasterVendors();
        }
    }, [isOpen, event?.id]);

    const fetchEventVendors = async () => {
        try {
            const res = await axios.get(`${baseURL}payment_vendors/event/${event?.id}`);
            if (res.data.success) setVendorsList(res.data.data);
        } catch (err) { console.error(err); }
    };

    // const fetchMasterVendors = async () => {
    //     try {
    //         const res = await axios.get(MASTER_VENDOR_API);
    //         setAllMasterVendors(res.data.data || []);
    //     } catch (err) { console.error(err); }
    // };

    const handleOpenForm = (v: any = null) => {
        if (v) {
            setSelectedId(v.id);
            setFormData({ vendorId: v.vendorId, amount: v.amount, percentage: v.percentage });
        } else {
            setSelectedId(null);
            setFormData({ vendorId: "", amount: "0", percentage: 0 });
        }
        setIsFormOpen(true);
    };

    const handleSave = async () => {
        // Unique Check for Add
        if (!selectedId && vendorsList.some(v => v.vendorId === formData.vendorId)) {
            alert(" Vendor already added!");
            return;
        }

        try {
            setLoading(true);
            if (selectedId) {
                await axios.put(`${baseURL}payment_vendors/${selectedId}`, formData);
            } else {
                await axios.post(`${baseURL}payment_vendors/`, { ...formData, eventId: event.id });
            }
            setIsFormOpen(false);
            fetchEventVendors();
        } catch (err:any) { err?.response?.data?.message || "Something went wrong. Please try again." }
        finally { setLoading(false); }
    };

    const confirmDelete = async () => {
        try {
            await axios.delete(`${baseURL}payment_vendors/${selectedId}`);
            setIsDeleteOpen(false);
            fetchEventVendors();
        } catch (err) { console.error(err); }
    };

    return (
        <>
            {/* MAIN LIST MODAL */}
            <Modal isOpen={isOpen} onClose={onClose} title={`Vendors: ${event?.name}`} size="xl">
                <div className="p-4">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-lg font-semibold text-gray-700">Manage Payments</h3>
                        <button 
                            onClick={() => handleOpenForm()}
                            className="bg-indigo-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-indigo-700 transition"
                        >
                            <Plus size={18} /> Add New Vendor
                        </button>
                    </div>

                    <div className="bg-white border rounded-xl overflow-hidden">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">Vendor</th>
                                    <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">Details</th>
                                    <th className="px-6 py-3 text-right text-xs font-bold text-gray-500 uppercase">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {vendorsList.map((v) => (
                                    <tr key={v.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 font-medium text-gray-900">{v.vendorId}</td>
                                        <td className="px-6 py-4 text-sm text-gray-600">
                                            {v.percentage > 0 ? `${v.percentage}% Commission` : `Flat ₹${v.amount}`}
                                        </td>
                                        <td className="px-6 py-4 text-right space-x-3">
                                            <button onClick={() => handleOpenForm(v)} className="text-blue-600 hover:text-blue-800"><Edit2 size={18}/></button>
                                            <button onClick={() => { setSelectedId(v.id); setIsDeleteOpen(true); }} className="text-red-500 hover:text-red-700"><Trash2 size={18}/></button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </Modal>

            {/* ADD / EDIT MODAL */}
            <Modal isOpen={isFormOpen} onClose={() => setIsFormOpen(false)} title={selectedId ? "Edit Vendor" : "Add Vendor"} size="md">
                <div className="p-6 space-y-4">
                    <div>
                        <label className="block text-sm font-medium mb-1">Enter Vendor</label>
                           <input 
                                type="text" className="w-full border p-2.5 rounded-lg" 
                                value={formData.vendorId}
                                onChange={(e) => setFormData({...formData, vendorId: e.target.value})}
                            />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium mb-1">Amount (₹)</label>
                            <input 
                                type="number" className="w-full border p-2.5 rounded-lg" 
                                value={formData.amount}
                                onChange={(e) => setFormData({...formData, amount: e.target.value})}
                            />
                        </div>
                        {/* <div>
                            <label className="block text-sm font-medium mb-1">Percentage (%)</label>
                            <input 
                                type="number" className="w-full border p-2.5 rounded-lg" 
                                value={formData.percentage}
                                onChange={(e) => setFormData({...formData, percentage: Number(e.target.value)})}
                            />
                        </div> */}
                    </div>
                    <button 
                        onClick={handleSave}
                        disabled={loading}
                        className="w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold mt-4 hover:bg-indigo-700"
                    >
                        {loading ? "Saving..." : "Save Vendor Details"}
                    </button>
                </div>
            </Modal>

            {/* DELETE CONFIRMATION MODAL */}
            <Modal isOpen={isDeleteOpen} onClose={() => setIsDeleteOpen(false)} title="Confirm Delete" size="sm">
                <div className="p-6 text-center">
                    <AlertCircle className="mx-auto text-red-500 mb-4" size={48} />
                    <h3 className="text-lg font-bold mb-2">Are you sure?</h3>
                    <p className="text-gray-500 mb-6">Inidha vendor-a delete panna thirumba recover panna mudiyathu machan.</p>
                    <div className="flex gap-3">
                        <button onClick={() => setIsDeleteOpen(false)} className="flex-1 px-4 py-2 border rounded-lg hover:bg-gray-50">Cancel</button>
                        <button onClick={confirmDelete} className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">Delete</button>
                    </div>
                </div>
            </Modal>
        </>
    );
};

export default EventPayment;