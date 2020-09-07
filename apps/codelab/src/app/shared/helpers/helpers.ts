import { FileConfig } from '../interfaces/file-config';

function exerciseWithConsoleLog(moduleName: string, code: any, code2: any) {
  return {
    ...exercise(moduleName, code, code2),
    before: `

    export const value = window.value = window.value || {};

    function wrap(context, prop, callback){
      if(!context[prop].patched){
        const originalMethod = context[prop];

         context[prop] = function(...args){
          callback(...args);
          return originalMethod.apply(context, args);
         }

         context[prop].patched = true;
       }
    }

    /* TODO: Get rid of the CSS hack */

    wrap(console, 'log', (v)=>{
      value.value = v;
      document.body.innerHTML += '<pre style="font-family: roboto-mono, monospace;font-size: 3vw; font-weight: 400; margin: 0;">' +
       '<span style="color: #999;font-size: 2vw;">＜</span> ' + JSON.stringify(v, null, '  ') + '</pre> ' +
       '<hr style="margin-left: 2vw;border: 0 solid;">'
         document.body.scrollTop = document.body.scrollHeight;
    })
  `
  };
}

export function exercise(
  moduleName: string,
  template: string,
  solution?: string
): FileConfig {
  solution = solution || template;

  return {
    bootstrap: false,
    excludeFromTesting: false,
    type: 'typescript',
    path: moduleName + '.ts',
    template,
    code: template,
    moduleName: moduleName,
    solution,
    after: `export function evalJs( js ){ return eval(js);}`
  };
}

export function test(moduleName: string, template: string): FileConfig {
  return {
    path: moduleName + 'Test.ts',
    type: 'typescript',
    template,
    code: template,
    moduleName: moduleName + 'Test',
    excludeFromTesting: false,
    test: true,
    bootstrap: true,
    before: 'mochaBefore();',
    after: 'mochaAfter();',
    hidden: true
  };
}

interface SimpleImport {
  name: string;
  path: string;
}

export const builder = {
  imports(imports: Array<SimpleImport>) {
    return imports.map(i => `import {${i.name}} from '${i.path}';`).join('\n');
  },
  listOfComponents: (components: Array<SimpleImport>) => {
    return `[${components.map(c => c.name).join(',')}]`;
  },

  ngModule(
    declarations: Array<SimpleImport> = [
      {
        name: 'AppComponent',
        path: './app.component'
      }
    ],
    bootstrapComponent?: Array<SimpleImport>
  ) {
    bootstrapComponent = bootstrapComponent || declarations;

    return `import {BrowserModule} from \'@angular/platform-browser\';
import {NgModule} from \'@angular/core\';
${this.imports(declarations)}

@NgModule({
  imports: [BrowserModule],
  declarations: ${this.listOfComponents(declarations)},
  bootstrap: ${this.listOfComponents(bootstrapComponent)}
})
export class AppModule {}`;
  },

  bootstrap(
    module: SimpleImport = { name: 'AppModule', path: './app.module' }
  ): string {
    return `import {platformBrowserDynamic} from '@angular/platform-browser-dynamic';
${this.imports([module])}

import {ResourceLoader} from '@angular/compiler';
class MyResourceLoader extends ResourceLoader {
  get(url: string): Promise<string> {
    const templateId = Object.keys(code).find(key => key.includes(url.replace(/[\\/\\.-]/gi, '_')));
    const template = code[templateId];
    if (!template) {
      console.log(template);
      // tslint:disable-next-line:no-debugger
      debugger;
    }
    return Promise.resolve(template);
  };
}




const platform = platformBrowserDynamic();
platform.bootstrapModule(${module.name}, [
  {
    providers: [
      {provide: ResourceLoader, useFactory: () => new MyResourceLoader(), deps: []}
    ]
  }
]);

`;
  }
};

export function html(path = 'app', code, solution = '') {
  return {
    code,
    path: path + '.html',
    solution: solution,
    type: 'html'
  };
}

export function stylesheet(code, solution = '') {
  return {
    code,
    path: 'style.css',
    solution: solution || code,
    type: 'css'
  };
}

export function bootstrap(
  moduleName: string,
  template: string,
  solution?: string
) {
  solution = solution || template;
  return {
    bootstrap: true,
    excludeFromTesting: true,
    type: 'typescript',
    path: moduleName + '.ts',
    template,
    code: template,
    moduleName: moduleName,
    solution
  };
}

