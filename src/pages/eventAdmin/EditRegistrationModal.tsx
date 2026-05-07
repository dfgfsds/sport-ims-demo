// import React, { useEffect, useState } from 'react';
// import Modal from '../../components/UI/Modal';
// import FormField from '../../components/UI/FormField';
// import Button from '../../components/UI/Button';
// import axios from 'axios';
// import { CheckCircle } from 'lucide-react';
// import { toast } from 'react-toastify';

// const baseURL = 'https://sportims-api.justvy.com';

// interface Props {
//   isOpen: boolean;
//   onClose: () => void;
//   registration: any;
//   onSuccess: () => void;
// }

// const EditRegistrationBasicModal: React.FC<Props> = ({
//   isOpen,
//   onClose,
//   registration,
//   onSuccess
// }) => {

//   const [loading, setLoading] = useState(false);

//   const [ageGroups, setAgeGroups] = useState<any[]>([]);
//   const [states, setStates] = useState<any[]>([]);
//   const [districts, setDistricts] = useState<any[]>([]);
//   const [clubs, setClubs] = useState<any[]>([]);

//   const [form, setForm] = useState({
//     ageGroupId: '',
//     stateId: '',
//     districtId: '',
//     clubId: '',
//     profileImageUrl: ''
//   });

//   /* ---------------- PREFILL ---------------- */
//   useEffect(() => {
//     if (!registration) return;

//     setForm({
//       ageGroupId: registration.ageGroupId || '',
//       stateId: registration.stateId || '',
//       districtId: registration.districtId || '',
//       clubId: registration.clubId || '',
//       profileImageUrl: registration.profileImageUrl || ''
//     });
//   }, [registration]);

//   /* ---------------- FETCH AGE GROUPS ---------------- */
//   useEffect(() => {
//     if (!registration?.event?.id) return;

//     axios
//       .get(`${baseURL}/events/age-groups/${registration.event.id}`)
//       .then(res => setAgeGroups(res.data || []))
//       .catch(() => toast.error('Failed to load age groups'));
//   }, [registration]);

//   /* ---------------- FETCH STATES ---------------- */
//   useEffect(() => {
//     axios
//       .get(`${baseURL}/states/`)
//       .then(res => setStates(res.data || []));
//   }, []);

//   /* ---------------- FETCH DISTRICTS ---------------- */
//   useEffect(() => {
//     if (!form.stateId) return;

//     axios
//       .get(`${baseURL}/districts/?stateId=${form.stateId}`)
//       .then(res => setDistricts(res.data || []));
//   }, [form.stateId]);

//   /* ---------------- FETCH CLUBS ---------------- */
//   useEffect(() => {
//     axios
//       .get(`${baseURL}/clubs/`)
//       .then(res => setClubs(res.data || []));
//   }, []);

//   /* ---------------- SUBMIT ---------------- */
//   const handleUpdate = async () => {
//     setLoading(true);

//     const payload: any = {};

//     if (form.ageGroupId !== registration.ageGroupId)
//       payload.ageGroupId = form.ageGroupId;

//     if (form.stateId !== registration.stateId)
//       payload.stateId = form.stateId;

//     if (form.districtId !== registration.districtId)
//       payload.districtId = form.districtId;

//     if (form.clubId !== registration.clubId) {
//       payload.clubId = form.clubId;
//       payload.clubName =
//         clubs.find(c => String(c.id) === String(form.clubId))?.clubName || '';
//     }

//     if (form.profileImageUrl !== registration.profileImageUrl)
//       payload.profileImageUrl = form.profileImageUrl;

//     if (Object.keys(payload).length === 0) {
//       toast.info('No changes detected');
//       setLoading(false);
//       return;
//     }

//     try {
//       await axios.put(
//         `${baseURL}/registrations/${registration.id}`,
//         payload
//       );
//       toast.success('Registration updated successfully');
//       onSuccess();
//       onClose();
//     } catch {
//       toast.error('Failed to update registration');
//     } finally {
//       setLoading(false);
//     }
//   };

//   if (!registration) return null;

//   return (
//     <Modal
//       isOpen={isOpen}
//       onClose={onClose}
//       title="Edit Registration"
//       size="lg"
//     >
//       <div className="space-y-5">

//         {/* AGE GROUP */}
//         <FormField label="Your Age Group" required>
//           <select
//             value={form.ageGroupId}
//             onChange={e =>
//               setForm({ ...form, ageGroupId: e.target.value })
//             }
//           >
//             <option value="">Select Age Group</option>
//             {ageGroups.map(ag => (
//               <option key={ag.id} value={ag.id}>
//                 {ag.ageGroupName}
//               </option>
//             ))}
//           </select>
//         </FormField>

