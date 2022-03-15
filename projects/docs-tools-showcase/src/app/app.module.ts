import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SkyAppConfig } from '@skyux/config';
import { SkyThemeService } from '@skyux/theme';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

@NgModule({
  declarations: [AppComponent],
  imports: [
    AppRoutingModule,
    BrowserAnimationsModule,
    BrowserModule,
    HttpClientModule,
  ],
  providers: [
    SkyThemeService,
    {
      // Stache expects these values to be provided:
      provide: SkyAppConfig,
      useValue: {
        skyux: {
          app: {
            title: 'Foobar',
          },
          host: {
            url: 'https://foobar',
          },
        },
        runtime: { app: { base: '' }, command: 'serve' },
      },
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
