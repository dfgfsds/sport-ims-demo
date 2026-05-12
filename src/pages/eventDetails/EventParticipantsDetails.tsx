
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

        const [showHeatsModal, setShowHeatsModal] = useState(false);

        const [heatGender, setHeatGender] = useState('');
        const [heatSkateCategory, setHeatSkateCategory] = useState('');
        const [heatRaceId, setHeatRaceId] = useState('');
        const [heatAgeGroupId, setHeatAgeGroupId] = useState('');
        const [heatLimit, setHeatLimit] = useState('');

        const [isHeatDownloading, setIsHeatDownloading] = useState(false);
        const [heatLimits, setHeatLimits] = useState<any>({
            REST: 7,
        });
            const [isLoading, setIsLoading] = useState(false);

      const handleExportProfileImages = async () => {
    try {

        setIsLoading(true);

        const response = await axios.get(
            `${baseURL}/registrations/export-images/${eventId}`
        );

        if (
            response.data.success &&
            response.data.download_link
        ) {

            window.open(
                response.data.download_link,
                "_blank"
            );

        } else {

            alert(
                response.data.message ||
                "Export failed"
            );
        }

    } catch (error) {

        console.error(
            "Export Error:",
            error
        );

        alert(
            "Something went wrong while exporting images."
        );

    } finally {

        setIsLoading(false);
    }
};

