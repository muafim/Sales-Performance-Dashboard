export interface SalesRecord {
  retailer: string;
  retailerId: number;
  date: string;
  month: number;
  monthName: string;
  region: string;
  state: string;
  beverageBrand: string;
  pricePerUnit: number;
  unitsSold: number;
  revenue: number;
}

export interface SalesAggregate {
  revenue: number;
  unitsSold: number;
  sumPricePerUnit: number;
  count: number;
}

export interface NamedAggregate extends SalesAggregate {
  name: string;
}
