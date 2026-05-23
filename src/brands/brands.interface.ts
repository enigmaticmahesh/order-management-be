export interface Brand {
  id?: number;
  name: string;
}

export interface BrandsListResponse {
  nextID: number;
  firstID: number;
  hasNext: boolean;
  hasPrev: boolean;
  brands: Brand[];
}
