<<<<<<< HEAD
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'join'
})
export class JoinPipe implements PipeTransform {
  transform(value: any, args?: any): any {
    return value.join(' and ');
  }
}
=======
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'join'
})
export class JoinPipe implements PipeTransform {
  transform(value: any, args?: any): any {
    return value.join(' and ');
  }
}
>>>>>>> 04dcb5efb6b2836cacafa7226bfba6be16e79305
