import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useRouter } from "next/router";
import { register } from "../../services/api/auth";
import styles from "../../styles/auth.module.css";

export default function RegisterForm() {
  const { setUser } = useAuth();
  const router = useRouter();

  const [form, setForm] = useState({
    email: "",
    name: "",
    surname: "",
    password: "",
    userType: "oyuncu",
  });
  const [error, setError] = useState("");

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const user = await register(form);
      setUser(user);
      router.push("/protected");
    } catch (err) {
      setError(err.message || "Kayıt başarısız");
    }
  };

  return (
    <div className={styles.authContainer}>
      <div className={styles.authCard}>
        <h2 className={styles.authTitle}>Kayıt Ol</h2>
        <p className={styles.authSubtitle}>Yeni bir hesap oluşturun</p>
        <form className={styles.authForm} onSubmit={handleSubmit}>
          <div className={styles.formGroup}>
            <label className={styles.formLabel}>E-posta</label>
            <input
              name="email"
              type="email"
              placeholder="E-posta adresiniz"
              value={form.email}
              onChange={handleChange}
              className={styles.authInput}
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Ad</label>
            <input
              name="name"
              placeholder="Adınız"
              value={form.name}
              onChange={handleChange}
              className={styles.authInput}
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Soyad</label>
            <input
              name="surname"
              placeholder="Soyadınız"
              value={form.surname}
              onChange={handleChange}
              className={styles.authInput}
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Şifre</label>
            <input
              name="password"
              type="password"
              placeholder="Şifreniz"
              value={form.password}
              onChange={handleChange}
              className={styles.authInput}
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Kullanıcı Türü</label>
            <select
              name="userType"
              value={form.userType}
              onChange={handleChange}
              className={styles.authInput}
            >
              <option value="oyuncu">Oyuncu</option>
              <option value="yonetmen">Yönetmen</option>
            </select>
          </div>

          {error && <p className={styles.errorMessage}>{error}</p>}

          <button className={styles.authButton} type="submit">
            Kayıt Ol
          </button>
        </form>
      </div>
    </div>
  );
}
