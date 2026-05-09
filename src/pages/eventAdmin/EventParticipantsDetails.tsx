import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';
import Card from '../../components/UI/Card';
import Table from '../../components/UI/Table';
import { ArrowLeft, Download, Edit, Eye, FileSpreadsheet, Search } from 'lucide-react';
import Button from '../../components/UI/Button';
import EventAdminModal from './EventAdminModal';
import RegistrationModal from './EventAdminModal';
import * as XLSX from 'xlsx';
import EditRegistrationBasicModal from './EditRegistrationModal';

const baseURL = import.meta.env.VITE_API_BASE_URL;

const EventParticipantsDetails = () => {

    const navigate = useNavigate();
    const [event, setEvent] = useState<any>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [filteredParticipants, setFilteredParticipants] = useState([]);
    const [openModal, setOpenModal] = useState(false);
    const [eventData, setEventData] = useState<any>(null);
    const eventId = localStorage.getItem("eventId");
    const [editOpen, setEditOpen] = useState(false);
    const [editData, setEditData] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(false);

    // useEffect(() => {
    //     axios
    //         .get(`${baseURL}/registrations/fetch-by-event-id/${eventId}`)
    //         .then((res) => setEvent(res.data))
    //         .catch((err) => console.error(err));
    // }, [eventId]);

    const fetchParticipants = () => {
        axios
            .get(`${baseURL}/registrations/fetch-by-event-id/${eventId}`)
            .then((res) => setEvent(res.data))
            .catch((err) => console.error(err));
    };

    useEffect(() => {
        fetchParticipants();
    }, [eventId]);

    useEffect(() => {
        if (event) {
            const filtered = event?.filter((p: any) =>
                p?.player?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                p?.player?.clubName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                p?.chestNumber?.toString().includes(searchQuery)
            );
            setFilteredParticipants(filtered);
        }
    }, [searchQuery, event]);

    useEffect(() => {

        //fetch event details and set data in eventData state
        axios
            .get(`${baseURL}/events/${eventId}`)
            .then((res) => {
                console.log('Event details:', res.data);
                setEventData(res.data);
            })
            .catch((err) => console.error(err));





    }, [eventId]);


    const handleExportProfileImages = async () => {
        try {
            setIsLoading(true); // Loading start panniko
            const response = await axios.get(`${baseURL}/registrations/export-images/${eventId}`);

            if (response.data.success && response.data.download_link) {
                // Puthiya tab-la open panna auto-va download aagum
                window.location.href = response.data.download_link;

                // Or secondary option (safer for some browsers):
                // window.open(response.data.download_link, '_blank');
            } else {
                alert("Export failed: " + response.data.message);
            }
        } catch (error) {
            console.error("Export Error:", error);
            alert("Something went wrong while exporting images.");
        } finally {
            setIsLoading(false); // Loading stop panniko
        }
    };
    const handleExport = () => {
        if (!eventData) return;
        const raceNames = Array.isArray(eventData?.races)
            ? eventData?.races?.map((race: any) => race.name.toUpperCase())
            : [];
        const excelHeader = [
            'S.NO',
            'REG NO',
            'SKATE TYPE',
            'AGE GROUP',
            'DOB',
            'GENDER',
            'NAME',
            'AADHAR NUMBER',
            'CLUB NAME',
            'CHEST NO',
            ...raceNames,
            'REGISTRATION DATE',
            'PAYMENT STATUS',
            'AMOUNT',
            'DISTRICT',
            'STATE',
            "profileImageUrl",
        ];



        const excelRows = filteredParticipants.map((p: any, index: number) => {
            const selectedRaceNames = Array.isArray(p.selectedRaces)
                ? p.selectedRaces.map((race: any) => (race?.name || '').toUpperCase())
                : [];
            const raceColumns = raceNames.map((raceName: string) =>
                selectedRaceNames.includes(raceName) ? 'YES' : ''
            );
            return [
                (index + 1).toString().toUpperCase(),
                (p.id || '').toString().toUpperCase(),
                (p.skateCategory || '').toUpperCase(),
                (p.ageGroup || '').toUpperCase(),
                p.dob
                    ? new Date(p.dob).toLocaleDateString('en-GB', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric'
                    }).replace(/ /g, ' ').toLocaleUpperCase()
                    : '',
                (p.player?.gender || '').toUpperCase(),
                (p.player?.name || p.name || '').toUpperCase(),
                (p.player?.aadharNumber || '').toUpperCase(),
                (p.clubName || '').toUpperCase(),
                (p.chestNumber || '').toString().toUpperCase(),
                ...raceColumns,
                p.regDate
                    ? new Date(p.regDate).toLocaleDateString('en-GB', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric'
                    }).replace(/ /g, ' ').toLocaleUpperCase()
                    : '',
                (Number(p.amountPaid) > 0 ? 'PAID' : 'NOT PAID'),
                (p.amountPaid || '').toString().toUpperCase(),
                (p.player?.districtName || '').toUpperCase(),
                (p.player?.stateName || '').toUpperCase(),
                (p.player?.profileImageUrl || '').toUpperCase(),

            ];
        });

        const wb = XLSX.utils.book_new();

        // Main sheet
        const ws = XLSX.utils.aoa_to_sheet([excelHeader, ...excelRows]);

        // Add blue background to header row
        const headerCellStyle = {
            fill: { patternType: "solid", fgColor: { rgb: "1976D2" } }, // Material blue 600
            font: { color: { rgb: "FFFFFF" }, bold: true }
        };
        excelHeader.forEach((_, idx) => {
            const cellRef = XLSX.utils.encode_cell({ r: 0, c: idx });
            if (!ws[cellRef]) ws[cellRef] = { t: "s", v: excelHeader[idx] };
            ws[cellRef].s = headerCellStyle;
        });

        XLSX.utils.book_append_sheet(wb, ws, 'Participants');

        // Helper to group by age group and gender
        const groupBy = (arr: any[], key: string) => {
            return arr.reduce((acc, item) => {
                const groupKey = (item[key] || '').toUpperCase();
                if (!acc[groupKey]) acc[groupKey] = [];
                acc[groupKey].push(item);
                return acc;
            }, {} as Record<string, any[]>);
        };

        // Skate categories to create sheets for
        const skateCategories = ['Beginner', 'Fancy', 'Inline', 'Quad'];

        skateCategories.forEach((category) => {
            // Filter participants for this skate category
            const catParticipants = filteredParticipants.filter(
                (p: any) => (p.skateCategory || '').toUpperCase() === category.toUpperCase()
            );
            // Group by age group
            const ageGroups = groupBy(catParticipants, 'ageGroup');
            let sheetRows: any[] = [];
            let serial = 1;
            Object.keys(ageGroups).forEach((ageGroup) => {
                const group = ageGroups[ageGroup];
                // Split by gender
                const males = group.filter((p: any) => (p.player?.gender || '').toUpperCase() === 'MALE');
                const females = group.filter((p: any) => (p.player?.gender || '').toUpperCase() === 'FEMALE');

                // Add Age Group header
                sheetRows.push([`${ageGroup} - MALE`]);
                sheetRows.push(excelHeader);
                males.forEach((p: any) => {
                    const selectedRaceNames = Array.isArray(p.selectedRaces)
                        ? p.selectedRaces.map((race: any) => (race?.name || '').toUpperCase())
                        : [];
                    const raceColumns = raceNames.map((raceName: string) =>
                        selectedRaceNames.includes(raceName) ? 'YES' : ''
                    );
                    sheetRows.push([
                        (serial++).toString().toUpperCase(),
                        (p.id || '').toString().toUpperCase(),
                        (p.skateCategory || '').toUpperCase(),
                        (p.ageGroup || '').toUpperCase(),
                        p.dob
                            ? new Date(p.dob).toLocaleDateString('en-GB', {
                                day: '2-digit',
                                month: 'short',
                                year: 'numeric'
                            }).replace(/ /g, ' ').toLocaleUpperCase()
                            : '',
                        (p.player?.gender || '').toUpperCase(),
                        (p.player?.name || p.name || '').toUpperCase(),
                        (p.player?.aadharNumber || '').toUpperCase(),
                        (p.clubName || '').toUpperCase(),
                        (p.chestNumber || '').toString().toUpperCase(),
                        ...raceColumns,
                        p.regDate
                            ? new Date(p.regDate).toLocaleDateString('en-GB', {
                                day: '2-digit',
                                month: 'short',
                                year: 'numeric'
                            }).replace(/ /g, ' ').toLocaleUpperCase()
                            : '',
                        (Number(p.amountPaid) > 0 ? 'PAID' : 'NOT PAID'),
                        (p.amountPaid || '').toString().toUpperCase(),
                        (p.player?.districtName || '').toUpperCase(),
                        (p.player?.stateName || '').toUpperCase(),
                    ]);
                });

                sheetRows.push([`${ageGroup} - FEMALE`]);
                sheetRows.push(excelHeader);
                females.forEach((p: any) => {
                    const selectedRaceNames = Array.isArray(p.selectedRaces)
                        ? p.selectedRaces.map((race: any) => (race?.name || '').toUpperCase())
                        : [];
                    const raceColumns = raceNames.map((raceName: string) =>
                        selectedRaceNames.includes(raceName) ? 'YES' : ''
                    );
                    sheetRows.push([
                        (serial++).toString().toUpperCase(),
                        (p.id || '').toString().toUpperCase(),
                        (p.skateCategory || '').toUpperCase(),
                        (p.ageGroup || '').toUpperCase(),
                        p.dob
                            ? new Date(p.dob).toLocaleDateString('en-GB', {
                                day: '2-digit',
                                month: 'short',
                                year: 'numeric'
                            }).replace(/ /g, ' ').toLocaleUpperCase()
                            : '',
                        (p.player?.gender || '').toUpperCase(),
                        (p.player?.name || p.name || '').toUpperCase(),
                        (p.player?.aadharNumber || '').toUpperCase(),
                        (p.clubName || '').toUpperCase(),
                        (p.chestNumber || '').toString().toUpperCase(),
                        ...raceColumns,
                        p.regDate
                            ? new Date(p.regDate).toLocaleDateString('en-GB', {
                                day: '2-digit',
                                month: 'short',
                                year: 'numeric'
                            }).replace(/ /g, ' ').toLocaleUpperCase()
                            : '',
                        (Number(p.amountPaid) > 0 ? 'PAID' : 'NOT PAID'),
                        (p.amountPaid || '').toString().toUpperCase(),
                        (p.player?.districtName || '').toUpperCase(),
                        (p.player?.stateName || '').toUpperCase(),
                    ]);
                });
            });

            // Only add sheet if there are participants
            if (sheetRows.length > 0) {
                const wsCat = XLSX.utils.aoa_to_sheet(sheetRows);

                // Add blue background to header rows in category sheets
                sheetRows.forEach((row, rowIdx) => {
                    if (
                        Array.isArray(row) &&
                        row.length === excelHeader.length &&
                        row.every((cell, i) => cell === excelHeader[i])
                    ) {
                        for (let colIdx = 0; colIdx < row.length; colIdx++) {
                            const cellRef = XLSX.utils.encode_cell({ r: rowIdx, c: colIdx });
                            if (!wsCat[cellRef]) wsCat[cellRef] = { t: "s", v: excelHeader[colIdx] };
                            wsCat[cellRef].s = headerCellStyle;
                        }
                    }
                });

                XLSX.utils.book_append_sheet(wb, wsCat, category);
            }
        });

        XLSX.writeFile(wb, 'event_participants.xlsx');
    };


    const columns = [
        {
            key: 'serialNo',
            label: 'S.NO',
            sortable: false,
            render: (value: any) => <span>{String(value).toUpperCase()}</span>
        },
        {
            key: 'chestNumber',
            label: 'CHEST NO',
            render: (value: any) => <span>{String(value).toUpperCase()}</span>
        },
        {
            key: 'name',
            label: 'NAME',
            render: (value: string, event: any) => (
                <div>
                    <div>{(event?.player?.name || event?.name || '').toUpperCase()}</div>
                </div>
            )
        },
        {
            key: 'clubName',
            label: 'CLUB NAME',
            render: (value: any) => <span>{String(value).toUpperCase()}</span>
        },
        {
            key: 'ageGroup',
            label: 'AGE GROUP',
            render: (value: any) => <span>{String(value).toUpperCase()}</span>
        },
        {
            key: 'skateCategory',
            label: 'CATEGORY',
            render: (value: any) => <span>{String(value).toUpperCase()}</span>
        },
        {
            key: 'amountPaid',
            label: 'AMOUNT',
            render: (value: any) => <span>{String(value).toUpperCase()}</span>
        },
        {
            key: 'regDate',
            label: 'REG DATE',
            render: (value: string, event: any) => (
                <div>
                    <div>
                        {event?.regDate
                            ? new Date(event.regDate).toLocaleDateString('en-GB', {
                                day: '2-digit',
                                month: 'short',
                                year: 'numeric'
                            }).replace(/ /g, ' ').toUpperCase()
                            : ''}
                    </div>
                </div>
            )
        },
        {
            key: 'aadharNumber',
            label: 'AADHAR NO',
            render: (value: string, event: any) => (
                <div>
                    <div>{(event?.player?.aadharNumber || '').toUpperCase()}</div>
                </div>
            )
        },
        {
            key: 'view',
            label: 'VIEW',
            render: (value: number, event: any) => (
                <div className="flex items-center space-x-2">
                    <Button size="sm" variant="secondary"
                        onClick={() => { setOpenModal(!openModal), setEventData(event) }}
                        title="VIEW DETAILS">
                        <Eye size={16} />
                    </Button>
                    <Button
                        size="sm"
                        onClick={() => {
                            setEditData(event);
                            setEditOpen(true);
                        }}
                    >
                        <Edit size={16} />
                    </Button>

                </div>
            )
        }
    ];

    const eventAdminWithSerial = filteredParticipants?.map((event: any, index: any) => ({
        ...event,
        serialNo: index + 1,
    }));

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
            try {
                const response = await axios.get(
                    `${baseURL}stats_export/event-race-summary-excel?eventId=${eventId}`
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

    return (
        <div className="space-y-4">
            <h2 className="text-2xl font-bold flex">
                {/* <span onClick={() => navigate(-1)} className="cursor-pointer mt-1 mr-4">
                    <ArrowLeft size={24} />
                </span> */}
                {event ? event[0]?.event?.name : ''} Participants {filteredParticipants.length > 0 ? `(${filteredParticipants.length})` : ''}
            </h2>

            <Card>
                <div className="px-6 py-4 border-b border-gray-200 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div className="relative w-full md:w-64">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <input
                            type="text"
                            placeholder="Search participants..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        <button
                            disabled={isLoading}
                            onClick={handleExportProfileImages}
                            className={`flex items-center px-3 py-2 text-white rounded-md text-sm transition-colors ${isLoading
                                ? "bg-blue-400 cursor-not-allowed"
                                : "bg-blue-600 hover:bg-blue-700"
                                }`}
                        >
                            {isLoading ? (
                                <>
                                    {/* Spinning Loader Icon (Optional) */}
                                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Exporting...
                                </>
                            ) : (
                                <>
                                    <Download size={16} className="mr-1" />
                                    Profile image Export
                                </>
                            )}
                        </button>
                        <button
                            onClick={handleExport}
                            className="flex items-center px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm"
                        >
                            <Download size={16} className="mr-1" />
                            Export
                        </button>
                    </div>
                </div>

  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4 mt-2">

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
                        onClick={
                            exportRaceGenderAge
                        }
                    />  
                </div>

                <div className="p-6">
                    <Table columns={columns} data={eventAdminWithSerial} />
                </div>
            </Card>

            <RegistrationModal
                selectedEvent={eventData}
                isOpen={openModal}
                onClose={() => setOpenModal(!openModal)}
            />

            <EditRegistrationBasicModal
                isOpen={editOpen}
                onClose={() => setEditOpen(false)}
                registration={editData}
                onSuccess={() => {
                    fetchParticipants();
                }}
            />

        </div>
    );
};

export default EventParticipantsDetails;
