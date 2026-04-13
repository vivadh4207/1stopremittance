import { Request } from 'express';

export interface PaginationParams {
  skip: number;
  take: number;
  page: number;
  limit: number;
}

export function parsePagination(query: Request['query']): PaginationParams {
  const page = Math.max(1, parseInt((query['page'] as string) || '1', 10));
  const limit = Math.min(100, Math.max(1, parseInt((query['limit'] as string) || '20', 10)));
  const skip = (page - 1) * limit;

  return { skip, take: limit, page, limit };
}

export function buildPaginationMeta(
  total: number,
  page: number,
  limit: number,
): Record<string, unknown> {
  const totalPages = Math.ceil(total / limit);
  return {
    total,
    page,
    limit,
    totalPages,
    hasNextPage: page < totalPages,
    hasPrevPage: page > 1,
  };
}
