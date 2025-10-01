import React, { useState } from "react";
import "./Dashboard.css";
import Loader from "../common/Loader/Loader";

interface DashboardProps {
  isOpen: boolean;
  onClose: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ isOpen, onClose }) => {

  const [formData, setFormData] = useState<{
    field1: string;
    field2: string;
    field3: string;
    field4: string;
    image: File | null;
  }>({
    field1: "",
    field2: "",
    field3: "",
    field4: "",
    image: null,
  });

  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(true); 

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setFormData({ ...formData, image: file });
      setPreview(URL.createObjectURL(file)); // <-- generate preview
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
     setLoading(true); 

    try {
      // Prepare FormData
      const data = new FormData();
      data.append("businessName", formData.field1);
      data.append("businessAddress", formData.field2);
      data.append("contactInformation", formData.field3);
      data.append("receivingAddress", formData.field4);

      console.log('data', data);
      console.log('form data', formData)


      if (formData.image) {
        data.append("file", formData.image); // Key must match NestJS FileInterceptor
      }

      // Send to backend
      const response = await fetch("http://localhost:4000/merchants", {
        method: "POST",
        body: data,
      });

      if (!response.ok) {
        throw new Error("Merchant creation failed");
      }

      const result = await response.json();
      console.log("Response Data:", result);

      alert("Form submitted successfully! Welcome to CloakPay!");

      // Reset form
      setFormData({
        field1: "",
        field2: "",
        field3: "",
        field4: "",
        image: null,
      });
      onClose(); // Close modal if applicable
      setLoading(false);
    } catch (error) {
      console.error("Error:", error);
      setLoading(false);
      alert("Error submitting form. Please try again.");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="close-btn" onClick={onClose}>
          ✕
        </button>
        <h2>Merchant Onboarding Form</h2>
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <input
              type="text"
              name="field1"
              placeholder="Business name"
              value={formData.field1}
              onChange={handleChange}
              required
            />
          </div>
          <div className="input-group">
            <input
              type="text"
              name="field2"
              placeholder="Business address"
              value={formData.field2}
              onChange={handleChange}
              required
            />
          </div>
          <div className="input-group">
            <input
              type="email"
              name="field3"
              placeholder="Contact email"
              value={formData.field3}
              onChange={handleChange}
              required
            />
          </div>
          <div className="input-group">
            <input
              type="text"
              name="field4"
              placeholder="Receiving address (Arbitrum)"
              value={formData.field4}
              onChange={handleChange}
              required
            />
          </div>



          <div className="input-group">
            <label htmlFor="imageUpload">Upload Image:</label>
            <input
              id="imageUpload"
              name="image"
              type="file"
              placeholder="Field1"
              accept="image/*"
              onChange={handleImageChange}
            />
          </div>

    
          <div className="actions">
            <button type="button" className="cancel" onClick={onClose}>
              Cancel
            </button>
            {/* <button type="submit" className="submit">
              Submit
            </button> */}
             <button type="submit" className="submit" disabled={loading}>
              {loading ? <Loader /> : "Submit"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Dashboard;
