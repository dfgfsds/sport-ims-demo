// import React, { useEffect, useState } from 'react';
// import { Trophy, Clock, Users, Save, Medal, Printer } from 'lucide-react';
// import Card from '../../components/UI/Card';
// import Button from '../../components/UI/Button';
// import Badge from '../../components/UI/Badge';
// import Table from '../../components/UI/Table';
// import Modal from '../../components/UI/Modal';
// import { Schedule, ScheduledPlayer } from '../../types';
// import axios from 'axios';
// import { generateResultsSheetPDF } from '../../components/pdf'

// const UpdateResults: React.FC = () => {
//   const [schedules, setSchedules] = React.useState<any>([]);
//   const [showResultsModal, setShowResultsModal] = React.useState(false);
//   const [selectedSchedule, setSelectedSchedule] = React.useState<any>(null);
//   const [participants, setParticipants] = React.useState<any>([]);
//   const [finlaResult, setFinlaResult] = useState<any>()
//   console.log(participants, "participants");

//   const [loading, setLoading] = useState(false);

//   const eventId = localStorage.getItem("eventId");


//   const fetchSchedules = async () => {
//     setLoading(true);
//     try {
//       const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/schedules/by-event/${eventId}`);
//       setSchedules(res.data);
//     } catch (error) {
//       console.error("Failed to fetch schedules", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchSchedules();
//   }, []);

//   const handleEnterResults = (schedule: Schedule) => {
//     setSelectedSchedule(schedule);
//     setParticipants(schedule.participants);
//     setShowResultsModal(true);
//   };


//   const handleSaveResults = async () => {
//     console.log("Saving results...");

//     try {
//       // Send update request for each participant
//       for (const p of participants) {
//         const payload = {
//           playerId: p.playerId,
//           scheduleId: p.scheduleId,
//           H1_score: p.H1_score ?? null,
//           H2_score: p.H2_score ?? null,
//           H3_score: p.H3_score ?? null,
//           H4_score: p.H4_score ?? null,
//           final_result: p.final_result ?? ''
//         };

//         console.log("Sending payload:", payload);

//         await axios.put(`${import.meta.env.VITE_API_BASE_URL}/schedules/participation/update-score`, payload);
//       }

//       alert('Results saved successfully!');
//       setShowResultsModal(false);
//       fetchSchedules(); // Optionally refresh schedules

//     } catch (error) {
//       console.error("Error saving results:", error);
//       alert('Failed to save some or all results. Check console for details.');
//     }
//   };

//   // NEW: Download *blank* PDF for a schedule
//   const handleDownloadBlankPDF = (schedule: Schedule) => {
//     generateResultsSheetPDF(
//       { ...schedule, participants: schedule.participants || [] },
//       { includeScores: false }
//     );
//   };

//   // NEW: Download *filled (current scores)* PDF from modal
//   const handleDownloadFilledPDF = () => {
//     if (!selectedSchedule) return;
//     // merge latest participant edits from state
//     const scheduleForPdf = {
//       ...selectedSchedule,
//       participants,
//     };
//     generateResultsSheetPDF(scheduleForPdf, { includeScores: true });
//   };


//   const columns = [
//     { key: 'raceName', label: 'Race Name', sortable: true },
//     { key: 'ageGroupName', label: 'Age Group', sortable: true },
//     {
//       key: 'skateCategory',
//       label: 'Category',
//       sortable: true,
//       render: (value: string) => (
//         <Badge variant="default" size="sm">
//           {value?.charAt(0).toUpperCase() + value?.slice(1)}
//         </Badge>
//       )
//     },
//     {
//       key: 'scheduleTime',
//       label: 'Scheduled Time',
//       render: (value: string) => new Date(value).toLocaleString()
//     },
//     {
//       key: 'participants',
//       label: 'Participants',
//       render: (value: any[]) => value.length
//     },
//     {
//       key: 'resultsEntered',
//       label: 'Status',
//       render: (value: boolean) => (
//         <Badge variant={value ? 'success' : 'warning'} size="sm">
//           {value ? 'Completed' : 'Pending'}
//         </Badge>
//       )
//     },
//     {
//       key: 'actions',
//       label: 'Actions',
//       render: (value: any, schedule: Schedule) => (
//         <div className="flex items-center space-x-2">
//           <Button
//             size="sm"
//             variant="primary"
//             onClick={() => handleEnterResults(schedule)}
//             title="Enter Results"
//           >
//             <Trophy size={16} />
//           </Button>
//           <Button size="sm" variant="secondary" title="Reschedule">
//             <Clock size={16} />
//           </Button>
//           <Button
//             size="sm"
//             variant="secondary"
//             title="Download Blank PDF"
//             onClick={() => handleDownloadBlankPDF(schedule)} // NEW
//           >
//             <Printer size={16} />
//           </Button>
//         </div>
//       )
//     }
//   ];

