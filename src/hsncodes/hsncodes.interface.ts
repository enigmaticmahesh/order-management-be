export interface HsnCode {
  id?: number;
  code: string;
  sgst: string;
}

export interface HSNCodesListResponse {
  nextID: number;
  firstID: number;
  hasNext: boolean;
  hasPrev: boolean;
  codes: HsnCode[];
}
