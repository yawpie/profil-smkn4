export function formatDate(published_date) {
  const localDate = new Date(published_date).toLocaleString("id-ID", {
    timeZone: "Asia/Jakarta",
    dateStyle: "long",
    timeStyle: "short",
  });

  return localDate;
}