//         {/* STATE */}
//         <FormField label="State" required>
//           <select
//             value={form.stateId}
//             onChange={e =>
//               setForm({
//                 ...form,
//                 stateId: e.target.value,
//                 districtId: '',
//                 clubId: ''
//               })
//             }
//           >
//             <option value="">Select State</option>
//             {states.map(s => (
//               <option key={s.id} value={s.id}>
//                 {s.name}
//               </option>
//             ))}
//           </select>
//         </FormField>

//         {/* DISTRICT */}
//         <FormField label="District" required>
//           <select
//             value={form.districtId}
//             onChange={e =>
//               setForm({ ...form, districtId: e.target.value })
//             }
//             disabled={!form.stateId}
//           >
//             <option value="">Select District</option>
//             {districts.map(d => (
//               <option key={d.id} value={d.id}>
//                 {d.name}
//               </option>
//             ))}
//           </select>
//         </FormField>

//         {/* CLUB */}
//         <FormField label="Club" required>
//           <select
//             value={form.clubId}
//             onChange={e =>
//               setForm({ ...form, clubId: e.target.value })
//             }
//           >
//             <option value="">Select Club</option>
//             {clubs.map(c => (
//               <option key={c.id} value={c.id}>
//                 {c.clubName}
//               </option>
//             ))}
//           </select>
//         </FormField>

//         {/* PROFILE PHOTO */}
//         <FormField label="Profile Photo">
//           {form.profileImageUrl && (
//             <img
//               src={form.profileImageUrl}
//               className="h-20 w-20 rounded-full mb-2 object-cover"
//             />
//           )}

//           <input
//             type="file"
//             accept="image/*"
//             onChange={async e => {
//               const file = e.target.files?.[0];
//               if (!file) return;

//               const formData = new FormData();
//               formData.append('file', file);

//               const res = await axios.post(
//                 `${baseURL}/upload/image/`,
//                 formData
//               );
//               setForm(prev => ({
//                 ...prev,
//                 profileImageUrl: res.data.url
//               }));
//             }}
//           />
//         </FormField>

//         {/* FOOTER */}
//         <div className="flex justify-end gap-3 pt-4 border-t">
//           <Button variant="secondary" onClick={onClose}>
//             Cancel
//           </Button>
//           <Button onClick={handleUpdate} disabled={loading}>
//             <CheckCircle size={16} className="mr-2" />
//             Update
//           </Button>
//         </div>
//       </div>
//     </Modal>
//   );
// };

// export default EditRegistrationBasicModal;

import React, { useEffect, useState } from 'react';
import Modal from '../../components/UI/Modal';
import FormField from '../../components/UI/FormField';
import Button from '../../components/UI/Button';
import axios from 'axios';
import { CheckCircle } from 'lucide-react';
import { toast } from 'react-toastify';

const baseURL = 'https://sportims-api.justvy.com';

/* 🔹 COMMON INPUT STYLE (DESIGN FIX) */
const inputClass =
  "w-full px-3 py-2 border border-gray-300 rounded-md bg-white text-gray-900 " +
  "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 " +
  "disabled:bg-gray-100 disabled:cursor-not-allowed";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  registration: any;
  onSuccess: () => void;
}