const handleExport = () => {

    if (!eventData?.length) return;

    // Get all unique race names from participants
    const raceNames = Array.from(
        new Set(
            eventData.flatMap((item: any) =>
                Array.isArray(item.selectedRaces)
                    ? item.selectedRaces.map((race: any) =>
                        (race?.name || '').toUpperCase()
                    )
                    : []
            )
        )
    );

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
        'PROFILE IMAGE URL',
    ];

    // MAIN EXCEL ROWS
    const excelRows = filteredData.map(
        (p: any, index: number) => {

            const selectedRaceNames = Array.isArray(p.selectedRaces)
                ? p.selectedRaces.map((race: any) =>
                    (race?.name || '').toUpperCase()
                )
                : [];

            const raceColumns = raceNames.map(
                (raceName: string) =>
                    selectedRaceNames.includes(raceName)
                        ? 'YES'
                        : ''
            );

            return [
                (index + 1).toString(),
                (p.id || '').toString(),
                (p.skateCategory || '').toUpperCase(),
                (p.ageGroup || '').toUpperCase(),

                p.dob
                    ? new Date(p.dob)
                        .toLocaleDateString('en-GB', {
                            day: '2-digit',
                            month: 'short',
                            year: 'numeric',
                        })
                        .toUpperCase()
                    : '',

                (p.player?.gender || '').toUpperCase(),

                (
                    p.player?.name ||
                    p.name ||
                    ''
                ).toUpperCase(),

                (
                    p.player?.aadharNumber ||
                    ''
                ).toUpperCase(),

                (
                    p.clubName ||
                    ''
                ).toUpperCase(),

                (
                    p.chestNumber ||
                    ''
                ).toString(),

                ...raceColumns,

                p.regDate
                    ? new Date(p.regDate)
                        .toLocaleDateString('en-GB', {
                            day: '2-digit',
                            month: 'short',
                            year: 'numeric',
                        })
                        .toUpperCase()
                    : '',

                Number(p.amountPaid) > 0
                    ? 'PAID'
                    : 'NOT PAID',

                (
                    p.amountPaid ||
                    ''
                ).toString(),

                (
                    p.player?.districtName ||
                    ''
                ).toUpperCase(),

                (
                    p.player?.stateName ||
                    ''
                ).toUpperCase(),

                p.profileImageUrl || '',
            ];
        }
    );

    const wb = XLSX.utils.book_new();

    // MAIN SHEET
    const ws = XLSX.utils.aoa_to_sheet([
        excelHeader,
        ...excelRows,
    ]);

    XLSX.utils.book_append_sheet(
        wb,
        ws,
        'Participants'
    );

    // HEADER STYLE
    const headerCellStyle = {
        fill: {
            patternType: 'solid',
            fgColor: { rgb: '1976D2' },
        },
        font: {
            color: { rgb: 'FFFFFF' },
            bold: true,
        },
    };

    excelHeader.forEach((_, idx) => {

        const cellRef =
            XLSX.utils.encode_cell({
                r: 0,
                c: idx,
            });

        if (!ws[cellRef]) {
            ws[cellRef] = {
                t: 's',
                v: excelHeader[idx],
            };
        }

        ws[cellRef].s =
            headerCellStyle;
    });

    // GROUP FUNCTION
    const groupBy = (
        arr: any[],
        key: string
    ) => {

        return arr.reduce(
            (acc, item) => {

                const groupKey =
                    (
                        item[key] ||
                        ''
                    ).toUpperCase();

                if (!acc[groupKey]) {
                    acc[groupKey] = [];
                }

                acc[groupKey].push(item);

                return acc;

            },
            {} as Record<string, any[]>
        );
    };

    // CATEGORY SHEETS
    const skateCategories = [
        'Beginner',
        'Fancy',
        'Inline',
        'Quad',
    ];

    skateCategories.forEach(
        (category) => {

            const catParticipants =
                filteredData.filter(
                    (p: any) =>
                        (
                            p.skateCategory ||
                            ''
                        ).toUpperCase() ===
                        category.toUpperCase()
                );

            const ageGroups =
                groupBy(
                    catParticipants,
                    'ageGroup'
                );

            let sheetRows: any[] = [];

            let serial = 1;

            Object.keys(ageGroups).forEach(
                (ageGroup) => {

                    const group =
                        ageGroups[ageGroup];

                    const males =
                        group.filter(
                            (p: any) =>
                                (
                                    p.player?.gender ||
                                    ''
                                ).toUpperCase() ===
                                'MALE'
                        );

                    const females =
                        group.filter(
                            (p: any) =>
                                (
                                    p.player?.gender ||
                                    ''
                                ).toUpperCase() ===
                                'FEMALE'
                        );

                    // MALES
                    sheetRows.push([
                        `${ageGroup} - MALE`
                    ]);

                    sheetRows.push(
                        excelHeader
                    );

                    males.forEach(
                        (p: any) => {

                            const selectedRaceNames =
                                Array.isArray(
                                    p.selectedRaces
                                )
                                    ? p.selectedRaces.map(
                                        (race: any) =>
                                            (
                                                race?.name ||
                                                ''
                                            ).toUpperCase()
                                    )
                                    : [];

                            const raceColumns =
                                raceNames.map(
                                    (
                                        raceName: string
                                    ) =>
                                        selectedRaceNames.includes(
                                            raceName
                                        )
                                            ? 'YES'
                                            : ''
                                );

                            sheetRows.push([
                                serial++,
                                p.id || '',
                                (
                                    p.skateCategory ||
                                    ''
                                ).toUpperCase(),
                                (
                                    p.ageGroup ||
                                    ''
                                ).toUpperCase(),
                                p.player?.gender ||
                                '',
                                (
                                    p.player?.name ||
                                    ''
                                ).toUpperCase(),
                                (
                                    p.clubName ||
                                    ''
                                ).toUpperCase(),
                                (
                                    p.chestNumber ||
                                    ''
                                ).toString(),
                                ...raceColumns,
                            ]);
                        }
                    );

                    // FEMALES
                    sheetRows.push([
                        `${ageGroup} - FEMALE`
                    ]);

                    sheetRows.push(
                        excelHeader
                    );

                    females.forEach(
                        (p: any) => {

                            const selectedRaceNames =
                                Array.isArray(
                                    p.selectedRaces
                                )
                                    ? p.selectedRaces.map(
                                        (race: any) =>
                                            (
                                                race?.name ||
                                                ''
                                            ).toUpperCase()
                                    )
                                    : [];

                            const raceColumns =
                                raceNames.map(
                                    (
                                        raceName: string
                                    ) =>
                                        selectedRaceNames.includes(
                                            raceName
                                        )
                                            ? 'YES'
                                            : ''
                                );

                            sheetRows.push([
                                serial++,
                                p.id || '',
                                (
                                    p.skateCategory ||
                                    ''
                                ).toUpperCase(),
                                (
                                    p.ageGroup ||
                                    ''
                                ).toUpperCase(),
                                p.player?.gender ||
                                '',
                                (
                                    p.player?.name ||
                                    ''
                                ).toUpperCase(),
                                (
                                    p.clubName ||
                                    ''
                                ).toUpperCase(),
                                (
                                    p.chestNumber ||
                                    ''
                                ).toString(),
                                ...raceColumns,
                            ]);
                        }
                    );
                }
            );

            if (sheetRows.length > 0) {

                const wsCat =
                    XLSX.utils.aoa_to_sheet(
                        sheetRows
                    );

                XLSX.utils.book_append_sheet(
                    wb,
                    wsCat,
                    category
                );
            }
        }
    );

    XLSX.writeFile(
        wb,
        'event_participants.xlsx'
    );
};
        const [limitRules, setLimitRules] =
            useState<any[]>([
                {
                    skate: heatSkateCategory || '',
                    gender: heatGender || '',
                    raceId: heatRaceId || '',
                    ageGroupId: heatAgeGroupId || '',
                    limit: '',
                },
            ]);

        useEffect(() => {
            setLimitRules((prev: any) => {
                if (!prev.length) return prev;

                // only first empty rule auto fill
                if (
                    prev[0].skate ||
                    prev[0].gender ||
                    prev[0].raceId ||
                    prev[0].ageGroupId
                ) {
                    return prev;
                }

                const updated = [...prev];

                updated[0] = {
                    ...updated[0],
                    skate: heatSkateCategory,
                    gender: heatGender,
                    raceId: heatRaceId,
                    ageGroupId: heatAgeGroupId,
                };

                return updated;
            });
        }, [
            heatSkateCategory,
            heatGender,
            heatRaceId,
            heatAgeGroupId,
        ]);

        const [restLimit, setRestLimit] =
            useState(7);

        const addLimitRule = () => {
            setLimitRules((prev) => [
                ...prev,
                {
                    skate: heatSkateCategory || '',
                    gender: heatGender || '',
                    raceId: heatRaceId || '',
                    ageGroupId: heatAgeGroupId || '',
                    limit: '',
                },
            ]);
        };

        const removeLimitRule = (
            index: number
        ) => {
            setLimitRules((prev) =>
                prev.filter(
                    (_: any, i: number) =>
                        i !== index
                )
            );
        };

        const updateLimitRule = (
            index: number,
            field: string,
            value: any
        ) => {
            setLimitRules((prev) =>
                prev.map(
                    (
                        rule: any,
                        i: number
                    ) =>
                        i === index
                            ? {
                                ...rule,
                                [field]: value,
                            }
                            : rule
                )
            );
        };


        const buildLimitObject = () => {
            const result: any = {};

            limitRules.forEach(
                (rule: any) => {
                    const keys = [];

                    if (rule.skate) {
                        keys.push(
                            rule.skate.toUpperCase()
                        );
                    }

                    if (rule.gender) {
                        keys.push(
                            rule.gender.toUpperCase()
                        );
                    }

                    if (rule.raceId) {
                        keys.push(rule.raceId);
                    }

                    if (rule.ageGroupId) {
                        keys.push(
                            rule.ageGroupId
                        );
                    }

                    const finalKey =
                        keys.join("_");

                    if (
                        finalKey &&
                        rule.limit
                    ) {
                        result[finalKey] =
                            Number(
                                rule.limit
                            );
                    }
                }
            );

            result["REST"] =
                Number(restLimit);

            return result;
        };

        const skateCategories = useMemo(() => {
            const unique = Array.from(
                new Set(
                    eventData.map(
                        (item: any) =>
                            item?.skateCategory?.toUpperCase()
                    )
                )
            );

            return unique.filter(Boolean);
        }, [eventData]);

        const genders = useMemo(() => {
            const unique = Array.from(
                new Set(
                    eventData.map(
                        (item: any) =>
                            item?.player?.gender?.toUpperCase()
                    )
                )
            );

            return unique.filter(Boolean);
        }, [eventData]);

        const buildLimitKey = () => {
            const parts = [];

            if (heatSkateCategory) {
                parts.push(
                    heatSkateCategory.toUpperCase()
                );
            }

            if (heatGender) {
                parts.push(
                    heatGender.toUpperCase()
                );
            }

            if (heatRaceId) {
                parts.push(heatRaceId);
            }

            if (heatAgeGroupId) {
                parts.push(heatAgeGroupId);
            }

            return parts.join("_");
        };

        const updateHeatLimit = (
            value: string
        ) => {
            const key =
                buildLimitKey() || "REST";

            setHeatLimits((prev: any) => ({
                ...prev,
                [key]: Number(value),
            }));
        };

        const ageGroups = useMemo(() => {
            const unique = Array.from(
                new Map(
                    eventData.map((item: any) => [
                        item.ageGroupId,
                        {
                            id: item.ageGroupId,
                            name: item.ageGroup || 'Unknown',
                        },
                    ])
                ).values()
            );

            return unique;
        }, [eventData]);

        const races = useMemo(() => {
            const raceMap = new Map();

            eventData.forEach((item: any) => {
                item.selectedRaces?.forEach((race: any) => {
                    raceMap.set(race.id, race);
                });
            });

            return Array.from(raceMap.values());
        }, [eventData]);

        const exportEventHeatsPdf = async () => {
            setIsHeatDownloading(true);

            try {
                const params = new URLSearchParams();

                params.append("eventId", eventId || "");

                if (heatGender) {
                    params.append("gender", heatGender);
                }

                if (heatSkateCategory) {
                    params.append("skateCategory", heatSkateCategory);
                }

                if (heatRaceId) {
                    params.append("raceId", heatRaceId);
                }

                if (heatAgeGroupId) {
                    params.append("ageGroupId", heatAgeGroupId);
                }

                params.append(
                    "limit",
                    JSON.stringify(
                        buildLimitObject()
                    )
                );

                const response = await axios.get(
                    `${baseURL}stats_export/event-heats-pdf?${params.toString()}`
                );

                if (response.data?.success && response.data?.download_link) {
                    const link = response.data.download_link;

                    const anchor = document.createElement("a");
                    anchor.href = link;
                    anchor.target = "_blank";

                    document.body.appendChild(anchor);
                    anchor.click();
                    document.body.removeChild(anchor);

                    setShowHeatsModal(false);

                    setHeatGender('');
                    setHeatSkateCategory('');
                    setHeatRaceId('');
                    setHeatAgeGroupId('');
                    setHeatLimit('');
                    setLimitRules([])
                } else {
                    alert("Download link not found");
                }
            } catch (error: any) {
                console.error(error);
                alert(error?.response?.data?.error || "Something went wrong , please try again.");
            } finally {
                setIsHeatDownloading(false);
            }
        };

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
                    // const link = response.data.download_url;
                    // const anchor = document.createElement("a");
                    // anchor.href = link;
                    // anchor.setAttribute("download", `Certificates_${Date.now()}.pdf`);
                    // anchor.setAttribute("target", "_blank");
                    // document.body.appendChild(anchor);
                    // anchor.click();
                    // document.body.removeChild(anchor);
                    // window.location.assign(link);
                    // setTimeout(() => {
                    //     setShowModal(false);
                    //     setIsDownloading(false);
                    //     setSelectedRegId('');
                    //     setSelectedClubId('');
                    // }, 1000);
                    // setShowModal(false);
                    // // Fields reset panrathu
                    // setSelectedRegId('');
                    // setSelectedClubId('');

                    const link = response.data.download_url;

                    // Create a hidden anchor tag
                    const anchor = document.createElement("a");
                    anchor.href = link;
                    anchor.target = "_blank"; // This opens it in a new tab
                    anchor.rel = "noopener noreferrer"; // Best practice for security/performance

                    // Append, click, and remove
                    document.body.appendChild(anchor);
                    anchor.click();

                    // Safety fallback: if the tab didn't open, use location.assign 
                    // to at least start the download in the current tab
                    setTimeout(() => {
                        if (anchor.parentNode) {
                            document.body.removeChild(anchor);
                        }
                    }, 100);

                    // Reset UI
                    setShowModal(false);
                    setIsDownloading(false);
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

        // const exportRaceGenderAge = async () => {
        //     if (!selectedGender) return;

        //     setIsExporting(true);
        //     try {
        //         const response = await axios.get(
        //             `${baseURL}stats_export/event-race-summary-excel?eventId=${eventId}&gender=${selectedGender}`
        //         );

        //         if (response.data.success && response.data.download_link) {
        //             const link = response.data.download_link;
        //             const anchor = document.createElement("a");
        //             anchor.href = link;
        //             anchor.setAttribute("download", `Race_Gender_Age_${selectedGender}.xlsx`);
        //             document.body.appendChild(anchor);
        //             anchor.click();
        //             document.body.removeChild(anchor);

        //             console.log("Download started successfully.");
        //             setShowRaceModal(false); // Success aanathum modal close aagum
        //             setSelectedGender('');   // Reset selection
        //         } else {
        //             alert("Failed to generate download link. Please try again.");
        //         }
        //     } catch (error) {
        //         console.error("Export error:", error);
        //         alert("An error occurred while exporting the Excel report.");
        //     } finally {
        //         setIsExporting(false);
        //     }
        // };
        const exportRaceGenderAge = async () => {
            // Machan, gender select pannala na 'all' nu consider pannikalam
            const genderParam = selectedGender || '';

            setIsExporting(true);
            try {
                const response = await axios.get(
                    `${baseURL}stats_export/event-race-summary-excel?eventId=${eventId}&gender=${genderParam}`
                );

                if (response.data.success && response.data.download_link) {
                    const link = response.data.download_link;
                    const anchor = document.createElement("a");
                    anchor.href = link;
                    anchor.setAttribute("download", `Race_Summary_${genderParam}.xlsx`);
                    document.body.appendChild(anchor);
                    anchor.click();
                    document.body.removeChild(anchor);

                    setShowRaceModal(false);
                    setSelectedGender('');
                } else {
                    alert("Failed to generate download link.");
                }
            } catch (error) {
                console.error("Export error:", error);
                alert("An error occurred during export.");
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
                            <Download size={16} /> Chest No Certificates
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
                    <SummaryBtn
                        label="Event Heats PDF"
                        onClick={() => setShowHeatsModal(true)}
                    />

                 
                    
                </div>
   <div className="flex flex-col md:flex-row md:items-center md:justify-end gap-4">
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
                                    <label className="mb-3 block text-xs font-bold text-gray-500 uppercase">Select Gender (Optional)</label>
                                    <div className="grid grid-cols-3 gap-2"> {/* Grid 3 ah maathiruken */}
                                        <button
                                            onClick={() => setSelectedGender('male')}
                                            className={`rounded-lg py-2 text-xs font-bold border-2 transition-all ${selectedGender === 'male' ? 'border-[#76933c] bg-[#f4f7ed] text-[#76933c]' : 'border-gray-100 text-gray-500'}`}
                                        >
                                            MALE
                                        </button>
                                        <button
                                            onClick={() => setSelectedGender('female')}
                                            className={`rounded-lg py-2 text-xs font-bold border-2 transition-all ${selectedGender === 'female' ? 'border-[#76933c] bg-[#f4f7ed] text-[#76933c]' : 'border-gray-100 text-gray-500'}`}
                                        >
                                            FEMALE
                                        </button>
                                        <button
                                            onClick={() => setSelectedGender('')}
                                            className={`rounded-lg py-2 text-xs font-bold border-2 transition-all ${selectedGender === '' ? 'border-[#76933c] bg-[#f4f7ed] text-[#76933c]' : 'border-gray-100 text-gray-500'}`}
                                        >
                                            ALL
                                        </button>
                                    </div>
                                </div>

                                {/* Download Button - Ippo gender illana kooda work aagum */}
                                <button
                                    onClick={exportRaceGenderAge}
                                    disabled={isExporting}
                                    className={`w-full rounded-lg py-3 font-bold uppercase text-white shadow-md transition-all ${isExporting ? 'bg-gray-300 cursor-not-allowed' : 'bg-[#76933c] hover:bg-[#5e7630] active:scale-95'}`}
                                >
                                    {isExporting ? 'Exporting...' : 'Download Excel'}
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {showHeatsModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/50 backdrop-blur-sm p-4">
                        <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl max-h-[90vh] overflow-y-auto scrollbar-hide">

                            <div className="mb-5 flex items-center justify-between border-b pb-3">
                                <h2 className="text-xl font-bold">
                                    Export Event Heats PDF
                                </h2>

                                <button
                                    onClick={() => setShowHeatsModal(false)}
                                    className="text-gray-400 hover:text-red-500"
                                >
                                    <X size={22} />
                                </button>
                            </div>

                            <div className="space-y-4">

                                {/* Gender */}
                                <div>
                                    <label className="mb-1 block text-xs font-bold uppercase text-gray-500">
                                        Gender
                                    </label>

                                    <select
                                        value={heatGender}
                                        onChange={(e) =>
                                            setHeatGender(
                                                e.target.value
                                            )
                                        }
                                        className="w-full rounded-lg border p-3"
                                    >
                                        <option value="">
                                            ALL
                                        </option>

                                        {genders.map(
                                            (gender: string) => (
                                                <option
                                                    key={gender}
                                                    value={gender}
                                                >
                                                    {gender}
                                                </option>
                                            )
                                        )}
                                    </select>
                                </div>

                                {/* Skate Category */}
                                <div>
                                    <label className="mb-1 block text-xs font-bold uppercase text-gray-500">
                                        Skate Category
                                    </label>

                                    <select
                                        value={heatSkateCategory}
                                        onChange={(e) =>
                                            setHeatSkateCategory(
                                                e.target.value
                                            )
                                        }
                                        className="w-full rounded-lg border p-3"
                                    >
                                        <option value="">
                                            ALL
                                        </option>

                                        {skateCategories.map(
                                            (category: string) => (
                                                <option
                                                    key={category}
                                                    value={category}
                                                >
                                                    {category}
                                                </option>
                                            )
                                        )}
                                    </select>
                                </div>

                                {/* Race */}
                                <div>
                                    <label className="mb-1 block text-xs font-bold uppercase text-gray-500">
                                        Race
                                    </label>

                                    <select
                                        value={heatRaceId}
                                        onChange={(e) => setHeatRaceId(e.target.value)}
                                        className="w-full rounded-lg border p-3"
                                    >
                                        <option value="">ALL</option>

                                        {races.map((race: any) => (
                                            <option key={race.id} value={race.id}>
                                                {race.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                {/* Age Group */}
                                <div>
                                    <label className="mb-1 block text-xs font-bold uppercase text-gray-500">
                                        Age Group
                                    </label>

                                    <select
                                        value={heatAgeGroupId}
                                        onChange={(e) => setHeatAgeGroupId(e.target.value)}
                                        className="w-full rounded-lg border p-3"
                                    >
                                        <option value="">ALL</option>

                                        {ageGroups.map((age: any) => (
                                            <option key={age.id} value={age.id}>
                                                {age.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div className="space-y-5">

                                    {/* Header */}
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <h3 className="text-sm font-black uppercase text-gray-800">
                                                Heat Limits Configuration
                                            </h3>

                                            {/* <p className="text-xs text-gray-500 mt-1">
                                                Configure multiple heat rules dynamically
                                            </p> */}
                                        </div>

                                        <button
                                            type="button"
                                            onClick={addLimitRule}
                                            className="rounded-lg bg-[#76933c] px-4 py-2 text-xs font-bold uppercase text-white shadow hover:bg-[#5e7630]"
                                        >
                                            + Add Rule
                                        </button>
                                    </div>

                                    {/* Rules */}
                                    <div className="max-h-[450px] space-y-4 overflow-y-auto pr-1">

                                        {limitRules.map(
                                            (
                                                rule: any,
                                                index: number
                                            ) => (
                                                <div
                                                    key={index}
                                                    className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm"
                                                >

                                                    {/* Top */}
                                                    <div className="mb-4 flex items-center justify-between">
                                                        <div>
                                                            <p className="text-xs font-black uppercase tracking-wide text-[#76933c]">
                                                                Rule #{index + 1}
                                                            </p>

                                                            <p className="text-[10px] text-gray-400">
                                                                Configure specific heat limit
                                                            </p>
                                                        </div>

                                                        {limitRules.length > 1 && (
                                                            <button
                                                                type="button"
                                                                onClick={() =>
                                                                    removeLimitRule(index)
                                                                }
                                                                className="rounded-lg bg-red-50 px-3 py-1 text-[10px] font-bold uppercase text-red-500 hover:bg-red-100"
                                                            >
                                                                Remove
                                                            </button>
                                                        )}
                                                    </div>

                                                    {/* Grid */}
                                                    <div className="grid grid-cols-1 gap-3 md:grid-cols-2">

                                                        {/* Skate */}
                                                        <div>
                                                            <label className="mb-1 block text-[10px] font-bold uppercase text-gray-500">
                                                                Skate
                                                            </label>

                                                            <select
                                                                value={rule.skate}
                                                                onChange={(e) =>
                                                                    updateLimitRule(
                                                                        index,
                                                                        "skate",
                                                                        e.target.value
                                                                    )
                                                                }
                                                                className="w-full rounded-xl border border-gray-200 bg-gray-50 p-3 text-sm outline-none focus:border-[#76933c]"
                                                            >
                                                                <option value="">
                                                                    ALL
                                                                </option>

                                                                {skateCategories.map(
                                                                    (
                                                                        category: string
                                                                    ) => (
                                                                        <option
                                                                            key={category}
                                                                            value={category}
                                                                        >
                                                                            {category}
                                                                        </option>
                                                                    )
                                                                )}
                                                            </select>
                                                        </div>

                                                        {/* Gender */}
                                                        <div>
                                                            <label className="mb-1 block text-[10px] font-bold uppercase text-gray-500">
                                                                Gender
                                                            </label>

                                                            <select
                                                                value={rule.gender}
                                                                onChange={(e) =>
                                                                    updateLimitRule(
                                                                        index,
                                                                        "gender",
                                                                        e.target.value
                                                                    )
                                                                }
                                                                className="w-full rounded-xl border border-gray-200 bg-gray-50 p-3 text-sm outline-none focus:border-[#76933c]"
                                                            >
                                                                <option value="">
                                                                    ALL
                                                                </option>

                                                                {genders.map(
                                                                    (
                                                                        gender: string
                                                                    ) => (
                                                                        <option
                                                                            key={gender}
                                                                            value={gender}
                                                                        >
                                                                            {gender}
                                                                        </option>
                                                                    )
                                                                )}
                                                            </select>
                                                        </div>

                                                        {/* Race */}
                                                        <div>
                                                            <label className="mb-1 block text-[10px] font-bold uppercase text-gray-500">
                                                                Race
                                                            </label>

                                                            <select
                                                                value={rule.raceId}
                                                                onChange={(e) =>
                                                                    updateLimitRule(
                                                                        index,
                                                                        "raceId",
                                                                        e.target.value
                                                                    )
                                                                }
                                                                className="w-full rounded-xl border border-gray-200 bg-gray-50 p-3 text-sm outline-none focus:border-[#76933c]"
                                                            >
                                                                <option value="">
                                                                    ALL
                                                                </option>

                                                                {races.map(
                                                                    (race: any) => (
                                                                        <option
                                                                            key={race.id}
                                                                            value={race.id}
                                                                        >
                                                                            {race.name}
                                                                        </option>
                                                                    )
                                                                )}
                                                            </select>
                                                        </div>

                                                        {/* Age Group */}
                                                        <div>
                                                            <label className="mb-1 block text-[10px] font-bold uppercase text-gray-500">
                                                                Age Group
                                                            </label>

                                                            <select
                                                                value={
                                                                    rule.ageGroupId
                                                                }
                                                                onChange={(e) =>
                                                                    updateLimitRule(
                                                                        index,
                                                                        "ageGroupId",
                                                                        e.target.value
                                                                    )
                                                                }
                                                                className="w-full rounded-xl border border-gray-200 bg-gray-50 p-3 text-sm outline-none focus:border-[#76933c]"
                                                            >
                                                                <option value="">
                                                                    ALL
                                                                </option>

                                                                {ageGroups.map(
                                                                    (age: any) => (
                                                                        <option
                                                                            key={age.id}
                                                                            value={age.id}
                                                                        >
                                                                            {age.name}
                                                                        </option>
                                                                    )
                                                                )}
                                                            </select>
                                                        </div>
                                                    </div>

                                                    {/* Limit */}
                                                    <div className="mt-3">
                                                        <label className="mb-1 block text-[10px] font-bold uppercase text-gray-500">
                                                            Heat Limit
                                                        </label>

                                                        <input
                                                            type="number"
                                                            min={1}
                                                            value={rule.limit}
                                                            onChange={(e) =>
                                                                updateLimitRule(
                                                                    index,
                                                                    "limit",
                                                                    e.target.value
                                                                )
                                                            }
                                                            placeholder="Enter limit"
                                                            className="w-full rounded-xl border border-gray-200 bg-gray-50 p-3 text-sm outline-none focus:border-[#76933c]"
                                                        />
                                                    </div>

                                                    {/* Preview */}
                                                    {/* <div className="mt-3 rounded-xl bg-[#f4f7ed] p-3">
                                                        <p className="text-[10px] font-bold uppercase text-gray-500">
                                                            Generated Key
                                                        </p>

                                                        <p className="mt-1 break-all text-xs font-black text-[#76933c]">
                                                            {[
                                                                rule.skate,
                                                                rule.gender,
                                                                rule.raceId,
                                                                rule.ageGroupId,
                                                            ]
                                                                .filter(Boolean)
                                                                .join("_") ||
                                                                "REST"}
                                                        </p>
                                                    </div> */}
                                                </div>
                                            )
                                        )}
                                    </div>

                                    {/* REST LIMIT */}
                                    <div className="rounded-2xl border-2 border-dashed border-[#76933c]/30 bg-[#f4f7ed] p-4">

                                        <div className="mb-3 flex items-center justify-between">
                                            <div>
                                                <h3 className="text-sm font-black uppercase text-[#76933c]">
                                                    REST Limit
                                                </h3>

                                                <p className="text-[10px] text-gray-500">
                                                    Applies to unmatched heats
                                                </p>
                                            </div>

                                            <div className="rounded-full bg-[#76933c] px-3 py-1 text-[10px] font-black text-white">
                                                DEFAULT
                                            </div>
                                        </div>

                                        <input
                                            type="number"
                                            min={1}
                                            value={restLimit}
                                            onChange={(e) =>
                                                setRestLimit(
                                                    Number(
                                                        e.target.value
                                                    )
                                                )
                                            }
                                            className="w-full rounded-xl border border-gray-200 bg-white p-3 text-sm outline-none focus:border-[#76933c]"
                                        />
                                    </div>

                                    {/* JSON Preview */}
                                    {/* <div className="rounded-2xl bg-black p-4">
                                        <p className="mb-2 text-xs font-bold uppercase text-green-400">
                                            Generated JSON
                                        </p>

                                        <pre className="overflow-auto text-xs text-white">
                                            {JSON.stringify(
                                                buildLimitObject(),
                                                null,
                                                2
                                            )}
                                        </pre>
                                    </div> */}
                                </div>

                                <button
                                    onClick={exportEventHeatsPdf}
                                    disabled={isHeatDownloading}
                                    className={`w-full rounded-lg py-3 font-bold uppercase text-white transition-all ${isHeatDownloading
                                        ? "bg-gray-400"
                                        : "bg-[#76933c] hover:bg-[#5e7630]"
                                        }`}
                                >
                                    {isHeatDownloading
                                        ? "Generating..."
                                        : "Download PDF"}
                                </button>
                            </div>
                        </div>
                    </div>
                )}

            </div>
        );
    };

export default EventParticipantsDetails;