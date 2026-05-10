import { useEffect, useState } from "react";

export default function usePagination<T>({
  itemsPerPage = 10,
  list,
  dependencies
}: {
  itemsPerPage: number;
  list: T[];
  dependencies?: unknown[];
}) {
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(list.length / itemsPerPage);
  const paginatedData = list.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  useEffect(() => {
    // Reset pagination when searching or changing tabs
    setCurrentPage(1);
  }, dependencies);

  return {
    currentPage,
    setCurrentPage,
    totalPages,
    paginatedData,
  }
}