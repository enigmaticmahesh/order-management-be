export interface HsnCode {
  id?: number;
  code: string;
  sgst: number;
}

// DB saves row as this, coz drizzle saves sgst as string
export interface DbHsnCode extends Omit<HsnCode, 'sgst'> {
  sgst: string;
}
