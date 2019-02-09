import { Injectable } from '@angular/core';
import { KeyValue } from '../models/key-value.model';
import { TimeZone } from '../models/timezone.model';

@Injectable()
export class SedolpayStateManagerService {

  private currencies: Array<KeyValue> = [];
  private countries: Array<KeyValue> = [];
  private timeZone: Array<TimeZone> = [];

  constructor() { }

  getCurrencies(): KeyValue[] {
    return this.currencies;
  }

  getCountries(): KeyValue[] {
    return this.countries;
  }

  getTimeZones(): TimeZone[] {
    return this.timeZone;
  }

  setCurrencies(data: KeyValue[]) {
    this.currencies = data;
  }

  setCountries(data: KeyValue[]) {
    this.countries = data;
  }

  setTimeZones(data: TimeZone[]) {
    this.timeZone = data;
  }
}