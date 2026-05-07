// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import { Typography, Select, Spin, Empty } from "antd";
// import Card from '../../components/UI/Card';
// import Table from '../../components/UI/Table';
// import PageHeader from '../../components/UI/PageHeader'; // Assuming you have this component

// const { Title } = Typography;
// const { Option } = Select;

// interface Event {
//     id: string;
//     name: string;
// }

// interface ClubRegistration {
//     clubId: string;
//     clubName: string;
//     registrationCount: number;
// }

// const DistrictEventReport: React.FC = () => {
//     const [events, setEvents] = useState<Event[]>([]);
//     const [selectedEventId, setSelectedEventId] = useState<string>("");
//     const [registrations, setRegistrations] = useState<ClubRegistration[]>([]);
//     const [loading, setLoading] = useState(false);

//     useEffect(() => {
//         const fetchEvents = async () => {
//             try {
//                 const res = await axios.get("https://sportims-api.justvy.com/events/");
//                 setEvents(res.data);
//             } catch {
//                 setEvents([]);
//             }
//         };
//         fetchEvents();
//     }, []);

//     useEffect(() => {
//         if (!selectedEventId) return;
//         setLoading(true);
//         axios
//             .get(
//                 `https://sportims-api.justvy.com/registrations/clubs/${selectedEventId}/3/`
//             )
//             .then((res) => setRegistrations(res.data))
//             .catch(() => setRegistrations([]))
//             .finally(() => setLoading(false));
//     }, [selectedEventId]);

//     const columns = [
//         {
//             title: "Club Name",
//             dataIndex: "clubName",
//             key: "clubName",
//         },
//         {
//             title: "Registrations Count",
//             dataIndex: "registrationCount",
//             key: "registrationCount",
//         },
//     ];

//     return (
//         <div className="main-container" style={{ padding: "32px 24px", maxWidth: 900, margin: "0 auto" }}>
//             <PageHeader title="District Event Club Registrations" />
//             <Card children={undefined} ></Card>
//                 <div style={{ marginBottom: 24, display: "flex", alignItems: "center", gap: 16 }}>
//                     <Select
//                         style={{ minWidth: 250 }}
//                         placeholder="Select Event"
//                         value={selectedEventId || undefined}
//                         onChange={setSelectedEventId}
//                         showSearch
//                         optionFilterProp="children"
//                     >
//                         <Option value="">-- Select Event --</Option>
//                         {events.map((event) => (
//                             <Option key={event.id} value={event.id}>
//                                 {event.name}
//                             </Option>
//                         ))}
//                     </Select>
//                 </div>
//                 {loading ? (
//                     <Spin />
//                 ) : selectedEventId ? (
//                     registrations.length === 0 ? (
//                         <Empty description="No registrations found." />
//                     ) : (
//                         <Table
//                             columns={columns}
//                             dataSource={registrations}
//                             rowKey="clubId"
//                             pagination={false}
//                         />
//                     )
//                 ) : null}
//             </Card>
//         </div>
//     );
// };

// export default DistrictEventReport;
