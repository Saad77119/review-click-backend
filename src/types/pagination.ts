export interface PaginatedMeta {
  totalItems: number;
  start: number;
  end: number;
  perPage: number;
  currentPage: number;
  totalPages: number;
}

export interface PaginationInfoDetail extends PaginatedMeta {
  currentPage: number;
  totalPages: number;
}
export function getDefaultPaginationInfo(): PaginationInfoDetail {
  return {
    currentPage: 0,
    end: 0,
    start: 0,
    totalItems: 0,
    totalPages: 0,
    perPage: 25,
  };
}
export function extractPaginationDetail(
  info: PaginatedMeta,
): PaginationInfoDetail {
  if (info) {
    return {
      ...info,
      currentPage: Math.floor(info.start / info.perPage) + 1,
      totalPages: parseInt(
        Math.ceil(info.totalItems / info.perPage).toString(),
      ),
    };
  } else {
    return getDefaultPaginationInfo();
  }
}

export interface PaginatedResponse<T> {
  items: T[];
  paginationMeta: PaginatedMeta;
}

export interface PaginationParam {
  pageNumber: number;
  perPage: number;
}

export function getOffsetFromPagination(pagination: PaginationParam) {
  if (!pagination || !pagination.perPage || pagination.perPage == null) {
    return 0;
  }
  return (Math.max(pagination.pageNumber, 1) - 1) * pagination.perPage;
}

export async function paginator(
  options: {
    initialPage: number;
    perPage: number;
  },
  runner: (paginationParams: PaginationParam) => Promise<PaginatedMeta>,
) {
  const params: PaginationParam = {
    pageNumber: options.initialPage,
    perPage: options.perPage,
  };

  let detail: PaginationInfoDetail | null = null;
  do {
    const meta = await runner(params);
    params.pageNumber++;
    detail = extractPaginationDetail(meta);
  } while (detail.currentPage < detail.totalPages);
}

export function getPaginationMeta<T>(
  params: PaginationParam,
  result: {
    items: T[];
    total: number;
  },
): PaginatedMeta {
  const start = getOffsetFromPagination(params);

  return {
    totalPages: parseInt(Math.ceil(result.total / params.perPage).toString()),
    currentPage: params.pageNumber,
    start: start,
    end: start + result.items.length,
    perPage: params.perPage,
    totalItems: result.total,
  };
}

export function paginate<T>(
  data: T[],
  paginationDef: PaginationParam,
): Omit<PaginatedResponse<T>, 'status' | 'errors'> {
  const start = getPaginationMeta(paginationDef, {
    items: data,
    total: data.length,
  });

  const items = data.slice(start.start, start.end);
  return {
    items: items,
    paginationMeta: start,
  };
}
