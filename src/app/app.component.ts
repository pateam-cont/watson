import { Component } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'AV';
  modalref:BsModalRef;
  constructor(private modalservice:BsModalService)
  {

  }

  

  public openModalWithComponent(header:string,bodymsg:string,footer:string) {
    
    this.modalref.content.title = header;
    this.modalref.content.message = bodymsg;
  }

}
