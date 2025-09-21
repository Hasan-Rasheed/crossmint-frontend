import React, { useState } from "react";
import "./Dashboard.css";

const Dashboard: React.FC = () => {
  const [formData, setFormData] = useState({
    field1: "",
    field2: "",
    field3: "",
    field4: "",
  });

  const [open, setOpen] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // setOpen(false);
    // alert(`Submitted:\n${JSON.stringify(formData, null, 2)}`);
    alert("Form submitted");
    setFormData({
      field1: "",
      field2: "",
      field3: "",
      field4: "",
    });
  };

  return (
    <div
    // className="dashboard-container"
    >
      {/* <button className="open-btn" onClick={() => setOpen(true)}>
        Open Dashboard
      </button> */}

      <div className="modal-overlay" onClick={() => setOpen(false)}>
        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
          {/* <button className="close-btn" onClick={() => setOpen(false)}>
              ✕
            </button> */}
          <h2>Merchant Onboarding Form</h2>
          <form onSubmit={handleSubmit}>
            <div className="input-group">
              {/* <span>🔑</span> */}
              <input
                type="text"
                name="field1"
                placeholder="Business name"
                value={formData.field1}
                onChange={handleChange}
              />
            </div>
            <div className="input-group">
              {/* <span>📧</span> */}
              <input
                type="text"
                name="field2"
                placeholder="Business address"
                value={formData.field2}
                onChange={handleChange}
              />
            </div>
            <div className="input-group">
              {/* <span>📧</span> */}
              <input
                type="text"
                name="field3"
                placeholder="Contract information"
                value={formData.field3}
                onChange={handleChange}
              />
            </div>
            <div className="input-group">
              {/* <span>⚡</span> */}
              <input
                type="text"
                name="field4"
                placeholder="Recieving address (Arbitrum)"
                value={formData.field4}
                onChange={handleChange}
              />
            </div>

            <div className="actions">
              {/* <button type="button" className="cancel" onClick={() => setOpen(false)}>
                  Cancel
                </button> */}
              <button type="submit" className="submit">
                Submit
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
