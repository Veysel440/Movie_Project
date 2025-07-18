export const validateEmail = (email) => {
  const cleanEmail = email?.trim();
  return {
    isValid: !!cleanEmail && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail),
    message: "Geçerli bir e-posta adresi girin.",
  };
};

export const validateRating = (rating) => {
  const value = parseFloat(rating);
  return {
    isValid: !isNaN(value) && value >= 0 && value <= 10,
    message: "Puan 0-10 arasında olmalı.",
  };
};

export const isEmpty = (value) => {
  const clean = value?.trim();
  return {
    isValid: !!clean,
    message: "Bu alan boş bırakılamaz.",
  };
};
