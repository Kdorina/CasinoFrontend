import React, { useState } from "react";
import "./RegisterForm.css";

const RegisterForm = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    accountNumber: "",
    idPhoto: null,
    facePhoto: null,
  });

  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState("");

  // 🧠 Validáció
  const validate = () => {
    const newErrors = {};

    // Felhasználónév
    if (!formData.username.trim()) {
      newErrors.username = "A felhasználónév megadása kötelező.";
    } else if (formData.username.length < 3) {
      newErrors.username = "A felhasználónév legalább 3 karakter legyen.";
    }

    // Email
    if (!formData.email) {
      newErrors.email = "Az email megadása kötelező.";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Érvénytelen email cím formátum.";
    }

    // Jelszó
    if (!formData.password) {
      newErrors.password = "A jelszó megadása kötelező.";
    } else if (formData.password.length < 6) {
      newErrors.password = "A jelszó legalább 6 karakter legyen.";
    }

    // Jelszó megerősítése
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "A jelszavak nem egyeznek.";
    }

    // Számlaszám ellenőrzés (magyar formátum: 8+8 számjegy)
    if (!formData.accountNumber) {
      newErrors.accountNumber = "A számlaszám megadása kötelező.";
    } else if (!/^\d{8}-\d{8}$/.test(formData.accountNumber)) {
      newErrors.accountNumber =
        "Érvénytelen formátum! (pl. 12345678-12345678)";
    }

    // Képfeltöltés (személyi + arckép)
    if (!formData.idPhoto) {
      newErrors.idPhoto = "Kérlek töltsd fel a személyi igazolvány fotóját.";
    }
    if (!formData.facePhoto) {
      newErrors.facePhoto = "Kérlek töltsd fel az arcképedet.";
    }

    return newErrors;
  };

  // Mezőváltozás
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Kép feltöltés
  const handleFileChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.files[0] });
  };

  // Beküldés
  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validate();

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setSuccess("");
    } else {
      setErrors({});
      setSuccess("✅ Sikeres regisztráció!");
      console.log("Regisztrált adatok:", formData);
    }
  };

  return (
    <div className="register-container">
      <h2>Regisztráció</h2>
      <form onSubmit={handleSubmit}>
        <label>Felhasználónév</label>
        <input
          type="text"
          name="username"
          value={formData.username}
          onChange={handleChange}
        />
        {errors.username && <p className="error">{errors.username}</p>}

        <label>Email cím</label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
        />
        {errors.email && <p className="error">{errors.email}</p>}

        <label>Jelszó</label>
        <input
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
        />
        {errors.password && <p className="error">{errors.password}</p>}

        <label>Jelszó megerősítése</label>
        <input
          type="password"
          name="confirmPassword"
          value={formData.confirmPassword}
          onChange={handleChange}
        />
        {errors.confirmPassword && (
          <p className="error">{errors.confirmPassword}</p>
        )}

        <label>Számlaszám</label>
        <input
          type="text"
          name="accountNumber"
          placeholder="pl. 12345678-12345678"
          value={formData.accountNumber}
          onChange={handleChange}
        />
        {errors.accountNumber && (
          <p className="error">{errors.accountNumber}</p>
        )}

        <label>Személyi igazolvány fotó</label>
        <input type="file" name="idPhoto" onChange={handleFileChange} />
        {errors.idPhoto && <p className="error">{errors.idPhoto}</p>}

        <label>Arckép fotó</label>
        <input type="file" name="facePhoto" onChange={handleFileChange} />
        {errors.facePhoto && <p className="error">{errors.facePhoto}</p>}

        <button type="submit">Regisztrálok</button>
      </form>

      {success && <p className="success">{success}</p>}
    </div>
  );
};

export default RegisterForm;
