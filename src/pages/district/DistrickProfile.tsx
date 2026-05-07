import React, { useEffect, useState } from 'react';
import { Save, Upload, Building2, Mail, Phone, MapPin, Calendar, Camera, FileText, Plus } from 'lucide-react';
import Card from '../../components/UI/Card';
import Button from '../../components/UI/Button';
import FormField from '../../components/UI/FormField';
import Badge from '../../components/UI/Badge';
import axios from 'axios';
import ImageUpload from '../../components/UI/ImageUpload';

const ClubProfile: any = () => {
  const [isEditing, setIsEditing] = React.useState(false);
  const [pendingChanges, setPendingChanges] = React.useState(false);
  const [profileData, setProfileData] = useState<any>('')
  const baseUrl = import.meta.env.VITE_API_BASE_URL

  const districtSecretaryId = localStorage.getItem("userId");

  useEffect(() => {
    const fetchClubProfile = async () => {
      try {
        const response = await axios.get(
          `${baseUrl}/district_secretaries/string/${districtSecretaryId}`
        );
        setProfileData(response.data);
      } catch (error) {
        console.error('Failed to fetch players:', error);
      }
    };

    fetchClubProfile();
  }, [districtSecretaryId])


  // const [profileData, setProfileData] = React.useState({
  //   clubName: 'Thunder Skating District',
  //   clubCode: 'TSC001', // Non-editable
  //   district: 'Central District',
  //   state: 'California',
  //   contactPersonName: 'John Thunder',
  //   contactNumber: '+1234567900',
  //   email: 'info@thunderskating.com',
  //   clubAddress: '123 Sports Complex, Main Street, Central District, California',
  //   establishedYear: 2020,
  //   registrationNumber: 'TSC2020001',
  //   clubLogo: 'https://images.pexels.com/photos/1263348/pexels-photo-1263348.jpeg?auto=compress&cs=tinysrgb&w=400',
  //   clubBanner: 'https://images.pexels.com/photos/163444/sport-treadmill-tor-route-163444.jpeg?auto=compress&cs=tinysrgb&w=800',
  //   website: 'https://thunderskating.com',
  //   socialMedia: {
  //     facebook: 'https://facebook.com/thunderskating',
  //     instagram: 'https://instagram.com/thunderskating',
  //     twitter: 'https://twitter.com/thunderskating'
  //   },
  //   description: 'Thunder Skating District is a premier skating district dedicated to nurturing young talent and promoting the sport of skating in our community. We offer training programs for all skill levels and age groups.',
  //   facilities: [
  //     'Indoor skating rink',
  //     'Professional coaching staff',
  //     'Equipment rental',
  //     'Training programs for all levels'
  //   ],
  //   achievements: [
  //     'State Championship Winners 2023',
  //     'Regional Champions 2022',
  //     'Best District Award 2021'
  //   ]
  // });

  const handleSave = async () => {
    try {
      const updateApi = await axios.put(`${baseUrl}/district_secretaries/${districtSecretaryId}`, profileData);
      if (updateApi) {
        setIsEditing(false);
        setPendingChanges(true);
        // Show success message
        alert('District profile updated successfully! Changes are pending admin approval.');
      }
    } catch (error) {

    }
  };

  // const handleImageUpload = (type: 'logo' | 'banner', event: React.ChangeEvent<HTMLInputElement>) => {
  //   const file = event.target.files?.[0];
  //   if (file) {
  //     // In a real app, you would upload the file to a server
  //     const reader = new FileReader();
  //     reader.onload = (e) => {
  //       if (type === 'logo') {
  //         setProfileData({
  //           ...profileData,
  //           clubLogo: e.target?.result as string
  //         });
  //       } else {
  //         setProfileData({
  //           ...profileData,
  //           clubBanner: e.target?.result as string
  //         });
  //       }
  //     };
  //     reader.readAsDataURL(file);
  //   }
  // };

  // const addFacility = () => {
  //   setProfileData({
  //     ...profileData,
  //     facilities: [...profileData.facilities, '']
  //   });
  // };

  // const updateFacility = (index: number, value: string) => {
  //   const updatedFacilities = [...profileData.facilities];
  //   updatedFacilities[index] = value;
  //   setProfileData({
  //     ...profileData,
  //     facilities: updatedFacilities
  //   });
  // };

  // const removeFacility = (index: number) => {
  //   setProfileData({
  //     ...profileData,
  //     facilities: profileData.facilities.filter((_, i) => i !== index)
  //   });
  // };

  // const addAchievement = () => {
  //   setProfileData({
  //     ...profileData,
  //     achievements: [...profileData.achievements, '']
  //   });
  // };

  // const updateAchievement = (index: number, value: string) => {
  //   const updatedAchievements = [...profileData.achievements];
  //   updatedAchievements[index] = value;
  //   setProfileData({
  //     ...profileData,
  //     achievements: updatedAchievements
  //   });
  // };

  // const removeAchievement = (index: number) => {
  //   setProfileData({
  //     ...profileData,
  //     achievements: profileData.achievements.filter((_, i) => i !== index)
  //   });
  // };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">District Profile</h1>
          <p className="text-gray-600 mt-1">Manage your district's information and settings</p>
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
                <p>Your district profile changes have been submitted and are awaiting admin verification.</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* District Banner */}
      {/* <Card>
        <div className="relative">
          <div className="h-48 w-full rounded-lg overflow-hidden bg-gray-200">
            <img

              src='https://images.pexels.com/photos/163444/sport-treadmill-tor-route-163444.jpeg?auto=compress&cs=tinysrgb&w=800'
              alt="District Banner"
              className="w-full h-full object-cover"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = 'https://images.pexels.com/photos/163444/sport-treadmill-tor-route-163444.jpeg?auto=compress&cs=tinysrgb&w=800';
              }}
            />
          </div>
          {isEditing && (
            <label className="absolute top-4 right-4 bg-blue-600 text-white px-3 py-2 rounded-lg cursor-pointer hover:bg-blue-700 transition-colors">
              <Camera size={16} className="mr-2 inline" />
              Change Banner
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleImageUpload('banner', e)}
                className="hidden"
              />
            </label>
          )}

  
          <div className="absolute -bottom-12 left-6">
            <div className="relative">
              <div className="w-24 h-24 rounded-full overflow-hidden bg-white border-4 border-white shadow-lg">
                <img
                  src={profileData?.clubLogo}
                  src='https://images.pexels.com/photos/1263348/pexels-photo-1263348.jpeg?auto=compress&cs=tinysrgb&w=400'
                  alt="District Logo"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = 'https://images.pexels.com/photos/1263348/pexels-photo-1263348.jpeg?auto=compress&cs=tinysrgb&w=400';
                  }}
                />
              </div>
              {isEditing && (
                <label className="absolute bottom-0 right-0 bg-blue-600 text-white p-1 rounded-full cursor-pointer hover:bg-blue-700 transition-colors">
                  <Camera size={12} />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageUpload('logo', e)}
                    className="hidden"
                  />
                </label>
              )}
            </div>
          </div>
        </div>

        <div className="pt-16 px-6 pb-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">{profileData?.clubName}</h2>
              <div className="flex items-center space-x-4 mt-2">
                <Badge variant="info" size="sm">
                  {profileData?.clubCode}
                </Badge>
                <span className="text-gray-600">Est. 
                 {new Date(profileData.createdAt).toLocaleDateString()}</span>
              </div>
            </div>
          </div>
        </div>
      </Card> */}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Basic Information */}
        <Card title="Basic Information">
          <div className="space-y-4">
            <FormField label="State Name" required>
              <input
                type="text"
                value={profileData?.stateName}
                onChange={(e) => setProfileData({ ...profileData, stateName: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                readOnly
              />
              <p className="text-xs text-gray-500 mt-1">State Name cannot be changed</p>

            </FormField>

            <FormField label="District Name">
              <input
                type="text"
                value={profileData?.districtName}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50"
                readOnly
              />
              <p className="text-xs text-gray-500 mt-1">State Id cannot be changed</p>
            </FormField>

            <FormField label="aadharNumber">
              <input
                type="text"
                value={profileData?.aadharNumber}
                onChange={(e) => setProfileData({ ...profileData, aadharNumber: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50"
                maxLength={12}
              />
            </FormField>

     <FormField label="societyCertificateNumber" required>
              <input
                type="text"
                value={profileData?.societyCertificateNumber}
                onChange={(e) => setProfileData({ ...profileData, societyCertificateNumber: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </FormField>

            {/* <FormField label="Registration Number" required>
              <input
                type="text"
                value={profileData.registrationNumber}
                onChange={(e) => setProfileData({ ...profileData, registrationNumber: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                readOnly={!isEditing}
              />
            </FormField> */}

            {/* <FormField label="Established Year" required>
              <input
                type="number"
                value={profileData.establishedYear}
                onChange={(e) => setProfileData({ ...profileData, establishedYear: parseInt(e.target.value) })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                min="1900"
                max={new Date().getFullYear()}
                readOnly={!isEditing}
              />
            </FormField> */}

            {/* <FormField label="Website">
              <input
                type="url"
                value={profileData.website}
                onChange={(e) => setProfileData({ ...profileData, website: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="https://yourclub.com"
                readOnly={!isEditing}
              />
            </FormField> */}
          </div>
        </Card>

        {/* Contact Information */}
        <Card title="Contact Information">
          <div className="space-y-4">
            <FormField label="Contact Secretary Name" required>
              <input
                type="text"
                value={profileData?.secretaryName}
                onChange={(e) => setProfileData({ ...profileData, secretaryName: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                readOnly={!isEditing}
              />
            </FormField>

            <FormField label="Contact Number" required>
              <input
                type="tel"
                value={profileData?.mobileNumber}
                onChange={(e) => setProfileData({ ...profileData, mobileNumber: e.target.value })}
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

            {/* <FormField label="District" required>
              <input
                type="text"
                value={profileData?.districtName}
                onChange={(e) => setProfileData({ ...profileData, districtName: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                readOnly
              />
            </FormField> */}
{/* 
            <FormField label="State" required>
              <input
                type="text"
                value={profileData?.stateName}
                onChange={(e) => setProfileData({ ...profileData, stateName: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                readOnly
              />
            </FormField> */}
          </div>
        </Card>
      </div>

      {/* Address */}
      <Card title="Address">
        <FormField label="District Address" required>
          <textarea
            value={profileData?.address}
            onChange={(e) => setProfileData({ ...profileData, address: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            rows={3}
            readOnly={!isEditing}
          />
        </FormField>
      </Card>

      {/* Description */}
      {/* <Card title="District Description">
        <FormField label="About the District">
          <textarea
            value={profileData.description}
            onChange={(e) => setProfileData({ ...profileData, description: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            rows={4}
            placeholder="Describe your district, its mission, and what makes it special..."
            readOnly={!isEditing}
          />
        </FormField>
      </Card> */}

      {/* Social Media */}
      {/* <Card title="Social Media">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <FormField label="Facebook">
            <input
              type="url"
              value={profileData.socialMedia.facebook}
              onChange={(e) => setProfileData({ 
                ...profileData, 
                socialMedia: { ...profileData.socialMedia, facebook: e.target.value }
              })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="https://facebook.com/yourclub"
              readOnly={!isEditing}
            />
          </FormField>

          <FormField label="Instagram">
            <input
              type="url"
              value={profileData.socialMedia.instagram}
              onChange={(e) => setProfileData({ 
                ...profileData, 
                socialMedia: { ...profileData.socialMedia, instagram: e.target.value }
              })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="https://instagram.com/yourclub"
              readOnly={!isEditing}
            />
          </FormField>

          <FormField label="Twitter">
            <input
              type="url"
              value={profileData.socialMedia.twitter}
              onChange={(e) => setProfileData({ 
                ...profileData, 
                socialMedia: { ...profileData.socialMedia, twitter: e.target.value }
              })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="https://twitter.com/yourclub"
              readOnly={!isEditing}
            />
          </FormField>
        </div>
      </Card> */}

      {/* Facilities */}
      {/* <Card title="Facilities & Services">
        <div className="space-y-3">
          {profileData.facilities.map((facility, index) => (
            <div key={index} className="flex items-center space-x-2">
              <input
                type="text"
                value={facility}
                onChange={(e) => updateFacility(index, e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter facility or service"
                readOnly={!isEditing}
              />
              {isEditing && (
                <Button size="sm" variant="danger" onClick={() => removeFacility(index)}>
                  Remove
                </Button>
              )}
            </div>
          ))}
          {isEditing && (
            <Button size="sm" variant="secondary" onClick={addFacility}>
              <Plus size={16} className="mr-2" />
              Add Facility
            </Button>
          )}
        </div>
      </Card> */}

      {/* Achievements */}
      {/* <Card title="Achievements & Awards">
        <div className="space-y-3">
          {profileData.achievements.map((achievement, index) => (
            <div key={index} className="flex items-center space-x-2">
              <input
                type="text"
                value={achievement}
                onChange={(e) => updateAchievement(index, e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter achievement or award"
                readOnly={!isEditing}
              />
              {isEditing && (
                <Button size="sm" variant="danger" onClick={() => removeAchievement(index)}>
                  Remove
                </Button>
              )}
            </div>
          ))}
          {isEditing && (
            <Button size="sm" variant="secondary" onClick={addAchievement}>
              <Plus size={16} className="mr-2" />
              Add Achievement
            </Button>
          )}
        </div>
      </Card> */}
<Card title="Certificate Documents">
<ImageUpload
            label="certificateUrl"
            value={profileData.certificateUrl}
            onChange={(url) => setProfileData({ ...profileData, certificateUrl: url })}
            readOnly={!isEditing}
            uploadUrl={`${baseUrl}/upload/image/`}
          />
          </Card>
      {/* Documents */}
      {/* <Card title="District Documents">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
            <FileText className="mx-auto h-8 w-8 text-gray-400 mb-2" />
            <p className="text-sm text-gray-600 mb-2">District Registration Certificate</p>
            <Button size="sm" variant="secondary" disabled={!isEditing}>
              <Upload size={16} className="mr-2" />
              Upload Document
            </Button>
          </div>

          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
            <FileText className="mx-auto h-8 w-8 text-gray-400 mb-2" />
            <p className="text-sm text-gray-600 mb-2">Insurance Certificate</p>
            <Button size="sm" variant="secondary" disabled={!isEditing}>
              <Upload size={16} className="mr-2" />
              Upload Document
            </Button>
          </div>
        </div>

        <div className="text-sm text-gray-500 mt-4">
          <p>• Accepted formats: PDF, JPG, PNG (Max 5MB per file)</p>
          <p>• All document changes require admin verification</p>
        </div>
      </Card> */}
    </div>
  );
};

export default ClubProfile;