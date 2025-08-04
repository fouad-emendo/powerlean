import React, { useState } from 'react';
import { uploadData } from 'aws-amplify/storage';

export function FileUpload() {
  const [file, setFile] = useState<File | null>(null);
  const [uploadStatus, setUploadStatus] = useState('');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setUploadStatus('Please select a file first');
      return;
    }

    try {
      setUploadStatus('Uploading...');
      const result = await uploadData({
        key: `public/${file.name}`,
        data: file,
      }).result;
      setUploadStatus('Upload successful!');
      console.log('Upload result:', result);
    } catch (err: unknown) {
      const error = err as Error;
      setUploadStatus(`Upload failed: ${error.message}`);
      console.error('Error uploading file:', error);
    }
  };

  return (
    <div className="file-upload">
      <h2>File Upload</h2>
      <input 
        type="file" 
        onChange={handleFileChange}
        style={{ marginBottom: '1rem' }}
      />
      <button 
        onClick={handleUpload}
        disabled={!file}
        style={{ 
          padding: '0.5rem 1rem',
          marginLeft: '1rem'
        }}
      >
        Upload File
      </button>
      {uploadStatus && (
        <p style={{ marginTop: '1rem' }}>{uploadStatus}</p>
      )}
    </div>
  );
} 