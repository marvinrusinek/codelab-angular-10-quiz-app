import { ChangeDetectionStrategy, Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable, Subject } from 'rxjs';
import { map, takeUntil } from 'rxjs/operators';

import { Quiz, QuizMetadata, Score } from '@codelab-quiz/shared/models/*';
import { QuizService, TimerService } from '@codelab-quiz/shared/services/*';

@Component({
  selector: 'codelab-results-summary',
  templateUrl: './summary-report.component.html',
  styleUrls: ['./summary-report.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SummaryReportComponent implements OnInit, OnDestroy {
  quizzes$: Observable<Quiz[]>;
  quizName$: Observable<string>;
  quizMetadata: Partial<QuizMetadata> = {
    totalQuestions: this.quizService.totalQuestions,
    totalQuestionsAttempted: this.quizService.totalQuestions,
    correctAnswersCount$: this.quizService.correctAnswersCountSubject,
    percentage: this.calculatePercentageOfCorrectlyAnsweredQuestions(),
    completionTime: this.timerService.calculateTotalElapsedTime(this.timerService.elapsedTimes)
  };
  elapsedMinutes: number;
  elapsedSeconds: number;
  checkedShuffle: boolean;
  score: Score;
  highScores: Score[] = [];
  quizId: string;
  unsubscribe$ = new Subject<void>();
  codelabUrl = 'https://www.codelab.fun';

  constructor(
    private quizService: QuizService,
    private timerService: TimerService,
    private activatedRoute: ActivatedRoute
  ) {
    this.calculateElapsedTime();
    this.saveHighScores();
  }

  ngOnInit(): void {
    this.quizzes$ = this.quizService.getQuizzes();
    this.quizName$ = this.activatedRoute.url.pipe(map(segments => segments[1].toString()));
    this.activatedRoute.paramMap
      .pipe(takeUntil(this.unsubscribe$))
        .subscribe(params => this.quizId = params.get('quizId'));
    this.checkedShuffle = this.quizService.checkedShuffle;
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  calculatePercentageOfCorrectlyAnsweredQuestions(): number {
    return Math.ceil(100 * this.quizService.correctAnswersCountSubject.getValue() / this.quizService.totalQuestions);
  }

  calculateElapsedTime(): void {
    this.elapsedMinutes = Math.floor(this.quizMetadata.completionTime / 60);
    this.elapsedSeconds = this.quizMetadata.completionTime % 60;
  }

  saveHighScores(): void {
    this.score = {
      quizId: this.quizService.quizId,
      score: this.quizService.correctAnswersCountSubject.getValue(),
      datetime: new Date()
    };

    const MAX_LENGTH = 2;
    this.highScores = new Array(MAX_LENGTH);
    this.highScores.push(this.score);
    console.log('High Scores:', this.highScores);
  }
}
