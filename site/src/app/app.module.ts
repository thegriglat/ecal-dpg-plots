import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { BrowserAnimationsModule, NoopAnimationsModule } from '@angular/platform-browser/animations';

import { HeaderComponent } from './header/header.component';
import { PlotCardComponent } from './plot-card/plot-card.component';
import { FooterComponent } from './footer/footer.component';
import { SuiModule } from '@richardlt/ng2-semantic-ui';
import { AppRoutingModule } from './app-routing.module';
import { ShowComponent } from './show/show.component';
import { SessionComponent } from './session/session.component';
import { environment } from 'src/environments/environment';

const animationsEnabled = environment.animations;

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    PlotCardComponent,
    FooterComponent,
    ShowComponent,
    SessionComponent
  ],
  imports: [
    BrowserModule,
    animationsEnabled ? BrowserAnimationsModule : NoopAnimationsModule,
    FormsModule,
    SuiModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
