import React, { useState, useEffect } from "react";
import "./profile.css";
import Navbar from "./Navbar.jsx";

export default function Profile() {
  const [form, setForm] = useState({
    name: "Casono Ferenc",
    email: "",
    phone: "",
    birthdate: "",
    bankAccount: "",
  });

  // Betöltés localStorage-ból
  useEffect(() => {
    const saved = localStorage.getItem("userProfile");
    if (saved) {
      setForm(JSON.parse(saved));
    }
  }, []);

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    localStorage.setItem("userProfile", JSON.stringify(form));
    alert("Profil adatai elmentve!");
  };

  const handleDelete = () => {
    setForm({
      name: "",
      email: "",
      phone: "",
      birthdate: "",
      bankAccount: "",
    });
    localStorage.removeItem("userProfile");
  };

  return (
    <div className="profile-page">
      
      {/* NAVBAR */}
      <Navbar 
        tokens={200}
        onLogout={() => alert("Kijelentkezve!")}
      />

      <div className="profile-content">

        {/* Avatar */}
        <div className="profile-avatar"></div>

        {/* Form */}
        <div className="profile-right">
          <h2>{form.name || "Név megadása..."}</h2>

          <input
            className="profile-input"
            placeholder="Név"
            value={form.name}
            onChange={(e) => handleChange("name", e.target.value)}
          />

          <input
            className="profile-input"
            placeholder="Email cím"
            value={form.email}
            onChange={(e) => handleChange("email", e.target.value)}
          />

          <input
            className="profile-input"
            placeholder="Telefonszám"
            value={form.phone}
            onChange={(e) => handleChange("phone", e.target.value)}
          />

          <input
            className="profile-input"
            placeholder="Születési dátum"
            value={form.birthdate}
            onChange={(e) => handleChange("birthdate", e.target.value)}
          />

          <input
            className="profile-input"
            placeholder="Bankszámlaszám (HUxx...)"
            value={form.bankAccount}
            onChange={(e) => handleChange("bankAccount", e.target.value)}
          />

          <div className="button-row">
            <button className="save-btn" onClick={handleSave}>Mentés</button>
            <button className="delete-btn" onClick={handleDelete}>Törlés</button>
          </div>
        </div>
      </div>
    </div>
  );
}