export function circleAndBox() {
  const result = boxAndCircle();
  const temp = result.files[0];
  result.files[0] = result.files[1];
  result.files[1] = temp;
  return result;
}

// That's me being plain lazy, we need
export function boxAndCircle() {
  const moduleCode = `import {BrowserModule} from \'@angular/platform-browser\';
  import {NgModule} from '@angular/core';
  import {BoxComponent} from './box.component';
  import {CircleComponent} from './circle.component';

  @NgModule({
    imports: [BrowserModule],
    declarations: [CircleComponent, BoxComponent],
    bootstrap: [BoxComponent]
  })
  export class AppModule {}`;
  const circleCode = `import { Component, Input } from '@angular/core';

  @Component({
    selector: 'slides-circle',
    template: '<div class="circle" [style.width]="size" [style.height]="size" [style.background]="color"></div>'
  })
  export class CircleComponent {
    @Input() size: number;
    @Input() color: string;
  }`;

  const boxCode = `import { Component } from '@angular/core';

  @Component({
    selector: 'my-app',
    template: \`<div><slides-circle
      [size]="5"
      [color]="circleColor"></slides-circle></div>\`
  })
  export class BoxComponent {
    circleColor="green"
  }`;

  const bootstrapCode = `import {platformBrowserDynamic} from '@angular/platform-browser-dynamic';
import {AppModule} from './app.module';
platformBrowserDynamic().bootstrapModule(AppModule)
`;

  return {
    other: {
      boxNoParams: `import { Component } from '@angular/core';

  @Component({
    selector: 'slides-box',
    template: \`<div><slides-circle></slides-circle></div>\`
  })
  export class BoxComponent {
    circleColor="green"
  }`
    },
    files: [
      exercise('box.component', boxCode),
      exercise('circle.component', circleCode),
      exercise('app.module', moduleCode),
      bootstrap('main', bootstrapCode, bootstrapCode),
      {
        type: 'css',
        path: 'styles.css',
        template: `
         my-app > div {
           width: 300px;
           height: 200px;
           border: 1px #ddd solid;
         }
         .circle {
           margin-left: 100px;
           margin-top: 50px;
           border-radius: 50%;
         }
        `
      }
    ]
  };
}

export function displayAngularComponent(
  componentCode: string,
  testCode?: string
) {
  // tslint:disable-next-line:max-line-length TODO: Clean up next line and remove this comment.
  const moduleCode = builder.ngModule();
  const bootstrapCode = builder.bootstrap();

  return {
    files: [
      exercise('app.component', componentCode),
      exercise('app.module', moduleCode),
      bootstrap('main', bootstrapCode, bootstrapCode),
      {
        type: 'css',
        path: 'styles.css',
        code: `
          body, html {
            margin: 0;
            padding: 2vw;
            font-family: sans-serif;
          }

          h1, h2 {
            margin: 0;
            padding: 0;
          }

          h1 {font-size: 6vw;}
          h2 {font-size: 4vw;}
        `
      },
      ...(testCode ? [test('test', testCode)] : [])
    ]
  };
}

export function typeScriptWithConsoleLog(
  code: string,
  bootstrapCode = 'import "./app";',
  testCode = '',
  otherCode = ''
) {
  const files = [
    exerciseWithConsoleLog('app', code, code),
    bootstrap('main', bootstrapCode, bootstrapCode),
    test('test', testCode),
    {
      path: 'main.css',
      type: 'css',
      code: ``
    }
  ];
  if (otherCode !== '') {
    files.push(exercise('puppy', otherCode));
  }
  return {
    files
  };
}

export function javaScriptWithConsoleLog(
  code: string,
  bootstrapCode = 'import "./app";',
  testCode = '',
  otherCode = ''
) {
  const result = typeScriptWithConsoleLog(
    code,
    bootstrapCode,
    testCode,
    otherCode
  );
  (result.files[0] as FileConfig).editorType = 'javascript';
  return result;
}

export function displayAngularComponentWithHtml(
  componentCode: string,
  code: string
) {
  return {
    files: [
      {
        code,
        path: 'app/app.html',
        solution: '',
        type: 'html'
      },
      ...displayAngularComponent(componentCode).files
    ]
  };
}

export function solve(exerciseConfig) {
  return {
    ...exerciseConfig,
    files: exerciseConfig.files.map(file => ({
      ...file,
      code: file.solution || file.code
    }))
  };
}
