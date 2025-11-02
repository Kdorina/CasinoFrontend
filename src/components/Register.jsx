import React, { useState } from "react";
import "./Register.css";

const Register = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    accountNumber: "",
    birthDate: "",
    idPhoto: null,
    facePhoto: null,
  });

  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState("");

  // 🧮 életkor kiszámítása
  const calculateAge = (birthDate) => {
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const m = today.getMonth() - birth.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return age;
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.username.trim()) {
      newErrors.username = "A felhasználónév megadása kötelező.";
    } else if (formData.username.length < 3) {
      newErrors.username = "A felhasználónév legalább 3 karakter legyen.";
    }

    if (!formData.email) {
      newErrors.email = "Az email megadása kötelező.";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Érvénytelen email cím formátum.";
    }

    // 🧠 születési dátum és életkor
    if (!formData.birthDate) {
      newErrors.birthDate = "A születési dátum megadása kötelező.";
    } else {
      const age = calculateAge(formData.birthDate);
      if (age < 18) {
        newErrors.birthDate = "A regisztrációhoz legalább 18 évesnek kell lenned.";
      }
    }

    if (!formData.password) {
      newErrors.password = "A jelszó megadása kötelező.";
    } else if (formData.password.length < 6) {
      newErrors.password = "A jelszó legalább 6 karakter legyen.";
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "A jelszavak nem egyeznek.";
    }

    if (!formData.accountNumber) {
      newErrors.accountNumber = "A számlaszám megadása kötelező.";
    } else if (!/^\d{8}-\d{8}$/.test(formData.accountNumber)) {
      newErrors.accountNumber =
        "Érvénytelen formátum! (pl. 12345678-12345678)";
    }

    if (!formData.idPhoto) {
      newErrors.idPhoto = "Kérlek töltsd fel a személyi igazolvány fotóját.";
    }

    if (!formData.facePhoto) {
      newErrors.facePhoto = "Kérlek töltsd fel az arcképedet.";
    }

    return newErrors;
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.files[0] });
  };

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
        <div className="form-grid">
          <div className="form-group">
            <label>Felhasználónév</label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
            />
            {errors.username && <p className="error">{errors.username}</p>}
          </div>

          <div className="form-group">
            <label>Email cím</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
            />
            {errors.email && <p className="error">{errors.email}</p>}
          </div>

          <div className="form-group">
            <label>Születési dátum</label>
            <input
              type="date"
              name="birthDate"
              value={formData.birthDate}
              onChange={handleChange}
            />
            {errors.birthDate && <p className="error">{errors.birthDate}</p>}
          </div>

          <div className="form-group">
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
          </div>

          <div className="form-group">
            <label>Jelszó</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
            />
            {errors.password && <p className="error">{errors.password}</p>}
          </div>

          <div className="form-group">
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
          </div>
        </div>

        <div className="form-files">
          <div>
            <label>Személyi igazolvány fotó</label>
            <input type="file" name="idPhoto" onChange={handleFileChange} />
            {errors.idPhoto && <p className="error">{errors.idPhoto}</p>}
          </div>

          <div>
            <label>Arckép fotó</label>
            <input type="file" name="facePhoto" onChange={handleFileChange} />
            {errors.facePhoto && <p className="error">{errors.facePhoto}</p>}
          </div>
        </div>

        <button type="submit">Regisztrálok</button>
      </form>

      {success && <p className="success">{success}</p>}
    </div>
  );
};

export default Register;
