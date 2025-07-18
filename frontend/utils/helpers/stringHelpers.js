export const truncateDescription = (text = "", maxLength = 50) => {
  const cleanText = text?.trim();
  if (!cleanText) return "Bilinmiyor";
  return cleanText.length <= maxLength
    ? cleanText
    : cleanText.slice(0, maxLength) + "...";
};

export const formatText = (text = "", maxWords = 10) => {
  const cleanText = text?.trim();
  if (!cleanText) return "Bilinmiyor";
  const words = cleanText.split(/\s+/);
  return words.length > maxWords
    ? words.slice(0, maxWords).join(" ") + "..."
    : cleanText;
};
