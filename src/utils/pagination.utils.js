export const getPagination = (current_page, total_count, query_limit) => {
  const total_pages = Math.ceil(Number(total_count) / Number(query_limit));
  return {
    current_page,
    next_page:
      Number(current_page) < total_pages ? Number(current_page) + 1 : null,
    prev_page: Number(current_page) > 1 ? Number(current_page) - 1 : null,
    total_pages,
    total_count,
  };
};
