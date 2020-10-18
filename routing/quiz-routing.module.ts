import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { IntroductionComponent, QuizComponent, QuizSelectionComponent, ResultsComponent } from '@codelab-quiz/containers/*';

const routes: Routes = [
  { path: '', redirectTo: 'select' },
  { path: 'select', component: QuizSelectionComponent },
  { path: 'intro/:quizId', component: IntroductionComponent },
  { path: 'question/:quizId/:questionIndex', component: QuizComponent },
  { path: 'results/:quizId', component: ResultsComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class QuizRoutingModule {}