const EditRegistrationBasicModal: React.FC<Props> = ({
  isOpen,
  onClose,
  registration,
  onSuccess
}) => {
  const [loading, setLoading] = useState(false);

  const [ageGroups, setAgeGroups] = useState<any[]>([]);
  const [states, setStates] = useState<any[]>([]);
  const [districts, setDistricts] = useState<any[]>([]);
  const [clubs, setClubs] = useState<any[]>([]);

  const [form, setForm] = useState({
    ageGroupId: '',
    stateId: '',
    districtId: '',
    clubId: '',
    profileImageUrl: ''
  });

  /* ---------------- PREFILL ---------------- */
  useEffect(() => {
    if (!registration) return;

    setForm({
      ageGroupId: registration.ageGroupId || '',
      stateId: registration.stateId || '',
      districtId: registration.districtId || '',
      clubId: registration.clubId || '',
      profileImageUrl: registration.profileImageUrl || ''
    });
  }, [registration]);

  /* ---------------- AGE GROUPS ---------------- */
  useEffect(() => {
    if (!registration?.event?.id) return;

    axios
      .get(`${baseURL}/get_api/age-groups/${registration.event.id}`)
      .then(res => setAgeGroups(res.data || []))
      // .catch(() => toast.error('Failed to load age groups'));
  }, [registration]);

  /* ---------------- STATES ---------------- */
  useEffect(() => {
    axios.get(`${baseURL}/states/`).then(res => setStates(res.data || []));
  }, []);

  /* ---------------- DISTRICTS ---------------- */
  useEffect(() => {
    if (!form.stateId) return;

    axios
      .get(`${baseURL}/districts/?stateId=${form.stateId}`)
      .then(res => setDistricts(res.data || []));
  }, [form.stateId]);

  /* ---------------- CLUBS ---------------- */
  useEffect(() => {
    axios.get(`${baseURL}/clubs/`).then(res => setClubs(res.data || []));
  }, []);

  /* ---------------- UPDATE ---------------- */
  const handleUpdate = async () => {
    setLoading(true);
    const payload: any = {};

    if (form.ageGroupId !== registration.ageGroupId)
      payload.ageGroupId = form.ageGroupId;

    if (form.stateId !== registration.stateId)
      payload.stateId = form.stateId;

    if (form.districtId !== registration.districtId)
      payload.districtId = form.districtId;

    if (form.clubId !== registration.clubId) {
      payload.clubId = form.clubId;
      payload.clubName =
        clubs.find(c => String(c.id) === String(form.clubId))?.clubName || '';
    }

    if (form.profileImageUrl !== registration.profileImageUrl)
      payload.profileImageUrl = form.profileImageUrl;

    if (Object.keys(payload).length === 0) {
      toast.info('No changes detected');
      setLoading(false);
      return;
    }

    try {
      await axios.put(
        `${baseURL}/registrations/${registration.id}`,
        payload
      );
      toast.success('Registration updated successfully');
      onSuccess();
      onClose();
    } catch {
      toast.error('Failed to update registration');
    } finally {
      setLoading(false);
    }
  };

  if (!registration) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Edit Registration" size="lg">
      <div className="space-y-5">

        {/* AGE GROUP */}
        <FormField label="Your Age Group" required>
          <select
            className={inputClass}
            value={form.ageGroupId}
            onChange={e =>
              setForm({ ...form, ageGroupId: e.target.value })
            }
          >
            <option value="">Select Age Group</option>
            {ageGroups.map(ag => (
              <option key={ag.id} value={ag.id}>
                {ag.ageGroupName}
              </option>
            ))}
          </select>
        </FormField>

        {/* STATE */}
        <FormField label="State" required>
          <select
            className={inputClass}
            value={form.stateId}
            onChange={e =>
              setForm({
                ...form,
                stateId: e.target.value,
                districtId: '',
                clubId: ''
              })
            }
          >
            <option value="">Select State</option>
            {states.map(s => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </select>
        </FormField>

        {/* DISTRICT */}
        <FormField label="District" required>
          <select
            className={inputClass}
            value={form.districtId}
            onChange={e =>
              setForm({ ...form, districtId: e.target.value })
            }
            disabled={!form.stateId}
          >
            <option value="">Select District</option>
            {districts.map(d => (
              <option key={d.id} value={d.id}>
                {d.name}
              </option>
            ))}
          </select>
        </FormField>

        {/* CLUB */}
        <FormField label="Club" required>
          <select
            className={inputClass}
            value={form.clubId}
            onChange={e =>
              setForm({ ...form, clubId: e.target.value })
            }
          >
            <option value="">Select Club</option>
            {clubs.map(c => (
              <option key={c.id} value={c.id}>
                {c.clubName}
              </option>
            ))}
          </select>
        </FormField>

        {/* PROFILE PHOTO */}
        <FormField label="Profile Photo">
          {form.profileImageUrl && (
            <img
              src={form.profileImageUrl}
              className="h-20 w-20 rounded-full mb-2 object-cover border border-gray-300"
            />
          )}

          <input
            type="file"
            accept="image/*"
            className="block w-full text-sm text-gray-700
              file:mr-4 file:py-2 file:px-4
              file:rounded-md file:border-0
              file:text-sm file:font-semibold
              file:bg-blue-50 file:text-blue-700
              hover:file:bg-blue-100
              border border-gray-300 rounded-md"
            onChange={async e => {
              const file = e.target.files?.[0];
              if (!file) return;

              const formData = new FormData();
              formData.append('file', file);

              const res = await axios.post(
                `${baseURL}/upload/image/`,
                formData
              );
              setForm(prev => ({
                ...prev,
                profileImageUrl: res.data.url
              }));
            }}
          />
        </FormField>

        {/* FOOTER */}
        <div className="flex justify-end gap-3 pt-4 border-t">
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleUpdate} disabled={loading}>
            <CheckCircle size={16} className="mr-2" />
            Update
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default EditRegistrationBasicModal;
