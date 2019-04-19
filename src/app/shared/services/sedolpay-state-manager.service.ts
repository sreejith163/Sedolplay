import { Injectable } from '@angular/core';
import { KeyValue } from '../models/key-value.model';
import { TimeZone } from '../models/timezone.model';
import { BehaviorSubject } from 'rxjs';

@Injectable()
export class SedolpayStateManagerService {

  private currencies: Array<KeyValue> = [];
  private countries: Array<KeyValue> = [];
  private timeZones: Array<TimeZone> = [];
  private userName: string;
  private userId: string;
  timeZoneLoaded = new BehaviorSubject<Array<TimeZone>>(undefined);
  currenciesLoaded = new BehaviorSubject<Array<KeyValue>>(undefined);
  countriesLoaded = new BehaviorSubject<Array<KeyValue>>(undefined);

  constructor() { }

  getUserName() {
    return this.userName;
  }

  getUserId() {
    return this.userId;
  }

  getCurrencies(): KeyValue[] {
    return this.currencies;
  }

  getCountries(): KeyValue[] {
    return this.countries;
  }

  getTimeZones(): TimeZone[] {
    return this.timeZones;
  }

  setUserName(name: string) {
    this.userName = name;
  }

  setUserId(id: string) {
    this.userId = id;
  }

  setCurrencies(data: KeyValue[]) {
    this.currencies = data;
  }

  setCountries(data: KeyValue[]) {
    this.countries = data;
  }

  setTimeZones(data: TimeZone[]) {
    this.timeZones = data;
  }

  countriesChanged() {
    this.countriesLoaded.next(this.countries);
  }

  timeZonesChanged() {
    this.timeZoneLoaded.next(this.timeZones);
  }

  currenciesChanged() {
    this.currenciesLoaded.next(this.currencies);
  }

  clearStateManagerData() {
    this.currencies = [];
    this.timeZones = [];
    this.countries = [];
    this.userId = undefined;
    this.userName = undefined;
  }
}
