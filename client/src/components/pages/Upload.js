import React, { useState } from 'react';
import './Upload.css';
import Footer from '../Footer';
import { useNavigate } from 'react-router-dom';

function Upload() {
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [uploadError, setUploadError] = useState('');
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setUploadError('');
      setUploadSuccess(false);
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!image) {
      setUploadError('Please select an image before submitting.');
      return;
    }

    const formData = new FormData();
    formData.append('image', image);

    setLoading(true);
    setUploadError('');
    setUploadSuccess(false);

    try {
      const response = await fetch('http://localhost:5000/recipes/upload', {
        method: 'POST',
        body: formData,
        credentials: 'include'
      });

      const data = await response.json();

      if (response.ok) {
        setLoading(false);
        setUploadSuccess(true);
        const fridgeId = data.recipes[0].fridgeId;
        navigate(`/confirm?fridgeId=${fridgeId}`);
      } else {
        setLoading(false);
        setUploadError(data.error || 'Upload failed.');
      }
    } catch (error) {
      console.error('Upload error:', error);
      setLoading(false);
      setUploadError('An error occurred during upload.');
    }
  };

  return (
    <div>
      <div className="upload-page">
        <h1>Upload Your Fridge</h1>

        {uploadError && <h2 className="upload-error">{uploadError}</h2>}
        {uploadSuccess && <h2 className="upload-success">Fridge uploaded successfully!</h2>}

        {loading && (
          <div className="loading-indicator">
            <h3>Loading recipes</h3>
            <span className="dot">.</span>
            <span className="dot">.</span>
            <span className="dot">.</span>
          </div>
        )}

        {!loading && (
          <form className="upload-form" onSubmit={handleSubmit}>
            <input type="file" accept="image/*" onChange={handleImageChange} />
            {preview && <img src={preview} alt="Fridge Preview" className="image-preview" />}
            <button type="submit">Upload</button>
          </form>
        )}
      </div>
      <Footer />
    </div>
  );
}

export default Upload;
