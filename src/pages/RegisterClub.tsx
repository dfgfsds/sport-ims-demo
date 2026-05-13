import React, { useState } from 'react';
import axios from 'axios';
import {
    Save,
    Eye,
    EyeOff,
    ShieldCheck,
    Smartphone,
    Lock
} from 'lucide-react';
import { useLocation } from '../context/LocationContext';
import ImageUpload from '../components/UI/ImageUpload';



const RegisterClub: React.FC = () => {

    const baseUrl = import.meta.env.VITE_API_BASE_URL;

    const { states, districts, loading } = useLocation();

    const [showPassword, setShowPassword] = useState(false);

    const [loadingPost, setLoading] = useState(false);

    const [error, setError] = useState('');

    const [otp, setOtp] = useState('');

    const [otpSent, setOtpSent] = useState(false);

    const [otpVerified, setOtpVerified] = useState(false);

    const [otpError, setOtpError] = useState('');

    const [formData, setFormData] = useState<any>({
        stateId: '',
        districtId: '',
        clubName: '',
        coachName: '',
        mobileNumber: '',
        email: '',
        password: '',
        // societyCertificateNumber: '',
        // aadharNumber: '',
        // certificateUrl: '',
        address: '',
        approvalStatus: 'pending'
    });

    // SEND OTP
    const handleSendOtp = async () => {

        setOtpError('');

        try {

            const res = await axios.post(
                `${baseUrl}/login/send-otp`,
                {
                    mobileNumber: formData.mobileNumber
                }
            );

            if (res?.data?.success) {

                setOtpSent(true);

            } else {

                setOtpError(
                    res?.data?.message || 'Failed to send OTP'
                );
            }

        } catch (err: any) {

            setOtpError(
                err?.response?.data?.message ||
                'Failed to send OTP'
            );
        }
    };

    // VERIFY OTP
    const handleVerifyOtp = async () => {

        setOtpError('');

        try {

            const res = await axios.post(
                `${baseUrl}/login/verify-otp`,
                {
                    mobileNumber: formData.mobileNumber,
                    otp
                }
            );

            if (res?.data?.success) {

                setOtpVerified(true);

            } else {

                setOtpError(
                    res?.data?.message ||
                    'OTP verification failed'
                );
            }

        } catch (err: any) {

            setOtpError(
                err?.response?.data?.message ||
                'OTP verification failed'
            );
        }
    };

    // SUBMIT
    const handleSubmit = async (
        e: React.FormEvent
    ) => {

        e.preventDefault();

        setLoading(true);

        setError('');

        try {

            await axios.post(
                `${baseUrl}/clubs/register-approved`,
                formData
            );

            alert('Club Registered Successfully');

            setFormData({
                stateId: '',
                districtId: '',
                clubName: '',
                coachName: '',
                mobileNumber: '',
                email: '',
                password: '',
                // societyCertificateNumber: '',
                // aadharNumber: '',
                // certificateUrl: '',
                address: '',
                approvalStatus: 'pending'
            });

            setOtp('');

            setOtpSent(false);

            setOtpVerified(false);

        } catch (error: any) {

            setError(
                error?.response?.data?.message ||
                'Something went wrong'
            );

        } finally {

            setLoading(false);
        }
    };

    return (

        <div className="min-h-screen bg-gray-100 py-10 px-4">

            <div className="mx-auto max-w-5xl overflow-hidden rounded-3xl bg-white shadow-2xl">

                {/* HEADER */}
                <div className="bg-gradient-to-r from-orange-500 to-red-500 px-8 py-7 text-white">

                    <div className="flex items-center gap-4">

                        <div className="rounded-2xl bg-white/20 p-3">
                            <ShieldCheck size={30} />
                        </div>

                        <div>
                            <h1 className="text-3xl font-bold">
                                Club Registration
                            </h1>

                            <p className="mt-1 text-orange-100">
                                Register your sports club securely
                            </p>
                        </div>
                    </div>
                </div>

                {/* FORM */}
                <form
                    onSubmit={handleSubmit}
                    className="space-y-6 p-8"
                >

                    <div className="grid grid-cols-1 gap-5 md:grid-cols-2">

                        {/* CLUB NAME */}
                        <div>
                            <label className="mb-2 block text-sm font-semibold text-gray-700">
                                Club Name
                            </label>

                            <input
                                type="text"
                                required
                                placeholder="Enter club name"
                                value={formData.clubName}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        clubName: e.target.value,
                                    })
                                }
                                className="w-full rounded-xl border border-gray-300 px-4 py-3"
                            />
                        </div>

                        {/* COACH NAME */}
                        <div>
                            <label className="mb-2 block text-sm font-semibold text-gray-700">
                                Coach Name
                            </label>

                            <input
                                type="text"
                                required
                                placeholder="Enter coach name"
                                value={formData.coachName}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        coachName: e.target.value,
                                    })
                                }
                                className="w-full rounded-xl border border-gray-300 px-4 py-3"
                            />
                        </div>

                        {/* PHONE NUMBER */}
                        <div>
                            <label className="mb-2 flex items-center gap-2 text-sm font-semibold text-gray-700">
                                <Smartphone size={16} />
                                Phone Number
                            </label>

                            <div className="flex gap-2">

                                <input
                                    type="text"
                                    maxLength={10}
                                    required
                                    value={formData.mobileNumber}
                                    onChange={(e) => {

                                        setFormData({
                                            ...formData,
                                            mobileNumber:
                                                e.target.value
                                        });

                                        setOtpSent(false);

                                        setOtpVerified(false);

                                        setOtp('');
                                    }}
                                    placeholder="Enter mobile number"
                                    disabled={otpVerified}
                                    className={`w-full rounded-xl border px-4 py-3 ${
                                        otpVerified
                                            ? 'border-green-500 text-green-600'
                                            : 'border-gray-300'
                                    }`}
                                />

                                {!otpVerified && (
                                    <button
                                        type="button"
                                        onClick={handleSendOtp}
                                        disabled={
                                            formData.mobileNumber.length !== 10
                                        }
                                        className="rounded-xl bg-orange-500 px-4 text-white"
                                    >
                                        {otpSent ? 'Sent' : 'Send OTP'}
                                    </button>
                                )}
                            </div>

                            {otpVerified && (
                                <p className="mt-1 text-sm text-green-600">
                                    Phone number verified
                                </p>
                            )}
                        </div>

                        {/* OTP */}
                        {otpSent && !otpVerified && (

                            <div>
                                <label className="mb-2 block text-sm font-semibold text-gray-700">
                                    Enter OTP
                                </label>

                                <input
                                    type="text"
                                    maxLength={6}
                                    value={otp}
                                    onChange={(e) =>
                                        setOtp(e.target.value)
                                    }
                                    placeholder="Enter OTP"
                                    className="w-full rounded-xl border border-gray-300 px-4 py-3"
                                />

                                <button
                                    type="button"
                                    onClick={handleVerifyOtp}
                                    disabled={otp.length !== 6}
                                    className="mt-3 rounded-xl bg-green-500 px-4 py-2 text-white"
                                >
                                    Verify OTP
                                </button>

                                {otpError && (
                                    <p className="mt-2 text-sm text-red-500">
                                        {otpError}
                                    </p>
                                )}
                            </div>
                        )}

                        {/* EMAIL */}
                        <div>
                            <label className="mb-2 block text-sm font-semibold text-gray-700">
                                Email
                            </label>

                            <input
                                type="email"
                                required
                                value={formData.email}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        email: e.target.value,
                                    })
                                }
                                placeholder="Enter email"
                                className="w-full rounded-xl border border-gray-300 px-4 py-3"
                            />
                        </div>

                        {/* PASSWORD */}
                        <div>
                            <label className="mb-2 flex items-center gap-2 text-sm font-semibold text-gray-700">
                                <Lock size={16} />
                                Password
                            </label>

                            <div className="relative">

                                <input
                                    type={
                                        showPassword
                                            ? 'text'
                                            : 'password'
                                    }
                                    required
                                    value={formData.password}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            password: e.target.value,
                                        })
                                    }
                                    placeholder="Enter password"
                                    className="w-full rounded-xl border border-gray-300 px-4 py-3 pr-12"
                                />

                                <button
                                    type="button"
                                    onClick={() =>
                                        setShowPassword(
                                            !showPassword
                                        )
                                    }
                                    className="absolute right-3 top-1/2 -translate-y-1/2"
                                >
                                    {showPassword ? (
                                        <EyeOff size={20} />
                                    ) : (
                                        <Eye size={20} />
                                    )}
                                </button>

                            </div>
                        </div>

                        {/* CERTIFICATE NUMBER */}
                        {/* <div>
                            <label className="mb-2 block text-sm font-semibold text-gray-700">
                                Society Certificate Number
                            </label>

                            <input
                                type="text"
                                value={
                                    formData.societyCertificateNumber
                                }
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        societyCertificateNumber:
                                            e.target.value,
                                    })
                                }
                                placeholder="Enter certificate number"
                                className="w-full rounded-xl border border-gray-300 px-4 py-3"
                            />
                        </div> */}

                        {/* AADHAR */}
                        {/* <div>
                            <label className="mb-2 block text-sm font-semibold text-gray-700">
                                Aadhar Number
                            </label>

                            <input
                                type="text"
                                maxLength={12}
                                value={formData.aadharNumber}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        aadharNumber:
                                            e.target.value,
                                    })
                                }
                                placeholder="Enter aadhar number"
                                className="w-full rounded-xl border border-gray-300 px-4 py-3"
                            />
                        </div> */}

                        {/* STATE */}
                        <div>
                            <label className="mb-2 block text-sm font-semibold text-gray-700">
                                State
                            </label>

                            <select
                                required
                                value={formData.stateId}
                                onChange={(e) => {

                                    const stateId =
                                        parseInt(e.target.value);

                                    setFormData({
                                        ...formData,
                                        stateId,
                                        districtId: ''
                                    });
                                }}
                                disabled={loading}
                                className="w-full rounded-xl border border-gray-300 px-4 py-3"
                            >
                                <option value="">
                                    Select State
                                </option>

                                {states?.map((state: any) => (
                                    <option
                                        key={state.id}
                                        value={state.id}
                                    >
                                        {state.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* DISTRICT */}
                        <div>
                            <label className="mb-2 block text-sm font-semibold text-gray-700">
                                District
                            </label>

                            <select
                                required
                                value={formData.districtId}
                                onChange={(e) => {

                                    const districtId =
                                        parseInt(e.target.value);

                                    setFormData({
                                        ...formData,
                                        districtId
                                    });
                                }}
                                disabled={
                                    loading ||
                                    !formData.stateId
                                }
                                className="w-full rounded-xl border border-gray-300 px-4 py-3"
                            >
                                <option value="">
                                    Select District
                                </option>

                                {districts
                                    ?.filter(
                                        (district: any) =>
                                            district.stateId ===
                                            formData.stateId
                                    )
                                    .map((district: any) => (
                                        <option
                                            key={district.id}
                                            value={district.id}
                                        >
                                            {district.name}
                                        </option>
                                    ))}
                            </select>
                        </div>

                    </div>

                    {/* ADDRESS */}
                    <div>
                        <label className="mb-2 block text-sm font-semibold text-gray-700">
                            Club Address
                        </label>

                        <textarea
                            rows={4}
                            required
                            value={formData.address}
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    address: e.target.value,
                                })
                            }
                            placeholder="Enter address"
                            className="w-full rounded-xl border border-gray-300 px-4 py-3"
                        />
                    </div>

                    {/* IMAGE UPLOAD */}
                    {/* <ImageUpload
                        label="Certificate URL"
                        value={formData.certificateUrl}
                        onChange={(url:any) =>
                            setFormData({
                                ...formData,
                                certificateUrl: url,
                            })
                        }
                        uploadUrl={`${baseUrl}/upload/image/`}
                    /> */}

                    {/* DOCUMENTS */}
                    {/* <div className="rounded-2xl border border-yellow-200 bg-yellow-50 p-5">

                        <h3 className="mb-3 text-lg font-semibold text-yellow-800">
                            Required Documents
                        </h3>

                        <ul className="space-y-2 text-sm text-yellow-700">
                            <li>• Club registration certificate</li>
                            <li>• Contact person identification</li>
                            <li>• Facility ownership documents</li>
                            <li>• Insurance certificate</li>
                        </ul>
                    </div> */}

                    {/* ERROR */}
                    {error && (
                        <div className="text-end text-sm text-red-500">
                            {error}
                        </div>
                    )}

                    {/* SUBMIT */}
                    <div className="flex justify-end border-t pt-6">

                        <button
                            type="submit"
                            disabled={
                                loadingPost || !otpVerified
                            }
                            className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-orange-500 to-red-500 px-6 py-3 text-sm font-semibold text-white shadow-lg"
                        >
                            <Save size={18} />

                            {loadingPost
                                ? 'Loading...'
                                : 'Register Club'}
                        </button>
                    </div>

                </form>
            </div>
        </div>
    );
};

export default RegisterClub;