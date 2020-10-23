import { Injectable } from '@angular/core';
import { BehaviorSubject, combineLatest, Observable } from 'rxjs';
import { map, repeatWhen, shareReplay, takeUntil, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class TimerService {
  timePerQuestion = 20;
  elapsedTime = 0;
  elapsedTimes: number[] = [];
  completionTime: number;

  start$: Observable<number>;
  reset$: Observable<number>;
  stop$: Observable<number>;
  timer: Observable<number>;
  isStart = new BehaviorSubject<number>(1);
  isStop = new BehaviorSubject<number>(1);
  isReset = new BehaviorSubject<number>(1);
  isTimerStart = false;

  questionStarted$ = new BehaviorSubject(true);
  questionLength = 20000;
  questionLengthSubject$ = new BehaviorSubject(this.questionLength);
  questionLength$ = this.questionLengthSubject$.asObservable();

  setQuestionLength = questionLength =>
    this.questionLengthSubject$.next(questionLength)

  constructor() {
    this.start$ = this.isStart.asObservable().pipe(shareReplay(1));
    this.reset$ = this.isReset.asObservable();
    this.stop$ = this.isStop.asObservable();
  }

  /* timer$ = timer(0, 1000).pipe(
    takeUntil(this.stop$),
    repeatWhen(() => this.start$)
  ); */

  /* tick$ = combineLatest([this.timer$, this.questionLength$]).pipe(
    tap(([timer, questionLength]) => {
      if (questionLength <= timer * 1000) {
        this.stopTimer();
      }
    }),
    map(([timer, questionLength]) => questionLength / 1000 - timer)
  ); */

  stopTimer(): void {
    if (!this.isTimerStart) {
      return;
    }
    this.isTimerStart = false;
    this.timePerQuestion = 0;
    this.isStop.next(1);
    this.elapsedTimes.push(this.elapsedTime);
  }

  resetTimer(): void {
    if (!this.isTimerStart) {
      this.isTimerStart = true;
      this.isStart.next(1);
    }
    this.isTimerStart = true;
    this.isReset.next(1);
  }

  setElapsed(time: number): void {
    this.elapsedTime = time;
  }

  calculateTotalElapsedTime(elapsedTimes: number[]): number {
    if (elapsedTimes.length > 0) {
      this.completionTime = elapsedTimes.reduce((acc, cur) => acc + cur, 0);
      return this.completionTime;
    }
  }
}
