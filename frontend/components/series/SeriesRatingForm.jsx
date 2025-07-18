import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import styles from "../../styles/ratingForm.module.css";

export default function SeriesRatingForm({ link, onSuccess, className }) {
  const { user } = useAuth();
  const [comment, setComment] = useState("");
  const [rating, setRating] = useState(0);
  const [email, setEmail] = useState("");
  const [error, setError] = useState(null);

  const handleStarClick = (star) => {
    setRating(star);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (rating <= 0) {
      setError("Lütfen yıldız puanı seçin.");
      return;
    }

    const finalEmail = user?.email || email || "anonymous";

    if (!finalEmail.includes("@")) {
      setError("Geçerli bir e-posta adresi girin.");
      return;
    }

    const data = {
      LINK: `https://dizimag.eu/dizi/${link}`,
      EMAIL: finalEmail,
      RATING: rating,
      COMMENT: comment || null,
      TYPE: "series",
    };

    try {
      const res = await fetch("/api/pending-ratings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await res.json();
      if (result.success) {
        setComment("");
        setRating(0);
        setEmail("");
        setError(null);
        if (onSuccess) onSuccess();
      } else {
        setError(result.message || "Kaydedilemedi");
      }
    } catch (err) {
      setError("Bir hata oluştu, tekrar deneyin.");
    }
  };

  return (
    <form
      className={`${styles.ratingForm} ${className}`}
      onSubmit={handleSubmit}
    >
      {!user?.email && (
        <input
          type="email"
          placeholder="E-posta adresiniz"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className={styles.emailInput}
        />
      )}

      <textarea
        placeholder="Yorumunuzu yazın..."
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        maxLength={500}
        className={styles.commentArea}
      />

      <div className={styles.starsWrapper}>
        {[1, 2, 3, 4, 5].map((star) => (
          <span
            key={star}
            className={`${styles.star} ${rating >= star ? styles.filled : ""}`}
            onClick={() => handleStarClick(star)}
          >
            ★
          </span>
        ))}
      </div>

      {error && <p className={styles.error}>{error}</p>}

      <button type="submit" className={styles.submitButton}>
        Gönder
      </button>
    </form>
  );
}
