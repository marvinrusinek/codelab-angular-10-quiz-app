import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SlidesRoutes } from '@codelab/slides/src/lib/routing/slide-routes';
import { FeedbackModule } from '@codelab/feedback';
import { CommonModule } from '@angular/common';
import { BrowserWindowModule } from '@codelab/browser';
import { CodeDemoModule } from '@codelab/code-demos';
import { FormsModule } from '@angular/forms';
import { SlidesModule } from '@codelab/slides';
import { IntroComponent } from './intro.component';
import { CodelabComponentsModule } from '../../../components/codelab-components.module';

const routes = RouterModule.forChild([...SlidesRoutes.get(IntroComponent)]);

@NgModule({
  imports: [
    routes,
    FeedbackModule,
    CommonModule,
    CodeDemoModule,
    BrowserWindowModule,
    CodelabComponentsModule,
    CodeDemoModule,
    SlidesModule,
    FormsModule
  ],
  declarations: [IntroComponent],
  exports: [IntroComponent]
})
export class IntroModule {}
