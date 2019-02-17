import { Injectable } from '@angular/core';
import * as CryptoJS from 'crypto-js';

@Injectable()
export class EncrDecrService {

  passPhrase = 'ec3fn1n#';

  constructor() { }

  encryptPassword(value) {
    return CryptoJS.AES.encrypt(value, this.passPhrase).toString();
  }

  decryptPassword(value) {
    return CryptoJS.AES.decrypt(value, this.passPhrase).toString(CryptoJS.enc.Utf8);
  }

  encodeMailContent(value) {
    return btoa(value);
  }

  decodeMailContent(value) {
    return atob(value);
  }
}
