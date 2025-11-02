import React, { useState } from "react";
import "./Register.css";

function Register() {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState("");

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
      newErrors.email = "Érvénytelen email formátum.";
    }

    if (!formData.password) {
      newErrors.password = "A jelszó megadása kötelező.";
    } else if (formData.password.length < 6) {
      newErrors.password = "A jelszó legalább 6 karakter legyen.";
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "A jelszavak nem egyeznek.";
    }

    return newErrors;
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
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

        <button type="submit">Regisztrálok</button>
      </form>

      {success && <p className="success">{success}</p>}
    </div>
  );
}

export default Register;