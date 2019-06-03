import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import {BsDatepickerModule,BsModalRef,ModalModule,CarouselModule} from 'ngx-bootstrap';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {NgxSpinnerModule} from 'ngx-spinner';
import { LoginComponent } from './login/login.component';
import { ConnectionService } from 'ng-connection-service';
import { HammerGestureConfig,HAMMER_GESTURE_CONFIG} from '@angular/platform-browser';
import { ChatbotComponent } from './chatbot/chatbot.component';
import { SafePipe } from './safe.pipe';




@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    ChatbotComponent,
    SafePipe
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    BsDatepickerModule.forRoot(),
    ModalModule.forRoot(),
    FormsModule,
    NgxSpinnerModule,
    CarouselModule.forRoot(),
    ReactiveFormsModule
  ],
  providers: [BsModalRef,ConnectionService],
  bootstrap: [AppComponent]
})
export class AppModule { }

