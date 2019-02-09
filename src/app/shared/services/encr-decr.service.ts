import { Injectable } from '@angular/core';
import * as CryptoJS from 'crypto-js';

@Injectable()
export class EncrDecrService {

  passPhrase = 'ec3fn1n#';
  emailContentPhrase = 'drfp;[su';

  constructor() { }

  encryptPassword(value) {
    return CryptoJS.AES.encrypt(this.passPhrase, value).toString();
  }

  decryptPassword(value) {
    return CryptoJS.AES.decrypt(this.passPhrase, value).toString();
  }

  encryptMailContent(value) {
    return CryptoJS.AES.encrypt(this.emailContentPhrase, value).toString();
  }

  decryptMailContent(value) {
    return CryptoJS.AES.decrypt(this.emailContentPhrase, value).toString();
  }
}
