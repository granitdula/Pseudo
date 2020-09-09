import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavigationBarComponent } from './components/navigation-bar/navigation-bar.component';
import { CodeEditorComponent } from './components/code-editor/code-editor.component';
import { OutputConsoleComponent } from './components/output-console/output-console.component';

@NgModule({
  declarations: [
    AppComponent,
    NavigationBarComponent,
    CodeEditorComponent,
    OutputConsoleComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