//   return (
//     <div className="space-y-6">
//       <div>
//         <h1 className="text-2xl font-bold text-gray-900">Update Results</h1>
//         <p className="text-gray-600 mt-1">Enter and manage race results for scheduled events</p>
//       </div>

//       {/* Summary Cards */}
//       <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//         <Card>
//           <div className="flex items-center space-x-3">
//             <div className="p-3 bg-blue-100 rounded-lg">
//               <Clock className="text-blue-600" size={24} />
//             </div>
//             <div>
//               <p className="text-sm font-medium text-gray-600">Pending Results</p>
//               <p className="text-2xl font-bold text-gray-900">
//                 {schedules.filter((s: any) => !s.resultsEntered).length}
//               </p>
//             </div>
//           </div>
//         </Card>

//         <Card>
//           <div className="flex items-center space-x-3">
//             <div className="p-3 bg-green-100 rounded-lg">
//               <Trophy className="text-green-600" size={24} />
//             </div>
//             <div>
//               <p className="text-sm font-medium text-gray-600">Completed Results</p>
//               <p className="text-2xl font-bold text-gray-900">
//                 {schedules.filter((s: any) => s.resultsEntered).length}
//               </p>
//             </div>
//           </div>
//         </Card>

//         <Card>
//           <div className="flex items-center space-x-3">
//             <div className="p-3 bg-purple-100 rounded-lg">
//               <Users className="text-purple-600" size={24} />
//             </div>
//             <div>
//               <p className="text-sm font-medium text-gray-600">Total Participants</p>
//               <p className="text-2xl font-bold text-gray-900">
//                 {schedules.reduce((sum: any, s: any) => sum + s.participants.length, 0)}
//               </p>
//             </div>
//           </div>
//         </Card>
//       </div>

//       {/* Schedules Table */}
//       <Card>
//         <Table
//           columns={columns}
//           data={schedules}
//           searchable
//           searchPlaceholder="Search schedules..."
//         />
//       </Card>

//       {/* Results Entry Modal */}
//       {selectedSchedule && (
//         <Modal
//           isOpen={showResultsModal}
//           onClose={() => setShowResultsModal(false)}
//           title={`Enter Results - ${selectedSchedule.raceName}`}
//           size="2xl"
//         >
//           <div className="space-y-6">
//             <div className="bg-gray-50 p-4 rounded-lg">
//               <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
//                 <div>
//                   <span className="font-medium">Race:</span> {selectedSchedule.raceName}
//                 </div>
//                 <div>
//                   <span className="font-medium">Age Group:</span> {selectedSchedule.ageGroupName}
//                 </div>
//                 <div>
//                   <span className="font-medium">Category:</span> {selectedSchedule?.skateCategory}
//                 </div>
//               </div>
//             </div>

//             <div className="overflow-x-auto">
//               <table className="w-full border-collapse border border-gray-300">
//                 <thead>
//                   <tr className="bg-gray-50">
//                     <th className="border border-gray-300 px-3 py-2 text-left">Player</th>
//                     {[1, 2, 3, 4].map((h) => (
//                       <th key={`H${h}`} className="border border-gray-300 px-3 py-2 text-center">
//                         H{h}
//                       </th>
//                     ))}
//                     <th className="border border-gray-300 px-3 py-2 text-left">Result</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {participants.map((participant: any) => (
//                     <tr key={participant.id} className="hover:bg-gray-50">
//                       <td className="border border-gray-300 px-3 py-2">
//                         <div>
//                           <div className="font-medium">{participant.playerName}</div>
//                           <div className="text-sm text-gray-500">{participant.club}</div>
//                         </div>
//                       </td>
//                       {['H1_score', 'H2_score', 'H3_score', 'H4_score'].map((heat) => (
//                         <td key={heat} className="border border-gray-300 px-3 py-2 text-center">
//                           <input
//                             type="number"
//                             step="0.01"
//                             value={participant[heat] ?? ''}
//                             onChange={(e) => {
//                               const score = e.target.value ? parseFloat(e.target.value) : null;
//                               setParticipants((prev: any) =>
//                                 prev.map((p: any) =>
//                                   p.id === participant.id ? { ...p, [heat]: score } : p
//                                 )
//                               );
//                             }}
//                             className="w-20 px-2 py-1 border border-gray-300 rounded text-center"
//                             placeholder="0.00"
//                             disabled={participant.status === 'dnf' || participant.status === 'dq'}
//                           />
//                         </td>
//                       ))}
//                       <td className="border border-gray-300 px-3 py-2">
//                         <input
//                           type="text"
//                           value={participant.final_result ?? ''}
//                           onChange={(e) => {
//                             const value = e.target.value;
//                             setParticipants((prev: any) =>
//                               prev.map((p: any) =>
//                                 p.id === participant.id ? { ...p, final_result: value } : p
//                               )
//                             );
//                           }}
//                           className="w-20 px-2 py-1 border border-gray-300 rounded text-center"
//                         />
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>

