export interface AmpereScheduleRecord {
  id: string;
  name: string;
  hoursPerDay: number;
  pricePerAmp: number;
  residentialPricePerAmp: number;
  commercialPricePerAmp: number;
  industrialPricePerAmp: number;
  customerCount: number;
  canBeDeleted: boolean;
  createdAt: string;
}
