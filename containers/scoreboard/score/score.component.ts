import { Component, OnDestroy, OnInit } from '@angular/core';
import { Observable, of, Subject, Subscription } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { QuizService } from '@codelab-quiz/shared/services/*';


@Component({
  selector: 'codelab-scoreboard-score',
  templateUrl: './score.component.html',
  styleUrls: ['./score.component.scss']
})
export class ScoreComponent implements OnInit, OnDestroy {
  score: string;
  score$: Observable<string>;
  totalQuestions: number;
  correctAnswersCount$: Observable<number>;
  correctAnswersCountSubscription: Subscription;
  correctAnswersCount: number;
  unsubscribe$ = new Subject<void>();

  constructor(private quizService: QuizService) { }

  ngOnInit(): void {
    this.correctAnswersCount$ = this.quizService.correctAnswersCountSubject;
    this.totalQuestions = this.quizService.totalQuestions;
    this.numericalScore();
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  numericalScore(): void {
    this.correctAnswersCountSubscription =
      this.correctAnswersCount$
        .pipe(takeUntil(this.unsubscribe$))
          .subscribe((correctAnswersCount: number) => {
            this.correctAnswersCount = correctAnswersCount;
            this.score = this.correctAnswersCount.toString().concat('/', this.totalQuestions.toString());
            this.score$ = of(this.score);
          });
  }

  percentageScore(): void {
    this.correctAnswersCountSubscription =
      this.correctAnswersCount$
        .pipe(takeUntil(this.unsubscribe$))
          .subscribe((correctAnswersCount: number) => {
            this.correctAnswersCount = correctAnswersCount;
            this.score = Math.ceil((this.correctAnswersCount / this.totalQuestions) * 100).toString() + "%";
            this.score$ = of(this.score);
          });
  }
}
