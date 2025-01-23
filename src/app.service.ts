import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return `<html><body style="
    display: flex
;
    align-items: center;
    justify-content: center;
    "><h1>Hello World!</h1></body></html>`;
  }
}
