export const pageSize = 8;

export function paginate<T>(items: T[], requestedPage: number) {
  const totalPages = Math.max(1, Math.ceil(items.length / pageSize));
  const page = Math.min(
    totalPages,
    Math.max(1, Number.isFinite(requestedPage) ? Math.trunc(requestedPage) : 1),
  );
  const offset = (page - 1) * pageSize;
  return {
    items: items.slice(offset, offset + pageSize),
    page,
    totalPages,
    first: items.length ? offset + 1 : 0,
    last: Math.min(offset + pageSize, items.length),
  };
}
