// import { useNavigate, useParams } from 'react-router-dom';
// import { useEffect, useState } from 'react';
// import axios from 'axios';
// import Card from '../../components/UI/Card';
// import Table from '../../components/UI/Table';
// import { ArrowLeft } from 'lucide-react';

// const baseURL = import.meta.env.VITE_API_BASE_URL;

// const EventParticipantsDetails = () => {
//     const { eventId } = useParams();
//     const navigate = useNavigate()
//     const [event, setEvent] = useState<any>(null);

//     useEffect(() => {
//         axios.get(`${baseURL}/registrations/fetch-by-event-id/${eventId}`)
//             .then(res => setEvent(res.data))
//             .catch(err => console.error(err));
//     }, [eventId]);

//     const columns = [
//         // { key: 'playerId', label: 'Participant ID' },
//         // { key: 'name', label: 'Name' },
//         {
//             key: 'name',
//             label: 'NAME',
//             render: (value: string, event: any) => (
//                 <div>
//                     <div>{(event?.player?.name || event?.name || '').toUpperCase()}</div>
//                 </div>
//             )
//         },
//         { key: 'clubName', label: 'Club Name' },
//         { key: 'chestNumber', label: 'Chest No' },
//         { key: 'ageGroup', label: 'Age' },
//         { key: 'skateCategory', label: 'Category' },
//         { key: 'amountPaid', label: 'Amount' },
//     ];

//     return (
//         <div className="space-y-4">

