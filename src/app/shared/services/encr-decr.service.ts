import { Injectable } from '@angular/core';
import * as CryptoJS from 'crypto-js';

@Injectable()
export class EncrDecrService {

  passPhrase = 'ec3fn 1 n#';

  constructor() { }

  encrypt(value) {
    return CryptoJS.AES.encrypt(this.passPhrase, value).toString();
  }

  decrypt(value) {
    return CryptoJS.AES.decrypt(this.passPhrase, value).toString();
  }
}
