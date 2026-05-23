export default function paginate<T>(
  data: T[],
  currentPage: number,
  itemsPerPage: number
) {
  const safeItemsPerPage = Math.max(itemsPerPage, 1);
  const totalItems = data.length;

  const totalPages = Math.ceil(totalItems / safeItemsPerPage);

  // Clamp page biar tidak out of range
  const safePage = Math.min(Math.max(currentPage, 1), totalPages || 1);

  const startIndex = (safePage - 1) * safeItemsPerPage;
  const endIndex = startIndex + safeItemsPerPage;

  const paginatedData = data.slice(startIndex, endIndex);

  return {
    data: paginatedData,
    totalPages,
    currentPage: safePage,
    itemsPerPage: safeItemsPerPage,
    totalItems,
  };
}