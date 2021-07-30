export interface GiftCard {
  caption: string;
  captionLower: string;
  code: string;
  color: string;
  currency: string;
  data: string;
  desc: string;
  disclosures: string;
  discount: number;
  domain: string;
  fee: string;
  fontcolor: string;
  is_variable: boolean;
  iso: string;
  logo: string;
  max_range: number;
  min_range: number;
  sendcolor: string;
  value: string;
}

export interface DeliveryListItem {
  __type: string;
  SKU: string;
  action?: any;
  amount: number;
  apikey: string;
  barcode_format: string;
  buttontext: string;
  calltoaction: string;
  caption: string;
  card_exchangeability_options: string;
  card_status: number;
  categories?: any;
  code: string;
  color?: any;
  commission: number;
  currency: string;
  currency_symbol: string;
  current_balance: number;
  customer_ref?: any;
  data: string;
  datastore: string;
  datetimestamp: Date;
  delivery?: any;
  description?: any;
  disclosures?: any;
  discount: number;
  display_network: number;
  domain: string;
  egc: string;
  egc_key: string;
  egc_text: string;
  expiration_days: number;
  expiry_date: Date;
  fees: number;
  fontcolor: string;
  force_as_usd: boolean;
  hashfile?: any;
  host?: any;
  id: string;
  integration: number;
  is_variable: boolean;
  iso: string;
  key: string;
  logo: string;
  mandatory_print: boolean;
  max_range: number;
  merchant?: any;
  merchantid?: any;
  min_range: number;
  msg: string;
  network_discount: number;
  opened: boolean;
  opening_balance: number;
  order_id: string;
  order_payment_mask: string;
  param: string;
  placeholder: string;
  prefix: string;
  quantity: number;
  recipient?: any;
  reference: string;
  reloadable: boolean;
  request: string;
  response: string;
  retail_transaction_fee: number;
  risk?: any;
  risk_score: number;
  route: number;
  routevalue?: any;
  section?: any;
  sendcolor: string;
  sender: string;
  sessionid: string;
  status: boolean;
  stylesheet: string;
  token?: any;
  total: number;
  twoFA: number;
  twofactor: string;
  usd_billing_required: boolean;
  value: string;
  views: number;
  webservices_hook: string;
}

export interface Delivery {
  __type: string;
  ForeignCurrencyDetails?: any;
  MID: string;
  action: string;
  amount: number;
  balance: number;
  charge: number;
  code: string;
  count: number;
  currency: string;
  currency_symbol: string;
  data: string;
  discount: number;
  domain: string;
  email: string;
  fee: number;
  id: string;
  iso: string;
  items: any[];
  key?: any;
  list: DeliveryListItem[];
  mobile: string;
  msg: string;
  param: string;
  percent: number;
  prompt: string;
  rate: number;
  realtime_codes: boolean;
  reference: string;
  reference_3dsecure: string;
  references: any[];
  request: string;
  response: string;
  result?: any;
  ribbon_status: boolean;
  sandboxed: boolean;
  status: boolean;
  text: string;
  timestamp: Date;
  token: string;
  url: string;
  value: string;
}

