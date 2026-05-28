export interface Category {
  id?: number;
  name: string;
}

export interface CatsListResponse {
  nextID: number;
  firstID: number;
  hasNext: boolean;
  hasPrev: boolean;
  categories: Category[];
}
