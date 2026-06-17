const getPaginationMeta = (totalDocs, page, limit) => {
  const totalPages = Math.ceil(totalDocs / limit);
  const hasNextPage = page < totalPages;
  const hasPrevPage = page > 1;
  return {
    totalDocs,
    limit,
    totalPages,
    currentPage: page,
    hasNextPage,
    hasPrevPage,
    nextPage: hasNextPage ? page + 1 : null,
    prevPage: hasPrevPage ? page - 1 : null,
  };
};
export default getPaginationMeta;
