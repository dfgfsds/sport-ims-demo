import React, { useEffect } from 'react';
import { Save, Upload, User, Mail, Phone, Calendar, MapPin, Award, Camera } from 'lucide-react';
import Card from '../../components/UI/Card';
import Button from '../../components/UI/Button';
import FormField from '../../components/UI/FormField';
import Badge from '../../components/UI/Badge';
import { mockClubs } from '../../data/mockData';
import { usePlayer } from '../../context/PlayerContext';
import axios from 'axios';
import ImageUpload from '../../components/UI/ImageUpload';
import { useClubs } from '../../context/ClubContext';
import { useDistricts } from '../../context/DistrictContext';
import { useStates } from '../../context/StateContext';

const PlayerProfile: React.FC = () => {
  const baseURL = import.meta.env.VITE_API_BASE_URL;
  const { player, fetchPlayer } = usePlayer();
  const [profileData, setProfileData] = React.useState<any>(null);
  const [isEditing, setIsEditing] = React.useState(false);
  const [pendingChanges, setPendingChanges] = React.useState(false);
  const { clubs } = useClubs();
  const { districts } = useDistricts();
  const { states } = useStates();
  useEffect(() => {
    if (player) {
      setProfileData(player);
    }
  }, [player]);

  console.log(player,"player");

  // useEffect(() => {
  //   // If you need to fetch clubs here, ensure your context provides a fetch method or handle fetching elsewhere.
  //   // Example (if needed): await fetchClubs(); or remove this effect if not needed.
  // }, [baseURL]);


  const calculateAge = (dateOfBirth: string) => {
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    const age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      return age - 1;
    }
    return age;
  };

  const handleSave = async () => {
    try {
      // Only include fields that have changed
      const updateData: any = {};
      if (profileData?.mobileNumber !== player?.mobileNumber) updateData.mobileNumber = profileData?.mobileNumber;
      if (profileData?.email !== player?.email) updateData.email = profileData?.email;
      if (profileData?.clubId !== player?.clubId) updateData.clubId = profileData?.clubId;
      if (profileData?.districtName !== player?.districtName) updateData.districtName = profileData?.districtName;
      if (profileData?.stateName !== player?.stateName) updateData.stateName = profileData?.stateName;

      // Add other fields as needed
      if (profileData?.name !== player?.name) updateData.name = profileData?.name;
      // if (profileData?.dob !== player?.dob) updateData.dob = profileData?.dob;
      // if (profileData?.gender !== player?.gender) updateData.gender = profileData?.gender;
      if (profileData?.skateCategory !== player?.skateCategory) updateData.skateCategory = profileData?.skateCategory;
      if (profileData?.address !== player?.address) updateData.address = profileData?.address;
      if (profileData?.profileImageUrl !== player?.profileImageUrl) updateData.profileImageUrl = profileData?.profileImageUrl;
      if (profileData?.aadharImageUrl !== player?.aadharImageUrl) updateData.aadharImageUrl = profileData?.aadharImageUrl;
      // If you add more fields to the profile, add similar checks here

      if (Object.keys(updateData).length === 0) {
        setIsEditing(false);
        return;
      }

      const response = await axios.put(`${baseURL}/players/${player?.playerId}`, updateData);
      console.log('Profile updated:', response.data);

      setIsEditing(false);
      setPendingChanges(true);

      if (fetchPlayer) fetchPlayer();
    } catch (err) {
      console.error('Failed to update profile:', err);
      alert('Failed to update profile. Please try again.');
    }
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // In a real app, you would upload the file to a server
      const reader = new FileReader();
      reader.onload = (e) => {
        setProfileData({
          ...profileData,
          profileImage: e.target?.result as string
        });
      };
      reader.readAsDataURL(file);
    }
  };

  // const selectedClub = mockClubs.find(club => club.id === profileData.clubId);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Profile</h1>
          <p className="text-gray-600 mt-1">Manage your personal and sports profile information</p>
        </div>
        <div className="flex space-x-3">
          {isEditing ? (
            <>
              <Button variant="secondary" onClick={() => setIsEditing(false)}>
                Cancel
              </Button>
              <Button onClick={handleSave}>
                <Save size={16} className="mr-2" />
                Save Changes
              </Button>
            </>
          ) : (
            <Button onClick={() => setIsEditing(true)}>
              Edit Profile
            </Button>
          )}
        </div>
      </div>
      {/* 
      {pendingChanges && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Calendar className="h-5 w-5 text-yellow-400" />
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-yellow-800">
                Changes Pending Approval
              </h3>
              <div className="mt-2 text-sm text-yellow-700">
                <p>Your profile changes have been submitted and are awaiting admin verification.</p>
              </div>
            </div>
          </div>
        </div>
      )} */}

      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <div className="flex items-center">
          <div className="ml-3">
            <div className=" text-sm text-yellow-700">
              <p className="">
