import { Directive, EventEmitter, Optional, Output, Self } from '@angular/core';
import { CodeDemoEditorInjector } from '@codelab/code-demos/src/lib/code-demo-editor/code-demo-editor.injector';

@Directive({
  selector: '[slidesMonacoLoadAnswer]',
  exportAs: 'MonacoWatLoadAnswer'
})
export class MonacoWatLoadAnswer {
  @Output() slidesMonacoLoadAnswer = new EventEmitter<void>();

  constructor(
    @Self() @Optional() private editorInjector: CodeDemoEditorInjector,
  ) {
  }

  loadAnswer(config: any) {
    const model = this.editorInjector.editor.getModel();
    const value = model.getValue();
    const newValue = value.replace(config.originalCode, config.answer);
    model.setValue(newValue);
    this.slidesMonacoLoadAnswer.emit();
  }
}
