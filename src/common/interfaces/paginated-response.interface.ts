export interface PaginatedResponse<T> {
  data      : T[];
  total     : number;
  page      : number;
  per_page  : number;
  page_count: number;
  has_next  : boolean;
  has_prev  : boolean;
}