//             <h2 className="text-2xl font-bold flex"> <span onClick={() => navigate(-1)} className='cursor-pointer mt-1 mr-4'> <ArrowLeft size={24} />  </span> Participants - {event?.event?.name}</h2>
//             <Card>
//                 <Table
//                     columns={columns}
//                     data={event || []}
//                 />
//             </Card>
//         </div>
//     );
// };



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

        // DYNAMIC AGE GROUPS
        const ageGroups =
            useMemo(() => {
                return [
                    ...new Set(
                        filteredData
                            ?.map(
                                (
                                    item: any
                                ) =>
                                    (
                                        item?.ageGroup ||
                                        ''
                                    )
                                        .toUpperCase()
                                        .trim()
                            )
                            ?.filter(
                                Boolean
                            )
                    ),
                ]?.sort();
            }, [filteredData]);

        // DYNAMIC CATEGORIES
        const categories =
            useMemo(() => {
                return [
                    ...new Set(
                        filteredData
                            ?.map(
                                (
                                    item: any
                                ) =>
                                    (
                                        item?.skateCategory ||
                                        ''
                                    )
                                        .toUpperCase()
                                        .trim()
                            )
                            ?.filter(
                                Boolean
                            )
                    ),
                ]?.sort();
            }, [filteredData]);

        // COMMON EXCEL STYLE
        const applyExcelStyle =
            (
                ws: XLSX.WorkSheet,
                totalCols: number
            ) => {
                const range =
                    XLSX.utils.decode_range(
                        ws['!ref'] ||
                        'A1'
                    );

                for (
                    let R =
                        range.s.r;
                    R <=
                    range.e.r;
                    ++R
                ) {
                    for (
                        let C =
                            range.s.c;
                        C <=
                        range.e.c;
                        ++C
                    ) {
                        const cellAddress =
                            XLSX.utils.encode_cell(
                                {
                                    r: R,
                                    c: C,
                                }
                            );

                        if (
                            !ws[
                            cellAddress
                            ]
                        )
                            continue;

                        ws[
                            cellAddress
                        ].s = {
                            font: {
                                bold:
                                    R ===
                                    0 ||
                                    C ===
                                    totalCols -
                                    1,
                                color:
                                    R === 0
                                        ? {
                                            rgb: 'FFFFFF',
                                        }
                                        : {
                                            rgb: '000000',
                                        },
                            },

                            alignment:
                            {
                                horizontal:
                                    'center',
                                vertical:
                                    'center',
                            },

                            border: {
                                top: {
                                    style:
                                        'thin',
                                },
                                bottom:
                                {
                                    style:
                                        'thin',
                                },
                                left: {
                                    style:
                                        'thin',
                                },
                                right: {
                                    style:
                                        'thin',
                                },
                            },

                            fill: {
                                fgColor:
                                {
                                    rgb:
                                        R ===
                                            0
                                            ? '76933C'
                                            : 'FFFFFF',
                                },
                            },
                        };
                    }
                }

                ws['!cols'] =
                    Array(
                        totalCols
                    ).fill({
                        wch: 18,
                    });

                ws['!cols'][0] =
                {
                    wch: 40,
                };
            };

        // DISTRICT CATEGORY EXPORT
        const exportDistrictCategory =
            () => {
                const rows: any =
                    {};

                filteredData.forEach(
                    (
                        item: any
                    ) => {
                        const district =
                            (
                                item?.districtName ||
                                'UNKNOWN'
                            )
                                .toUpperCase()
                                .trim();

                        const club =
                            (
                                item?.clubName ||
                                'UNKNOWN'
                            ).trim();

                        const category =
                            (
                                item?.skateCategory ||
                                ''
                            )
                                .toUpperCase()
                                .trim();

                        if (
                            !rows[
                            district
                            ]
                        ) {
                            rows[
                                district
                            ] = {};
                        }

                        if (
                            !rows[
                            district
                            ][club]
                        ) {
                            rows[
                                district
                            ][club] =
                                {};

                            categories.forEach(
                                (
                                    cat
                                ) => {
                                    rows[
                                        district
                                    ][
                                        club
                                    ][
                                        cat
                                    ] = 0;
                                }
                            );
                        }

                        if (
                            rows[
                            district
                            ][club][
                            category
                            ] !==
                            undefined
                        ) {
                            rows[
                                district
                            ][club][
                                category
                            ] += 1;
                        }
                    }
                );

                const excelRows: any[] =
                    [
                        [
                            'Row Labels',
                            ...categories,
                            'Grand Total',
                        ],
                    ];

                Object.keys(
                    rows
                ).forEach(
                    (
                        district
                    ) => {
                        let districtTotal =
                            0;

                        const districtRow: any =
                            [district];

                        categories.forEach(
                            (
                                cat
                            ) => {
                                let total =
                                    0;

                                Object.values(
                                    rows[
                                    district
                                    ]
                                ).forEach(
                                    (
                                        club: any
                                    ) => {
                                        total +=
                                            club[
                                            cat
                                            ] ||
                                            0;
                                    }
                                );

                                districtRow.push(
                                    total
                                );

                                districtTotal +=
                                    total;
                            }
                        );

                        districtRow.push(
                            districtTotal
                        );

                        excelRows.push(
                            districtRow
                        );

                        Object.keys(
                            rows[
                            district
                            ]
                        ).forEach(
                            (
                                club
                            ) => {
                                const row =
                                    rows[
                                    district
                                    ][
                                    club
                                    ];

                                const clubRow: any =
                                    [
                                        '   ' +
                                        club,
                                    ];

                                let total =
                                    0;

                                categories.forEach(
                                    (
                                        cat
                                    ) => {
                                        clubRow.push(
                                            row[
                                            cat
                                            ] ||
                                            ''
                                        );

                                        total +=
                                            row[
                                            cat
                                            ] ||
                                            0;
                                    }
                                );

                                clubRow.push(
                                    total
                                );

                                excelRows.push(
                                    clubRow
                                );
                            }
                        );
                    }
                );

                const ws =
                    XLSX.utils.aoa_to_sheet(
                        excelRows
                    );

                applyExcelStyle(
                    ws,
                    categories.length +
                    2
                );

                const wb =
                    XLSX.utils.book_new();

                XLSX.utils.book_append_sheet(
                    wb,
                    ws,
                    'District Summary'
                );

                XLSX.writeFile(
                    wb,
                    'District_Category_Summary.xlsx'
                );
            };

        // AGE CATEGORY EXPORT
        const exportAgeCategory =
            () => {
                const rows: any =
                    {};

                categories.forEach(
                    (
                        cat
                    ) => {
                        rows[
                            cat
                        ] = {};

                        ageGroups.forEach(
                            (
                                age
                            ) => {
                                rows[
                                    cat
                                ][
                                    age
                                ] = 0;
                            }
                        );
                    }
                );

                filteredData.forEach(
                    (
                        item: any
                    ) => {
                        const cat =
                            (
                                item?.skateCategory ||
                                ''
                            )
                                .toUpperCase()
                                .trim();

                        const age =
                            (
                                item?.ageGroup ||
                                ''
                            )
                                .toUpperCase()
                                .trim();

                        if (
                            rows[
                            cat
                            ] &&
                            rows[
                            cat
                            ][
                            age
                            ] !==
                            undefined
                        ) {
                            rows[
                                cat
                            ][
                                age
                            ] += 1;
                        }
                    }
                );

                const excelRows: any[] =
                    [
                        [
                            'Row Labels',
                            ...ageGroups,
                            'Grand Total',
                        ],
                    ];

                categories.forEach(
                    (
                        cat
                    ) => {
                        let total =
                            0;

                        const row: any =
                            [cat];

                        ageGroups.forEach(
                            (
                                age
                            ) => {
                                row.push(
                                    rows[
                                    cat
                                    ][
                                    age
                                    ]
                                );

                                total +=
                                    rows[
                                    cat
                                    ][
                                    age
                                    ];
                            }
                        );

                        row.push(
                            total
                        );

                        excelRows.push(
                            row
                        );
                    }
                );

                const ws =
                    XLSX.utils.aoa_to_sheet(
                        excelRows
                    );

                applyExcelStyle(
                    ws,
                    ageGroups.length +
                    2
                );

                const wb =
                    XLSX.utils.book_new();

                XLSX.utils.book_append_sheet(
                    wb,
                    ws,
                    'Age Category'
                );

                XLSX.writeFile(
                    wb,
                    'Age_Category_Summary.xlsx'
                );
            };

        // GENDER AGE EXPORT
        const exportGenderAge =
            () => {
                const rows: any =
                    {};

                ageGroups.forEach(
                    (
                        age
                    ) => {
                        rows[
                            age
                        ] = {
                            FEMALE: 0,
                            MALE: 0,
                        };
                    }
                );

                filteredData.forEach(
                    (
                        item: any
                    ) => {
                        const age =
                            (
                                item?.ageGroup ||
                                ''
                            )
                                .toUpperCase()
                                .trim();

                        const gender =
                            (
                                item?.player
                                    ?.gender ||
                                ''
                            )
                                .toUpperCase()
                                .trim();

                        if (
                            rows[
                            age
                            ] &&
                            rows[
                            age
                            ][
                            gender
                            ] !==
                            undefined
                        ) {
                            rows[
                                age
                            ][
                                gender
                            ] += 1;
                        }
                    }
                );

                const excelRows: any[] =
                    [
                        [
                            'Row Labels',
                            'FEMALE',
                            'MALE',
                            'Grand Total',
                        ],
                    ];

                ageGroups.forEach(
                    (
                        age
                    ) => {
                        excelRows.push(
                            [
                                age,
                                rows[
                                    age
                                ]
                                    .FEMALE,
                                rows[
                                    age
                                ].MALE,
                                rows[
                                    age
                                ]
                                    .FEMALE +
                                rows[
                                    age
                                ]
                                    .MALE,
                            ]
                        );
                    }
                );

                const ws =
                    XLSX.utils.aoa_to_sheet(
                        excelRows
                    );

                applyExcelStyle(
                    ws,
                    4
                );

                const wb =
                    XLSX.utils.book_new();

                XLSX.utils.book_append_sheet(
                    wb,
                    ws,
                    'Gender Age'
                );

                XLSX.writeFile(
                    wb,
                    'Gender_Age_Summary.xlsx'
                );
            };

        // RACE GENDER AGE EXPORT
        const exportRaceGenderAge =
            () => {
                const rows: any =
                    {};

                filteredData.forEach(
                    (
                        item: any
                    ) => {
                        const gender =
                            (
                                item?.player
                                    ?.gender ||
                                ''
                            )
                                .toUpperCase()
                                .trim();

                        item?.selectedRaces?.forEach(
                            (
                                race: any
                            ) => {
                                const raceName =
                                    (
                                        race?.name ||
                                        'UNKNOWN'
                                    ).trim();

                                if (
                                    !rows[
                                    raceName
                                    ]
                                ) {
                                    rows[
                                        raceName
                                    ] = {
                                        FEMALE: 0,
                                        MALE: 0,
                                    };
                                }

                                if (
                                    rows[
                                    raceName
                                    ][
                                    gender
                                    ] !==
                                    undefined
                                ) {
                                    rows[
                                        raceName
                                    ][
                                        gender
                                    ] += 1;
                                }
                            }
                        );
                    }
                );

                const excelRows: any[] =
                    [
                        [
                            'Row Labels',
                            'FEMALE',
                            'MALE',
                            'Grand Total',
                        ],
                    ];

                Object.keys(
                    rows
                ).forEach(
                    (
                        race
                    ) => {
                        excelRows.push(
                            [
                                race,
                                rows[
                                    race
                                ]
                                    .FEMALE,
                                rows[
                                    race
                                ].MALE,
                                rows[
                                    race
                                ]
                                    .FEMALE +
                                rows[
                                    race
                                ]
                                    .MALE,
                            ]
                        );
                    }
                );

                const ws =
                    XLSX.utils.aoa_to_sheet(
                        excelRows
                    );

                applyExcelStyle(
                    ws,
                    4
                );

                const wb =
                    XLSX.utils.book_new();

                XLSX.utils.book_append_sheet(
                    wb,
                    ws,
                    'Race Gender Age'
                );

                XLSX.writeFile(
                    wb,
                    'Race_Gender_Age.xlsx'
                );
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

                    <h2 className="flex items-center text-2xl font-bold">
                        <span
                            onClick={() =>
                                navigate(
                                    -1
                                )
                            }
                            className="mr-4 cursor-pointer"
                        >
                            <ArrowLeft
                                size={24}
                            />
                        </span>

                        Participants -
                        {eventData?.[0]
                            ?.event
                            ?.name ||
                            'Event'}
                    </h2>

                    {/* SEARCH */}
                    <div className="relative">
                        <Search
                            className="absolute left-3 top-2.5 text-gray-400"
                            size={18}
                        />

                        <input
                            type="text"
                            placeholder="Search participants..."
                            value={
                                searchTerm
                            }
                            onChange={(
                                e
                            ) =>
                                setSearchTerm(
                                    e.target
                                        .value
                                )
                            }
                            className="w-full rounded-lg border py-2 pl-10 pr-4 outline-none focus:ring-2 focus:ring-[#76933c] md:w-72"
                        />
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
                        onClick={
                            exportRaceGenderAge
                        }
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
            </div>
        );
    };

export default EventParticipantsDetails;