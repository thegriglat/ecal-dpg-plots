import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { BrowserAnimationsModule, NoopAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';

import { HeaderComponent } from './header/header.component';
import { PlotCardComponent } from './plot-card/plot-card.component';
import { FooterComponent } from './footer/footer.component';
import { SuiModule } from '@richardlt/ng2-semantic-ui';
import { AppRoutingModule } from './app-routing.module';
import { ShowComponent } from './show/show.component';
import { SessionComponent } from './session/session.component';
import { environment } from 'src/environments/environment';
import { SessionShowProxyComponent } from './session-show-proxy/session-show-proxy.component';
import { PlotCardModalComponent } from './plot-card-modal/plot-card-modal.component';

import { KatexModule } from 'ng-katex';
import { IconComponent } from './icon/icon.component';
import { SlicePipe } from './pipes/slice.pipe';
import { TagCountPipe } from './pipes/tag-count.pipe';
import { CopyClipboardDirective } from './copy-clipboard.directive';
import { PlotPermalinkComponent } from './plot-card/plot-permalink/plot-permalink.component';
import { ChunkPipe } from './pipes/chunk.pipe';
import { FlatPipe } from './pipes/flat.pipe';
import { SessionListComponent } from './session-list/session-list.component';
import { PlotItemComponent } from './plot-item/plot-item.component';
import { SectionShowProxyComponent } from './section-show-proxy/section-show-proxy.component';

const animationsEnabled = environment.animations;

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    PlotCardComponent,
    FooterComponent,
    ShowComponent,
    SessionComponent,
    SessionShowProxyComponent,
    PlotCardModalComponent,
    IconComponent,
    SlicePipe,
    TagCountPipe,
    CopyClipboardDirective,
    PlotPermalinkComponent,
    ChunkPipe,
    FlatPipe,
    SessionListComponent,
    PlotItemComponent,
    SectionShowProxyComponent
  ],
  imports: [
    BrowserModule,
    animationsEnabled ? BrowserAnimationsModule : NoopAnimationsModule,
    FormsModule,
    SuiModule,
    HttpClientModule,
    KatexModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
