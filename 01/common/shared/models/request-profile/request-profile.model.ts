import { IncomingHttpHeaders } from 'http';

export interface RequestProfileModelData {
  complete?: boolean;
  headers?: IncomingHttpHeaders;
  url?: string;
  params?: any;
  query?: any;
  body?: any;
}

export interface RequestProfileModel extends RequestProfileModelData {}

export class RequestProfileModel {}