<strong>Note:</strong> If you want to edit <span className="font-medium">State</span>, <span className="font-medium">District</span>, or <span className="font-medium">Club Name</span>, please contact the admin.
              </p>
            </div>
          </div>
        </div>
      </div>


      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Picture and Basic Info */}
        <Card>
          <div className="text-center">
            <div className="relative inline-block">
              <div className="w-32 h-32 rounded-full overflow-hidden mx-auto mb-4 bg-gray-200">
                <img
                  src={profileData?.profileImageUrl}
                  alt={profileData?.name}
                  className="w-full h-full object-cover"
                // onError={(e) => {
                //   const target = e.target as HTMLImageElement;
                //   target.src = 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=400';
                // }}
                />
              </div>

              {isEditing && (
                <div className="mt-2">
                  <ImageUpload
                    label="Profile Image"
                    value={profileData?.profileImageUrl}
                    onChange={(url) => setProfileData({ ...profileData, profileImageUrl: url })}
                    readOnly={!isEditing}
                    uploadUrl={`${baseURL}/upload/image/`}
                  />
                </div>
              )}
            </div>


            <h2 className="text-xl font-semibold text-gray-900">{profileData?.name}</h2>
            <p className="text-gray-600">{profileData?.clubName}</p>
            <div className="flex justify-center space-x-2 mt-2">
              <Badge variant="info" size="sm">
                {profileData?.skateCategory?.charAt(0).toUpperCase() + profileData?.skateCategory?.slice(1)}
              </Badge>
              <Badge variant="default" size="sm">
                Age {calculateAge(profileData?.dob)}
              </Badge>
            </div>
          </div>
        </Card>

        {/* Personal Information */}
        <div className="lg:col-span-2">
          <Card title="Personal Information">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField label="Full Name" required>
                <input
                  type="text"
                  value={profileData?.name}
                  onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  readOnly={!isEditing}
                />
              </FormField>

              <FormField label="Email Address" required>
                <input
                  type="email"
                  value={profileData?.email}
                  onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  readOnly={!isEditing}
                />
              </FormField>

              <FormField label="Phone Number" required>
                <input
                  type="tel"
                  value={profileData?.mobileNumber}
                  onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  readOnly={!isEditing}
                />
              </FormField>

              <FormField label="Date of Birth" required>
                <input
                  type="date"
                  value={
                    profileData?.dob
                      ? new Date(profileData.dob).toISOString().slice(0, 10)
                      : ''
                  }
                  onChange={(e) => setProfileData({ ...profileData, dob: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  readOnly={!isEditing}
                />
              </FormField>

              <FormField label="Gender" required>
                <select
                  value={profileData?.gender}
                  onChange={(e) => setProfileData({ ...profileData, gender: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  disabled={!isEditing}
                >
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </FormField>

              <FormField label="Skating Category" required>
                <select
                  value={profileData?.skateCategory}
                  onChange={(e) => setProfileData({ ...profileData, skateCategory: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  disabled={!isEditing}
                >
                  <option value="Beginner">Beginner</option>
                  <option value="Fancy">Fancy</option>
                  <option value="Inline">Inline</option>
                  <option value="Quad">Quad</option>
                </select>
              </FormField>
            </div>

            <div className="mt-4">
              <FormField label="Club Name">
              <select
                value={profileData?.clubId || ''}
                onChange={(e) => setProfileData({ ...profileData, clubId: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                disabled={!isEditing || profileData?.clubName !== null}
              >

                <option value="" disabled>Select Club</option>
                
                {clubs.map((club: any) => (
                  <option key={club.id} value={club.id}>
                  {club.clubName}
                  </option>
                ))}
              </select>
              </FormField>
            </div>

            <div className="mt-4">
              <FormField label="Address">
                <textarea
                  value={profileData?.address}
                  onChange={(e) => setProfileData({ ...profileData, address: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows={2}
                  readOnly={!isEditing}
                />
              </FormField>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">

              <FormField label="State" required>
                <select
                  value={profileData?.stateName || ''}
                  onChange={(e) => setProfileData({ ...profileData, stateName: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  disabled={!isEditing || !!profileData?.stateName}
                >
                  <option value="" disabled>Select State</option>
                  {states.map((state: any) => (
                    <option key={state.id} value={state.name}>
                      {state.name}
                    </option>
                  ))}
                </select>
              </FormField>

              <FormField label="District" required>
                <select
                  value={profileData?.districtName || ''}
                  onChange={(e) => setProfileData({ ...profileData, districtName: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  disabled={!isEditing || !!profileData?.districtName}
                >
                  <option value="" disabled>Select District</option>
                    {districts
                    .filter((district: any) => district.stateId === states.find((state: any) => state.name === profileData?.stateName)?.id)
                    .map((district: any) => (
                    <option key={district.id} value={district.name}>
                      {district.name}
                    </option>
                  ))}
                </select>
              </FormField>

            </div>
          </Card>
        </div>
      </div>


      {/* Document Upload Section */}
      <Card title="Documents & Certificates">
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">


            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              <Upload className="mx-auto h-8 w-8 text-gray-400 mb-2" />
              <p className="text-sm text-gray-600 mb-2">Aadhar Card</p>
              {
                isEditing ?
                 <ImageUpload
                    label="Aadhar Card"
                    value={profileData?.aadharImageUrl}
                    onChange={(url) => setProfileData({ ...profileData, aadharImageUrl: url })}
                    readOnly={!isEditing}
                    uploadUrl={`${baseURL}/upload/image/`}
                  />
                  :
                  <a target='_blank' href={profileData?.aadharImageUrl} rel="noopener noreferrer" className="bg-gray-200 text-gray-900 hover:bg-gray-300 focus:ring-gray-500 px-3 py-1.5 text-sm inline-flex items-center justify-center font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed'">View Document</a>
              }

              {/* <Button size="sm" variant="secondary" disabled={!isEditing}>
                Upload Document
              </Button> */}
            </div>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              <Upload className="mx-auto h-8 w-8 text-gray-400 mb-2" />
              <p className="text-sm text-gray-600 mb-2">Date of Birth Certificate</p>
              <Button size="sm" variant="secondary" disabled={!isEditing}>
                Upload Document
              </Button>
            </div>
          </div>

          <div className="text-sm text-gray-500">
            <p>• Accepted formats: PDF, JPG, PNG (Max 5MB per file)</p>
            <p>• All document changes require admin verification</p>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default PlayerProfile;

