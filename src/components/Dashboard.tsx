import React, { useState } from "react";
import "./Dashboard.css";

interface DashboardProps {
  isOpen: boolean;
  onClose: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    field1: "",
    field2: "",
    field3: "",
    field4: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
     
      const merchantResponse = await fetch('http://localhost:4000/merchants', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          businessName: formData.field1,
          contactInformation: formData.field3,
          businessAddress: formData.field2,
          receivingAddress: formData.field4,
        }),
      });

      if (!merchantResponse.ok) {
        throw new Error('Merchant creation failed');
      }

      const merchantData = await merchantResponse.json();
      console.log("Merchants Data", merchantData)
      alert("Form submitted successfully! Welcome to CloakPay!");
      
      setFormData({
        field1: "",
        field2: "",
        field3: "",
        field4: "",
      });
      onClose(); // Close the modal after successful submission
    } catch (error) {
      console.error('Error:', error);
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

          <div className="actions">
            <button type="button" className="cancel" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="submit">
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Dashboard;
