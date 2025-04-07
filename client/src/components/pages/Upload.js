import React, { useState } from 'react';
import './Upload.css';
import Footer from '../Footer';

function Upload() {
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file)); // show preview
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!image) {
      alert('Please select an image before submitting.');
      return;
    }

    console.log('Image ready to upload:', image);
    alert('Fridge uploaded successfully!');
  };

  return (
    <div>
      <div className="upload-page">
        <h1>Upload Your Fridge</h1>
        <form className="upload-form" onSubmit={handleSubmit}>
          <input type="file" accept="image/*" onChange={handleImageChange} />
          {preview && <img src={preview} alt="Fridge Preview" className="image-preview" />}
          <button type="submit">Upload</button>
        </form>
      </div>
      <Footer />
    </div>
  );
}

export default Upload;