//             <div className="flex justify-end items-center pt-4 border-t">
//               {/* <Button onClick={calculateRanks} variant="secondary">
//                 Calculate Ranks
//               </Button> */}
//               <div className="flex space-x-3">
//                 <Button variant="secondary" onClick={() => setShowResultsModal(false)}>
//                   Cancel
//                 </Button>
//                 <Button onClick={handleSaveResults}>
//                   <Save size={16} className="mr-2" />
//                   Save Results
//                 </Button>
//               </div>
//             </div>
//           </div>
//         </Modal>
//       )}
//     </div>
//   );
// };

// export default UpdateResults;


import React, { useEffect, useState } from 'react';
import { Trophy, Clock, Users, Save, Medal, Printer } from 'lucide-react'; // NEW Printer
import Card from '../../components/UI/Card';
import Button from '../../components/UI/Button';
import Badge from '../../components/UI/Badge';
import Table from '../../components/UI/Table';
import Modal from '../../components/UI/Modal';
import { Schedule, ScheduledPlayer } from '../../types';
import axios from 'axios';
import { generateResultsSheetPDF } from '../../components/pdf'; // NEW

const UpdateResults: React.FC = () => {
  const [schedules, setSchedules] = React.useState<any>([]);
  const [showResultsModal, setShowResultsModal] = React.useState(false);
  const [selectedSchedule, setSelectedSchedule] = React.useState<any>(null);
  const [participants, setParticipants] = React.useState<any>([]);
  const [finlaResult, setFinlaResult] = useState<any>();
  const [loading, setLoading] = useState(false);

  const eventId = localStorage.getItem("eventId");

  const fetchSchedules = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/schedules/by-event/${eventId}`);
      setSchedules(res.data);
    } catch (error) {
      console.error("Failed to fetch schedules", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSchedules();
  }, []);

  const handleEnterResults = (schedule: Schedule) => {
  
    
    setSelectedSchedule(schedule);
    setParticipants(schedule.participants);
    setShowResultsModal(true);
  };

  // NEW: Download *blank* PDF for a schedule
  const handleDownloadBlankPDF = (schedule: Schedule) => {
      console.log(schedule,"schedule");
    generateResultsSheetPDF(
      { ...schedule, participants: schedule.participants || [] },
      { includeScores: false }
    );
  };

  // NEW: Download *filled (current scores)* PDF from modal
  const handleDownloadFilledPDF = () => {
    if (!selectedSchedule) return;
    // merge latest participant edits from state
    const scheduleForPdf = {
      ...selectedSchedule,
      participants,
    };
    generateResultsSheetPDF(scheduleForPdf, { includeScores: true });
  };

  const handleSaveResults = async () => {
    try {
      for (const p of participants) {
        const payload = {
          playerId: p.playerId,
          scheduleId: p.scheduleId,
          H1_score: p.H1_score ?? null,
          H2_score: p.H2_score ?? null,
          H3_score: p.H3_score ?? null,
          H4_score: p.H4_score ?? null,
          final_result: p.final_result ?? ''
        };
        await axios.put(`${import.meta.env.VITE_API_BASE_URL}/schedules/participation/update-score`, payload);
      }
      alert('Results saved successfully!');
      setShowResultsModal(false);
      fetchSchedules();
    } catch (error) {
      console.error("Error saving results:", error);
      alert('Failed to save some or all results. Check console for details.');
    }
  };

  const columns = [
    { key: 'raceName', label: 'Race Name', sortable: true },
    { key: 'ageGroupName', label: 'Age Group', sortable: true },
    {
      key: 'skateCategory',
      label: 'Category',
      sortable: true,
      render: (value: string) => (
        <Badge variant="default" size="sm">
          {value?.charAt(0).toUpperCase() + value?.slice(1)}
        </Badge>
      )
    },
    {
      key: 'scheduleTime',
      label: 'Scheduled Time',
      render: (value: string) => new Date(value).toLocaleString()
    },
    {
      key: 'participants',
      label: 'Participants',
      render: (value: any[]) => value.length
    },
    {
      key: 'resultsEntered',
      label: 'Status',
      render: (value: boolean) => (
        <Badge variant={value ? 'success' : 'warning'} size="sm">
          {value ? 'Completed' : 'Pending'}
        </Badge>
      )
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (value: any, schedule: Schedule) => (
        <div className="flex items-center space-x-2">
          <Button
            size="sm"
            variant="primary"
            onClick={() => handleEnterResults(schedule)}
            title="Enter Results"
          >
            <Trophy size={16} />
          </Button>
          <Button
            size="sm"
            variant="secondary"
            title="Download Blank PDF"
            onClick={() => handleDownloadBlankPDF(schedule)} // NEW
          >
            <Printer size={16} />
          </Button>
          <Button size="sm" variant="secondary" title="Reschedule">
            <Clock size={16} />
          </Button>
        </div>
      )
    }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Update Results</h1>
        <p className="text-gray-600 mt-1">Enter and manage race results for scheduled events</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-blue-100 rounded-lg">
              <Clock className="text-blue-600" size={24} />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Pending Results</p>
              <p className="text-2xl font-bold text-gray-900">
                {schedules.filter((s: any) => !s.resultsEntered).length}
              </p>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-green-100 rounded-lg">
              <Trophy className="text-green-600" size={24} />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Completed Results</p>
              <p className="text-2xl font-bold text-gray-900">
                {schedules.filter((s: any) => s.resultsEntered).length}
              </p>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-purple-100 rounded-lg">
              <Users className="text-purple-600" size={24} />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Total Participants</p>
              <p className="text-2xl font-bold text-gray-900">
                {schedules.reduce((sum: any, s: any) => sum + s.participants.length, 0)}
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Schedules Table */}
      <Card>
        <Table
          columns={columns}
          data={schedules}
          searchable
          searchPlaceholder="Search schedules..."
        />
      </Card>

      {/* Results Entry Modal */}
      {selectedSchedule && (
        <Modal
          isOpen={showResultsModal}
          onClose={() => setShowResultsModal(false)}
          title={`Enter Results - ${selectedSchedule.raceName}`}
          size="2xl"
        >
          <div className="space-y-6">
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <span className="font-medium">Race:</span> {selectedSchedule.raceName}
                </div>
                <div>
                  <span className="font-medium">Age Group:</span> {selectedSchedule.ageGroupName}
                </div>
                <div>
                  <span className="font-medium">Category:</span> {selectedSchedule?.skateCategory}
                </div>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full border-collapse border border-gray-300">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="border border-gray-300 px-3 py-2 text-left">Player</th>
                    {[1, 2, 3, 4].map((h) => (
                      <th key={`H${h}`} className="border border-gray-300 px-3 py-2 text-center">
                        H{h}
                      </th>
                    ))}
                    <th className="border border-gray-300 px-3 py-2 text-left">Result</th>
                  </tr>
                </thead>
                <tbody>
                  {participants.map((participant: any) => (
                    <tr key={participant.id} className="hover:bg-gray-50">
                      <td className="border border-gray-300 px-3 py-2">
                        <div>
                          <div className="font-medium">{participant.playerName}</div>
                          <div className="text-sm text-gray-500">{participant.club}</div>
                        </div>
                      </td>
                      {['H1_score', 'H2_score', 'H3_score', 'H4_score'].map((heat) => (
                        <td key={heat} className="border border-gray-300 px-3 py-2 text-center">
                          <input
                            type="number"
                            step="0.01"
                            value={participant[heat] ?? ''}
                            onChange={(e) => {
                              const score = e.target.value ? parseFloat(e.target.value) : null;
                              setParticipants((prev: any) =>
                                prev.map((p: any) =>
                                  p.id === participant.id ? { ...p, [heat]: score } : p
                                )
                              );
                            }}
                            className="w-20 px-2 py-1 border border-gray-300 rounded text-center"
                            placeholder="0.00"
                            disabled={participant.status === 'dnf' || participant.status === 'dq'}
                          />
                        </td>
                      ))}
                      <td className="border border-gray-300 px-3 py-2">
                        <input
                          type="text"
                          value={participant.final_result ?? ''}
                          onChange={(e) => {
                            const value = e.target.value;
                            setParticipants((prev: any) =>
                              prev.map((p: any) =>
                                p.id === participant.id ? { ...p, final_result: value } : p
                              )
                            );
                          }}
                          className="w-20 px-2 py-1 border border-gray-300 rounded text-center"
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex justify-between items-center pt-4 border-t">
              {/* Download filled PDF from modal */}
              <Button variant="outline" onClick={handleDownloadFilledPDF}>
                <Printer size={16} className="mr-2" />
                PDF
              </Button>

              <div className="flex space-x-3">
                <Button variant="secondary" onClick={() => setShowResultsModal(false)}>
                  Cancel
                </Button>
                <Button onClick={handleSaveResults}>
                  <Save size={16} className="mr-2" />
                  Save Results
                </Button>
              </div>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default UpdateResults;
