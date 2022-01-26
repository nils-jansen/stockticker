export type TickerMessage = {
  id: string;
  price: number;
  time: Date;
  currency: string;
  exchange: string;
  quotetype: number;
  markethours: number;
  changepercent: number;
  dayvolume: number;
  dayhigh: number;
  daylow: number;
  change: number;
  shortname: string;
  expiredate: number;
  openprice: number;
  previousclose: number;
  strikeprice: number;
  underlyingsymbol: string;
  openinterest: number;
  optionstype: number;
  minioption: number;
  lastsize: number;
  bid: number;
  bidsize: number;
  ask: number;
  asksize: number;
  pricehint: number;
  vol24hr: number;
  volallcurrencies: number;
  fromcurrency: string;
  lastmarket: string;
  circulatingsupply: number;
  marketcap: number;
};
