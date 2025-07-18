import * as yup from "yup";

export const seriesRatingSchema = yup.object().shape({
  userEmail: yup
    .string()
    .email("Geçerli bir e-posta girin")
    .required("E-posta gereklidir"),
  comment: yup
    .string()
    .max(500, "Yorum 500 karakterden uzun olamaz")
    .optional(),
  rating: yup
    .number()
    .min(1, "Puan 1-5 arasında olmalı")
    .max(5, "Puan 1-5 arasında olmalı")
    .required("Puan gereklidir"),
});
