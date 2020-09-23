import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

import { SlideLeftToRightAnimation } from '@codelab-quiz/animations/*';
import { QUIZ_DATA } from '@codelab-quiz/shared/quiz-data';
import { Quiz } from '@codelab-quiz/shared/models/Quiz.model';
import { QuizService } from '@codelab-quiz/shared/services/quiz.service';

type AnimationState = 'animationStarted' | 'none';

@Component({
  selector: 'codelab-quiz-selection',
  templateUrl: './quiz-selection.component.html',
  styleUrls: ['./quiz-selection.component.scss'],
  animations: [SlideLeftToRightAnimation.slideLeftToRight],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class QuizSelectionComponent implements OnInit {
  quizData: Quiz[] = QUIZ_DATA;
  quizzes$: Observable<Quiz[]>;
  currentQuestionIndex: number;
  totalQuestions: number;
  quizId: string;
  quizCompleted: boolean;
  status: string;
  selectionParams;
  startedQuizId: string;
  continueQuizId: string;
  completedQuizId: string;
  animationState$ = new BehaviorSubject<AnimationState>('none');
  imagePath = '../../../assets/images/milestones/';

  constructor(private quizService: QuizService) {
    // this.quizService.setParamsQuizSelection();
  }

  ngOnInit(): void {
    this.quizzes$ = this.quizService.getQuizzes();
    this.quizId = this.quizService.quizId;
    this.startedQuizId = this.quizService.startedQuizId;
    this.continueQuizId = this.quizService.continueQuizId;
    this.completedQuizId = this.quizService.completedQuizId;
    this.currentQuestionIndex = this.quizService.currentQuestionIndex;
    this.totalQuestions = this.quizService.totalQuestions;
    this.quizCompleted = this.quizService.quizCompleted;
    this.status = this.quizService.status;
    // this.selectionParams = this.quizService.paramsQuizSelection;
    // console.log('SELECTION PARAMS: ', this.selectionParams);
  }

  animationDoneHandler(): void {
    this.animationState$.next('none');
  }
}
