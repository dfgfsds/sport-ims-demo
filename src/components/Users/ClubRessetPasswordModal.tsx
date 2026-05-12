import React, { useState, useEffect } from 'react';
import { X, Lock, Smartphone, ShieldCheck, EyeOff, Eye } from 'lucide-react';
import axios from 'axios';
import { toast } from 'react-toastify';

interface ClubModalProps {
    isOpen: boolean;
    onClose: () => void;
    club: any | null;
    fetchClubs: () => void;
}

const ClubResetPasswordModal: React.FC<ClubModalProps> = ({
    isOpen,
    onClose,
    club,
    fetchClubs,
}) => {
    const [formData, setFormData] = useState({
        mobileNumber: '',
        newPassword: '',
    });
    const baseURL = import.meta.env.VITE_API_BASE_URL;
    const [errors, setErrors] = useState({
        mobileNumber: '',
        password: '',
    });
    const [showPassword, setShowPassword] = useState(false);

    useEffect(() => {
        if (isOpen) {
            setFormData({
                mobileNumber: club?.mobileNumber || '',
                newPassword: '',
            });

            setErrors({
                mobileNumber: '',
                password: '',
            });
        }
    }, [isOpen, club]);

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const newErrors = {
            mobileNumber: '',
            password: '',
        };

        // Mobile Validation
        if (!/^\d{10}$/.test(formData.mobileNumber)) {
            newErrors.mobileNumber =
                'Enter valid 10 digit mobile number';
        }


        if (formData.newPassword.length < 6) {
            newErrors.password =
                'Password must be minimum 6 characters';
        }

        setErrors(newErrors);

        if (newErrors.mobileNumber || newErrors.password) {
            return;
        }

        // onSave({
        //     clubId: club?.clubId,
        //     mobileNumber: formData.mobileNumber,
        //     newPassword: formData.newPassword,
        // });

        // handleResetPassword();
        try {
            const res = await axios.put(`${baseURL}/clubs/reset-password`, {
                clubId: club?.clubId,
                mobileNumber: formData.mobileNumber,
                newPassword: formData.newPassword,
            });
            if (res.status === 200) {
                onClose();
                fetchClubs();   
                toast.success(res?.data?.message || 'Password reset successfully!')
            }


        } catch (error: any) {
            // console.error('Save failed:', error);
            toast.success(error?.res?.data?.message || 'Password failed to reset!')
        }
    };



    return (
        <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
            <div className="relative w-full max-w-lg overflow-hidden rounded-3xl bg-white shadow-2xl animate-in fade-in zoom-in duration-300">

                {/* Top Gradient */}
                <div className="bg-gradient-to-r from-orange-500 to-red-500 px-6 py-5 text-white">
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="text-2xl font-bold">
                                Reset Club Password
                            </h2>

                            <p className="mt-1 text-sm text-orange-100">
                                Securely update club login credentials
                            </p>
                        </div>

                        <button
                            onClick={onClose}
                            className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20 transition hover:bg-white/30"
                        >
                            <X size={20} />
                        </button>
                    </div>
                </div>

                {/* Body */}
                <form
                    onSubmit={handleSubmit}
                    className="space-y-5 p-6"
                >
                    {/* Club Info */}
                    <div className="rounded-2xl border border-orange-100 bg-orange-50 p-4">
                        <div className="flex items-start gap-3">
                            <div className="rounded-full bg-orange-500 p-2 text-white">
                                <ShieldCheck size={18} />
                            </div>

                            <div>
                                <h3 className="text-sm font-semibold text-gray-800">
                                    {club?.clubName}
                                </h3>

                                <p className="mt-1 text-xs text-gray-500">
                                    Club ID : {club?.clubId}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Mobile Number */}
                    <div>
                        <label className="mb-2 flex items-center gap-2 text-sm font-semibold text-gray-700">
                            <Smartphone size={16} />
                            Registered Mobile Number
                        </label>

                        <input
                            type="text"
                            placeholder="Enter mobile number"
                            value={formData.mobileNumber}
                            onChange={(e) => {
                                const value = e.target.value;

                                if (/^\d{0,10}$/.test(value)) {
                                    setFormData({
                                        ...formData,
                                        mobileNumber: value,
                                    });
                                }
                            }}
                            maxLength={10}
                            className={`w-full rounded-xl border px-4 py-3 text-sm outline-none transition focus:ring-4 ${errors.mobileNumber
                                ? 'border-red-400 focus:ring-red-100'
                                : 'border-gray-300 focus:border-orange-500 focus:ring-orange-100'
                                }`}
                        />

                        {errors.mobileNumber && (
                            <p className="mt-1 text-xs text-red-500">
                                {errors.mobileNumber}
                            </p>
                        )}
                    </div>

                    {/* New Password */}
                    {/* New Password */}

                    <div>
                        <label className="mb-2 flex items-center gap-2 text-sm font-semibold text-gray-700">
                            <Lock size={16} />
                            New Password
                        </label>

                        <div className="relative">
                            <input
                                type={showPassword ? "text" : "password"}
                                placeholder="Enter new password"
                                value={formData.newPassword}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        newPassword: e.target.value,
                                    })
                                }
                                className={`w-full rounded-xl border px-4 py-3 pr-12 text-sm outline-none transition focus:ring-4 ${errors.password
                                    ? 'border-red-400 focus:ring-red-100'
                                    : 'border-gray-300 focus:border-orange-500 focus:ring-orange-100'
                                    }`}
                            />

                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-orange-500"
                            >
                                {showPassword ? (
                                    <EyeOff size={20} />
                                ) : (
                                    <Eye size={20} />
                                )}
                            </button>
                        </div>

                        {errors.password && (
                            <p className="mt-1 text-xs text-red-500">
                                {errors.password}
                            </p>
                        )}
                    </div>
                    {/* Footer */}
                    <div className="flex items-center justify-end gap-3 border-t pt-5">
                        <button
                            type="button"
                            onClick={onClose}
                            className="rounded-xl border border-gray-300 px-5 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-100"
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            className="rounded-xl bg-gradient-to-r from-orange-500 to-red-500 px-5 py-2.5 text-sm font-semibold text-white shadow-lg transition hover:scale-[1.02]"
                        >
                            Update Password
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ClubResetPasswordModal;