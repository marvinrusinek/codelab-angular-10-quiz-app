import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatAccordion } from '@angular/material/expansion';
import { Observable, Subject } from 'rxjs';
import { map, takeUntil } from 'rxjs/operators';
import { MDCRipple } from '@material/ripple';

import { QUIZ_DATA } from '@codelab-quiz/shared/quiz-data';
import { Quiz, QuizMetadata, QuizQuestion, Result, Score } from '@codelab-quiz/shared/models/';
import { QuizService, TimerService } from '@codelab-quiz/shared/services/*';

enum Status {
  Started = 'Started',
  Continue = 'Continue',
  Completed = 'Completed'
}

@Component({
  selector: 'codelab-quiz-results',
  templateUrl: './results.component.html',
  styleUrls: ['./results.component.scss']
})
export class ResultsComponent implements OnInit, OnDestroy {
  quizData: Quiz[] = QUIZ_DATA;
  quizzes$: Observable<Quiz[]>;
  // quizResources: QuizResource[] = QUIZ_RESOURCES;
  quizMetadata: Partial<QuizMetadata> = {
    totalQuestions: this.quizService.totalQuestions,
    totalQuestionsAttempted: this.quizService.totalQuestions,
    correctAnswersCount$: this.quizService.correctAnswersCountSubject,
    percentage: this.calculatePercentageOfCorrectlyAnsweredQuestions(),
    completionTime: this.timerService.calculateTotalElapsedTime(this.timerService.elapsedTimes)
  };
  results: Result = {
    userAnswers: this.quizService.userAnswers,
    elapsedTimes: this.timerService.elapsedTimes
  };
  questions: QuizQuestion[];
  quizName$: Observable<string>;
  quizId: string;
  indexOfQuizId: number;
  status: Status;
  correctAnswers: number[] = [];
  previousUserAnswers: string[] = []; // was type any[]
  elapsedMinutes: number;
  elapsedSeconds: number;
  checkedShuffle: boolean;
  highScores: Score[] = [];
  score: Score;
  unsubscribe$ = new Subject<void>();

  @ViewChild('accordion', { static: false }) accordion: MatAccordion;
  panelOpenState = false;

  imagePath = '../../assets/images/results/';
  CONGRATULATIONS = this.imagePath.concat('congrats.gif');
  NOT_BAD = this.imagePath.concat('not-bad.jpg');
  TRY_AGAIN = this.imagePath.concat('try-again.jpeg');
  codelabUrl = 'https://www.codelab.fun';

  constructor(
    private quizService: QuizService,
    private timerService: TimerService,
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) {
    this.status = Status.Completed;
    this.activatedRoute.paramMap
      .pipe(takeUntil(this.unsubscribe$))
        .subscribe(params => this.quizId = params.get('quizId'));
    this.indexOfQuizId = this.quizData.findIndex(elem => elem.quizId === this.quizId);

    this.sendQuizStatusToQuizService();
    this.sendCompletedQuizIdToQuizService();
    this.sendPreviousUserAnswersToQuizService();
    this.calculateElapsedTime();
    this.saveHighScores();
  }

  ngOnInit(): void {
    this.quizzes$ = this.quizService.getQuizzes();
    this.quizName$ = this.activatedRoute.url.pipe(map(segments => segments[1].toString()));
    this.questions = this.quizService.questions;
    this.correctAnswers = this.quizService.correctAnswers;
    this.checkedShuffle = this.quizService.checkedShuffle;
    this.previousUserAnswers = this.quizService.userAnswers;
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  calculateElapsedTime(): void {
    this.elapsedMinutes = Math.floor(this.quizMetadata.completionTime / 60);
    this.elapsedSeconds = this.quizMetadata.completionTime % 60;
  }

  calculatePercentageOfCorrectlyAnsweredQuestions(): number {
    return Math.ceil(100 * this.quizService.correctAnswersCountSubject.getValue() / this.quizService.totalQuestions);
  }

  checkIfAnswersAreCorrect(correctAnswers: any, userAnswers: any, index: number): boolean {
    return !(!userAnswers[index] ||
      userAnswers[index].length === 0 ||
      userAnswers[index].find((answer) => correctAnswers[index][0].indexOf(answer) === -1));
  }

  saveHighScores(): void {
    this.score = {
      quizId: this.quizId,
      score: this.quizService.correctAnswersCountSubject.getValue(),
      datetime: new Date()
    };

    const MAX_LENGTH = 2;
    this.highScores = new Array(MAX_LENGTH);
    this.highScores.push(this.score);
    console.log('High Scores:', this.highScores);
  }

  openAllPanels(): void {
    this.accordion.openAll();
  }
  closeAllPanels(): void {
    this.accordion.closeAll();
  }

  restartQuiz(): void {
    this.quizService.resetAll();
    this.quizService.resetQuestions();
    this.timerService.elapsedTimes = [];
    this.timerService.completionTime = 0;
    this.router.navigate(['/quiz/intro/', this.quizId]).then();
  }

  selectQuiz(): void {
    this.quizService.resetAll();
    this.quizService.resetQuestions();
    this.indexOfQuizId = 0;
    this.quizId = '';
    this.router.navigate(['/quiz/select/']).then();
  }

  private sendQuizStatusToQuizService(): void {
    this.quizService.setQuizStatus(this.status);
  }

  private sendCompletedQuizIdToQuizService(): void {
    this.quizService.setCompletedQuizId(this.quizId);
  }

  private sendPreviousUserAnswersToQuizService(): void {
    this.quizService.setPreviousUserAnswers(this.previousUserAnswers);
  }
}
