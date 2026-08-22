export function parsePagination(query: any) {
  return { page: Number(query.page) || 1, size: Number(query.size) || 20 };
}
export function paginatedResult(list: any[], total: number, page: number, size: number) {
  return { list, total, page, size, hasMore: page * size < total };
}
