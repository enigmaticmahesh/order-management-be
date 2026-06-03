interface Product {
  id?: number;
  name: string;
  mrp: string;
  price: string;
  qty: number;
  mfD: string;
  expD: string;
  sku: string;
  barCode: string;
  hsnId: number;
  brandId: number;
  subcatId: number;
}

export interface ProductWithLevelOneRelation extends Product {
  hsnCode: {
    id: number;
    code: string;
  };
  brand: {
    id: number;
    name: string;
  };
  subCat: {
    id: number;
    name: string;
  };
}

export interface ProductsListResponse {
  nextID: number;
  firstID: number;
  hasNext: boolean;
  hasPrev: boolean;
  products: ProductWithLevelOneRelation[];
}
