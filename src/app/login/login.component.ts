import { Component, OnInit } from '@angular/core';
import { ApiService } from '../api.service';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { NgxSpinnerService } from 'ngx-spinner';
import { Router } from '@angular/router';
import { BsModalService, BsModalRef } from 'ngx-bootstrap';
import { ConnectionService } from 'ng-connection-service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  username:string='Amita';
  email:string='patel.amita@mahindra.com';
  errormsg:string='';
  modalref:BsModalRef;
  isConnected: boolean = true;
  status: boolean= true;
  message:string='';
  dataerror:boolean=false;
  
  constructor(private connectionService: ConnectionService,private apiservice:ApiService,private spinner:NgxSpinnerService,private router:Router,private modalservice:BsModalService) {
    this.connectionService.monitor().subscribe((isConnected) => {
      console.log('isconnected',isConnected)
      this.isConnected = isConnected;
      if (this.isConnected) {
        this.status = true;
      }
      else {
        this.status = false;
      }
    })
    console.log('isconnected: ',this.isConnected)
    console.log('statuscon: ',this.status)

   }

  ngOnInit() {
    
  }

  public openModalWithComponent(header:string,bodymsg:string,footer:string) {
    this.modalref.content.title = header;
    this.modalref.content.message = bodymsg;
  }

  checlogin()
  {
    this.spinner.show();
    console.log("login click");
    this.apiservice.getstartedchat(this.username,this.email).subscribe(data=>{
      console.log(data);
      if(data['error'])
      {
        console.log("Error While Processing");
      }
      else{
        localStorage.clear();
        localStorage.setItem('userchat',JSON.stringify(data['context']));
        localStorage.setItem('username',this.username);
        localStorage.setItem('email',this.email);
        this.router.navigate(['../chatbot/']);
      }
      this.spinner.hide();
    });
  }

}
