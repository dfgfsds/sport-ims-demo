// import React, { useRef, useState } from 'react';
// import axios from 'axios';

// interface ImageUploadProps {
//     label: string;
//     value?: string;
//     onChange: (url: string) => void;
//     readOnly?: boolean;
//     uploadUrl: string;
// }

// const ImageUpload: React.FC<ImageUploadProps> = ({ label, value, onChange, readOnly, uploadUrl }) => {
//     const [preview, setPreview] = useState(value || '');
//     const [uploading, setUploading] = useState(false);
//     const fileInputRef = useRef<HTMLInputElement | null>(null); // ✅ ref to input

//     const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
//         const file = e.target.files?.[0];
//         if (!file) return;

//         const formData = new FormData();
//         formData.append('file', file);

//         try {
//             setUploading(true);
//             const res = await axios.post(uploadUrl, formData, {
//                 headers: { 'Content-Type': 'multipart/form-data' }
//             });

//             const imageUrl = res.data?.url || res.data?.image || '';
//             setPreview(imageUrl);
//             onChange(imageUrl);
//         } catch (err) {
//             console.error('Upload failed:', err);
//             alert('Image upload failed. Try again.');
//         } finally {
//             setUploading(false);
//         }
//     };

//     const handleRemove = () => {
//         setPreview('');
//         onChange('');

//         // ✅ Clear file input name display
//         if (fileInputRef.current) {
//             fileInputRef.current.value = '';
//         }
//     };

//     return (
//         <div>
//             <label className="block font-medium mb-1">{label}</label>

//             {preview && (
//                 <div className="mb-2">
//                     <img src={preview} alt="Preview" className="h-32 rounded border mb-1" />
//                     {!readOnly && (
//                         <button
//                             type="button"
//                             onClick={handleRemove}
//                             className="text-red-500 text-sm underline hover:text-red-700"
//                         >
//                             Remove Image
//                         </button>
//                     )}
//                 </div>
//             )}

//             {!readOnly && (
//                 <input
//                     type="file"
//                     accept="image/*"
//                     onChange={handleFileChange}
//                     className="mb-2"
//                     ref={fileInputRef} // ✅ set ref
//                 />
//             )}

//             {uploading && <p className="text-sm text-blue-600">Uploading...</p>}

//             {readOnly && !preview && <p className="text-gray-500 text-sm">No image available</p>}
//         </div>
//     );
// };

// export default ImageUpload;


import React, { useRef, useState } from 'react';
import axios from 'axios';
import Button from './Button'; // Adjust path if needed

interface ImageUploadProps {
    label: string;
    value?: string;
    onChange: (url: string) => void;
    readOnly?: boolean;
    uploadUrl: string;
    fileSize?: string;
}

const ImageUpload: React.FC<ImageUploadProps> = ({
    label,
    value,
    onChange,
    readOnly,
    uploadUrl,
    fileSize
}) => {
    const [preview, setPreview] = useState(value || '');
    const [uploading, setUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement | null>(null);

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const formData = new FormData();
        formData.append('file', file);

        try {
            setUploading(true);
            const res = await axios.post(uploadUrl, formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            const imageUrl = res.data?.url || res.data?.image || '';
            setPreview(imageUrl);
            onChange(imageUrl);
        } catch (err) {
            console.error('Upload failed:', err);
            alert('Image upload failed. Try again.');
        } finally {
            setUploading(false);
        }
    };

    const handleRemove = () => {
        setPreview('');
        onChange('');
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    const triggerFileSelect = () => {
        if (fileInputRef.current) fileInputRef.current.click();
    };

    return (
        <div>
            <label className="block font-medium mb-1">{label}</label>

            {preview && (
                <div className="mb-2">
                    <img src={preview} alt="Preview" className="h-32 rounded border mb-1" />
                    {!readOnly && (
                        <button
                            type="button"
                            onClick={handleRemove}
                            className="text-red-500 text-sm underline hover:text-red-700"
                        >
                            Remove Image
                        </button>
                    )}
                </div>
            )}

            {!readOnly && (
                <div className="flex items-center space-x-3">
                    <Button
                        size="sm"
                        variant="secondary"
                        onClick={triggerFileSelect}
                        loading={uploading}
                        disabled={uploading}
                        type='button'
                    >
                        Upload {label==='Profile Image'?'Photo':'Document'}
                    </Button>

                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        ref={fileInputRef}
                        className="hidden"
                    />
                </div>
            )}

            {fileSize && <div className='text-sm mt-2 text-red-400'>{fileSize}</div>}
            {readOnly && !preview && <p className="text-gray-500 text-sm">No image available</p>}
        </div>
    );
};

export default ImageUpload;
