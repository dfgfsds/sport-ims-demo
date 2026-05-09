
// export default EventParticipantsDetails;
import { useNavigate, useParams } from 'react-router-dom';
import { useEffect, useState, useMemo } from 'react';
import axios from 'axios';
import * as XLSX from 'xlsx';

import Card from '../../components/UI/Card';
import Table from '../../components/UI/Table';

import {
    ArrowLeft,
    Search,
    FileSpreadsheet,
    X,
    Download,
    Users,
    User,
} from 'lucide-react';

const baseURL =
    import.meta.env.VITE_API_BASE_URL;

const EventParticipantsDetails =
    () => {
        const { eventId } =
            useParams();

        const navigate =
            useNavigate();

        const [eventData, setEventData] =
            useState<any[]>([]);


        const [
            searchTerm,
            setSearchTerm,
        ] = useState('');


        // --- Modal States ---
        const [showModal, setShowModal] = useState(false);
        const [downloadType, setDownloadType] = useState<'all' | 'club' | 'individual' | 'event_only'>('all');
        const [selectedClubId, setSelectedClubId] = useState('');
        const [selectedRegId, setSelectedRegId] = useState('');
        const [isDownloading, setIsDownloading] = useState(false);
        const [searchBy, setSearchBy] = useState<'regId' | 'chestNo'>('regId'); // New toggle state

        const [showRaceModal, setShowRaceModal] = useState(false);
        const [selectedGender, setSelectedGender] = useState(''); // 'male' or 'female'
        const [isExporting, setIsExporting] = useState(false);


        // Get unique clubs for the dropdown
        const clubs = useMemo(() => {
            const uniqueClubs = Array.from(new Set(eventData.map(item => item.clubId)));
            return uniqueClubs.map(id => {
                const club = eventData.find(item => item.clubId === id);
                return { id, name: club?.clubName };
            });
        }, [eventData]);

        const handleGenerateCertificate = async () => {
            setIsDownloading(true);
            try {
                let queryParams = "";

                // 1. ALL TYPE: ?all=true
                if (downloadType === 'all') {
                    queryParams = ``;
                }
                // 2. EVENT WISE ONLY: No query params (Only eventId in URL)
                else if (downloadType === 'event_only') {
                    queryParams = "?club_wise=true";
                }
                // 3 & 4. CLUB WISE LOGIC
                else if (downloadType === 'club') {
                    if (selectedClubId) {
                        // Type 4: Specific Club ID (club_wise=true & club_id)
                        queryParams = `?club_id=${selectedClubId}`;
                    }
                }
                // 5. INDIVIDUAL (Reg ID or Chest No)
                else if (downloadType === 'individual') {
                    if (!selectedRegId) {
                        alert("Please select a participant");
                        setIsDownloading(false);
                        return;
                    }
                    queryParams = `?club_wise=false&registration_id=${selectedRegId}`;
                }

                const response = await axios.post(
                    `${baseURL}/certificate/generate-filtered/${eventId}${queryParams}`
                );

                if (response.data.status === "success" && response.data.download_url) {
                    const link = response.data.download_url;
                    const anchor = document.createElement("a");
                    anchor.href = link;
                    anchor.setAttribute("download", `Certificates_${Date.now()}.pdf`);
                    anchor.setAttribute("target", "_blank");
                    document.body.appendChild(anchor);
                    anchor.click();
                    document.body.removeChild(anchor);

                    setShowModal(false);
                    // Fields reset panrathu
                    setSelectedRegId('');
                    setSelectedClubId('');
                } else {
                    alert("Download link not found.");
                }
            } catch (error) {
                console.error("API Error:", error);
                alert("Server error, console check pannu machan.");
            } finally {
                setIsDownloading(false);
            }
        };


        useEffect(() => {
            axios
                .get(
                    `${baseURL}/registrations/fetch-by-event-id/${eventId}`
                )
                .then((res) =>
                    setEventData(
                        res.data || []
                    )
                )
                .catch((err) =>
                    console.error(err)
                );
        }, [eventId]);

        // SEARCH FILTER
        const filteredData =
            useMemo(() => {
                return eventData.filter(
                    (item: any) => {
                        const value =
                            searchTerm.toLowerCase();

                        return (
                            (
                                item?.player
                                    ?.name ||
                                ''
                            )
                                .toLowerCase()
                                .includes(
                                    value
                                ) ||
                            (
                                item?.clubName ||
                                ''
                            )
                                .toLowerCase()
                                .includes(
                                    value
                                ) ||
                            (
                                item?.districtName ||
                                ''
                            )
                                .toLowerCase()
                                .includes(
                                    value
                                ) ||
                            (
                                item?.ageGroup ||
                                ''
                            )
                                .toLowerCase()
                                .includes(
                                    value
                                ) ||
                            (
                                item?.skateCategory ||
                                ''
                            )
                                .toLowerCase()
                                .includes(
                                    value
                                )
                        );
                    }
                );
            }, [
                eventData,
                searchTerm,
            ]);



        const exportDistrictCategory = async () => {
            try {
                const response = await axios.get(
                    `${baseURL}stats_export/district-club-summary-excel?eventId=${eventId}`
                );
                if (response.data.success && response.data.download_link) {
                    const link = response.data.download_link;

                    // Anchor tag logic for forced download
                    const anchor = document.createElement("a");
                    anchor.href = link;
                    anchor.setAttribute("download", "Gender_Age_Summary.xlsx");
                    document.body.appendChild(anchor);
                    anchor.click();
                    document.body.removeChild(anchor);

                    // Success Message in English
                    console.log("Download started successfully.");
                } else {
                    // Error Message in English
                    alert("Failed to generate download link. Please try again.");
                }
            } catch (error) {
                console.error("Export error:", error);
                // Catch Error Message in English
                alert("An error occurred while exporting the Excel report.");
            }
        }

        const exportAgeCategory = async () => {
            try {
                const response = await axios.get(
                    `${baseURL}stats_export/event-category-age-summary-excel?eventId=${eventId}`
                );
                if (response.data.success && response.data.download_link) {
                    const link = response.data.download_link;

                    // Anchor tag logic for forced download
                    const anchor = document.createElement("a");
                    anchor.href = link;
                    anchor.setAttribute("download", "Gender_Age_Summary.xlsx");
                    document.body.appendChild(anchor);
                    anchor.click();
                    document.body.removeChild(anchor);

                    // Success Message in English
                    console.log("Download started successfully.");
                } else {
                    // Error Message in English
                    alert("Failed to generate download link. Please try again.");
                }
            } catch (error) {
                console.error("Export error:", error);
                // Catch Error Message in English
                alert("An error occurred while exporting the Excel report.");
            }
        }

        const exportGenderAge = async () => {
            try {
                const response = await axios.get(
                    `${baseURL}stats_export/event-gender-summary-excel?eventId=${eventId}`
                );

                if (response.data.success && response.data.download_link) {
                    const link = response.data.download_link;

                    // Anchor tag logic for forced download
                    const anchor = document.createElement("a");
                    anchor.href = link;
                    anchor.setAttribute("download", "Gender_Age_Summary.xlsx");
                    document.body.appendChild(anchor);
                    anchor.click();
                    document.body.removeChild(anchor);

                    // Success Message in English
                    console.log("Download started successfully.");
                } else {
                    // Error Message in English
                    alert("Failed to generate download link. Please try again.");
                }
            } catch (error) {
                console.error("Export error:", error);
                // Catch Error Message in English
                alert("An error occurred while exporting the Excel report.");
            }
        }

        const exportRaceGenderAge = async () => {
            if (!selectedGender) return;

            setIsExporting(true);
            try {
                const response = await axios.get(
                    `${baseURL}stats_export/event-race-summary-excel?eventId=${eventId}&gender=${selectedGender}`
                );

                if (response.data.success && response.data.download_link) {
                    const link = response.data.download_link;
                    const anchor = document.createElement("a");
                    anchor.href = link;
                    anchor.setAttribute("download", `Race_Gender_Age_${selectedGender}.xlsx`);
                    document.body.appendChild(anchor);
                    anchor.click();
                    document.body.removeChild(anchor);

                    console.log("Download started successfully.");
                    setShowRaceModal(false); // Success aanathum modal close aagum
                    setSelectedGender('');   // Reset selection
                } else {
                    alert("Failed to generate download link. Please try again.");
                }
            } catch (error) {
                console.error("Export error:", error);
                alert("An error occurred while exporting the Excel report.");
            } finally {
                setIsExporting(false);
            }
        };
        const columns = [
            {
                key: 'name',
                label: 'NAME',

                render: (
                    value: string,
                    item: any
                ) => (
                    <div className="font-medium">
                        {(
                            item?.player
                                ?.name ||
                            ''
                        ).toUpperCase()}
                    </div>
                ),
            },

            {
                key: 'clubName',
                label:
                    'Club Name',
            },

            {
                key: 'districtName',
                label:
                    'District',
            },

            {
                key: 'chestNumber',
                label:
                    'Chest No',
            },

            {
                key: 'ageGroup',
                label: 'Age',
            },

            {
                key: 'skateCategory',
                label:
                    'Category',
            },

            {
                key: 'amountPaid',
                label:
                    'Amount',
            },
        ];

        const SummaryBtn = ({
            label,
            onClick,
        }: any) => (
            <button
                onClick={
                    onClick
                }
                className="flex items-center justify-center gap-2 rounded bg-[#76933c] px-4 py-2 text-xs font-bold uppercase text-white shadow transition-all hover:bg-[#5e7630]"
            >
                <FileSpreadsheet
                    size={16}
                />

                {label}
            </button>
        );

        return (
            <div className="space-y-6">

                {/* HEADER */}
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    {/* Left Side: Title and Back Button */}
                    <h2 className="flex items-center text-2xl font-bold">
                        <ArrowLeft
                            className="mr-4 cursor-pointer"
                            onClick={() => navigate(-1)}
                            size={24}
                        />
                        Participants - {eventData?.[0]?.event?.name || 'Event'}
                    </h2>

                    {/* Right Side: Search and Certificate Button */}
                    <div className="flex items-center gap-3 self-end md:self-auto">
                        <div className="relative">
                            <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
                            <input
                                type="text"
                                placeholder="Search..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full rounded-lg border py-2 pl-10 pr-4 outline-none focus:ring-2 focus:ring-[#76933c] md:w-64"
                            />
                        </div>

                        {/* Unoda Certificate Button ippo end-la irukum */}
                        <button
                            onClick={() => setShowModal(true)}
                            className="flex items-center gap-2 rounded bg-blue-600 px-4 py-2 text-xs font-bold uppercase text-white hover:bg-blue-700 shadow-md transition-all active:scale-95"
                        >
                            <Download size={16} /> Certificate
                        </button>
                    </div>
                </div>


                {/* EXPORT BUTTONS */}
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">

                    <SummaryBtn
                        label="Gender & Age Wise"
                        onClick={
                            exportGenderAge
                        }
                    />

                    <SummaryBtn
                        label="Age & Category Wise"
                        onClick={
                            exportAgeCategory
                        }
                    />

                    <SummaryBtn
                        label="District & Category"
                        onClick={
                            exportDistrictCategory
                        }
                    />

                    <SummaryBtn
                        label="Race Gender Age"
                        // onClick={
                        //     exportRaceGenderAge
                        // }
                        onClick={() => setShowRaceModal(true)}
                    />
                </div>

                {/* TABLE */}
                <Card>
                    <div className="bg-[#76933c] p-3 text-sm font-bold uppercase text-white">
                        Participant
                        List
                    </div>

                    <Table
                        columns={
                            columns
                        }
                        data={
                            filteredData
                        }
                    />

                    {filteredData.length ===
                        0 && (
                            <div className="p-8 text-center italic text-gray-500">
                                No
                                participants
                                found
                            </div>
                        )}
                </Card>

                {showModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                        <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-2xl">
                            <div className="mb-6 flex items-center justify-between border-b pb-3">
                                <h3 className="text-xl font-bold text-gray-800">Download Certificates</h3>
                                <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-red-500">
                                    <X size={24} />
                                </button>
                            </div>

                            <div className="space-y-5">
                                {/* 5-Type Selection Buttons */}
                                <div>
                                    <label className="mb-2 block text-[10px] font-bold text-gray-400 uppercase tracking-wider">Select Category</label>
                                    <div className="grid grid-cols-2 gap-2">
                                        <button
                                            onClick={() => setDownloadType('all')}
                                            className={`rounded-lg border py-2 text-xs font-bold transition-all ${downloadType === 'all' ? 'bg-[#76933c] text-white border-[#76933c]' : 'bg-gray-50 text-gray-500 border-gray-200'}`}
                                        >
                                            ALL
                                        </button>
                                        <button
                                            onClick={() => setDownloadType('event_only')}
                                            className={`rounded-lg border py-2 text-xs font-bold transition-all ${downloadType === 'event_only' ? 'bg-[#76933c] text-white border-[#76933c]' : 'bg-gray-50 text-gray-500 border-gray-200'}`}
                                        >
                                            CLUB WISE
                                        </button>
                                        <button
                                            onClick={() => setDownloadType('club')}
                                            className={`rounded-lg border py-2 text-xs font-bold transition-all ${downloadType === 'club' ? 'bg-[#76933c] text-white border-[#76933c]' : 'bg-gray-50 text-gray-500 border-gray-200'}`}
                                        >
                                            CLUB ID WISE
                                        </button>
                                        <button
                                            onClick={() => setDownloadType('individual')}
                                            className={`rounded-lg border py-2 text-xs font-bold transition-all ${downloadType === 'individual' ? 'bg-[#76933c] text-white border-[#76933c]' : 'bg-gray-50 text-gray-500 border-gray-200'}`}
                                        >
                                            INDIVIDUAL
                                        </button>
                                    </div>
                                </div>

                                {/* Sub-options based on selection */}
                                <div className="min-h-[100px] border-t pt-4">
                                    {downloadType === 'club' && (
                                        <div className="animate-in fade-in duration-300">
                                            <label className="mb-2 block text-[10px] font-bold text-gray-400 uppercase">Select Specific Club (Optional)</label>
                                            <select
                                                className="w-full rounded-lg border border-gray-200 p-3 text-sm outline-none focus:ring-2 focus:ring-[#76933c]"
                                                value={selectedClubId}
                                                onChange={(e) => setSelectedClubId(e.target.value)}
                                            >
                                                <option value="">-- All Clubs --</option>
                                                {clubs.map(club => (
                                                    <option key={club.id} value={club.id}>{club.name}</option>
                                                ))}
                                            </select>
                                            <p className="mt-2 text-[10px] text-gray-500 italic font-medium">
                                                {selectedClubId ? "* Specific Club logic selected." : "* General Club Wise logic selected."}
                                            </p>
                                        </div>
                                    )}

                                    {downloadType === 'individual' && (
                                        <div className="space-y-4 animate-in fade-in duration-300">
                                            <div className="flex gap-4 justify-center text-[11px] font-bold uppercase text-gray-600">
                                                <label className="flex items-center gap-2 cursor-pointer">
                                                    <input type="radio" checked={searchBy === 'regId'} onChange={() => setSearchBy('regId')} className="accent-[#76933c]" /> Reg ID
                                                </label>
                                                <label className="flex items-center gap-2 cursor-pointer">
                                                    <input type="radio" checked={searchBy === 'chestNo'} onChange={() => setSearchBy('chestNo')} className="accent-[#76933c]" /> Chest No
                                                </label>
                                            </div>
                                            <select
                                                className="w-full rounded-lg border border-gray-200 p-3 text-sm outline-none focus:ring-2 focus:ring-[#76933c]"
                                                value={selectedRegId}
                                                onChange={(e) => setSelectedRegId(e.target.value)}
                                            >
                                                <option value="">-- Choose Participant --</option>
                                                {eventData.map(item => (
                                                    <option key={item.id} value={item.id}>
                                                        {searchBy === 'regId' ? `${item.player?.name} (${item.registrationId})` : `Chest: ${item.chestNumber} - ${item.player?.name}`}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                    )}

                                    {/* Simple Message for All/Event Only */}
                                    {(downloadType === 'all' || downloadType === 'event_only') && (
                                        <div className="rounded-lg bg-gray-50 p-4 text-center">
                                            <p className="text-sm font-medium text-gray-600">
                                                {downloadType === 'all'
                                                    ? "Preparing to download certificates for all participants."
                                                    : "Starting download based on the specific Event ID."
                                                }
                                            </p>
                                        </div>
                                    )}
                                </div>

                                <button
                                    onClick={handleGenerateCertificate}
                                    disabled={isDownloading}
                                    className={`w-full rounded-lg py-4 font-bold uppercase text-white shadow-lg transition-all ${isDownloading ? 'bg-gray-300 cursor-not-allowed' : 'bg-[#76933c] hover:bg-[#5e7630] active:scale-95'}`}
                                >
                                    {isDownloading ? 'Generating PDF...' : 'Download PDF'}
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {showRaceModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
                        <div className="w-full max-w-sm rounded-xl bg-white p-6 shadow-2xl">
                            <div className="mb-4 flex items-center justify-between border-b pb-3">
                                <h3 className="text-lg font-bold text-gray-800">Export Race Summary</h3>
                                <button onClick={() => setShowRaceModal(false)} className="text-gray-400 hover:text-red-500">
                                    <X size={20} />
                                </button>
                            </div>

                            <div className="space-y-6">
                                <div>
                                    <label className="mb-3 block text-xs font-bold text-gray-500 uppercase">Select Gender</label>
                                    <div className="grid grid-cols-2 gap-4">
                                        <button
                                            onClick={() => setSelectedGender('male')}
                                            className={`flex flex-1 items-center justify-center gap-2 rounded-lg py-3 text-sm font-bold border-2 transition-all ${selectedGender === 'male' ? 'border-[#76933c] bg-[#f4f7ed] text-[#76933c]' : 'border-gray-100 text-gray-500'}`}
                                        >
                                            MALE
                                        </button>
                                        <button
                                            onClick={() => setSelectedGender('female')}
                                            className={`flex flex-1 items-center justify-center gap-2 rounded-lg py-3 text-sm font-bold border-2 transition-all ${selectedGender === 'female' ? 'border-[#76933c] bg-[#f4f7ed] text-[#76933c]' : 'border-gray-100 text-gray-500'}`}
                                        >
                                            FEMALE
                                        </button>
                                    </div>
                                </div>

                                {/* Download Button - Only enabled if gender is selected */}
                                <button
                                    onClick={exportRaceGenderAge}
                                    disabled={!selectedGender || isExporting}
                                    className={`w-full rounded-lg py-3 font-bold uppercase text-white shadow-md transition-all ${(!selectedGender || isExporting) ? 'bg-gray-300 cursor-not-allowed' : 'bg-[#76933c] hover:bg-[#5e7630] active:scale-95'}`}
                                >
                                    {isExporting ? 'Exporting...' : 'Download Excel'}
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        );
    };

export default EventParticipantsDetails;