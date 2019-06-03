import { Component, OnInit , AfterViewInit, ElementRef,ViewChild, Output,EventEmitter, HostListener, TemplateRef} from '@angular/core';
import { chat, simplechat } from '../modal';
import { ConnectionService } from 'ng-connection-service';
import { ApiService } from '../api.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { Route, Router } from '@angular/router';
import * as _ from 'lodash';
import { BsModalRef, BsModalService, CarouselConfig } from 'ngx-bootstrap';
import {FormBuilder, FormGroup, Validator, Validators} from '@angular/forms';

@Component({
  selector: 'app-chatbot',
  templateUrl: './chatbot.component.html',
  styleUrls: ['./chatbot.component.css']
})
export class ChatbotComponent implements OnInit {
  chat:chat;
  chatarr:simplechat[]=[];
  userinputmessage:String;
  isConnected: boolean = true;
  modalref:BsModalRef;
  status: boolean= true;
  jobs:String[]=[];
  sessionkey:string='';
  disableScrollDown = false;
  name:string;
  carmodel:String;
  frm_scr_serach:FormGroup;
  address:String;
  @Output() notifyclick: EventEmitter<any>=new EventEmitter();
  @ViewChild('scrollMe') private myScrollContainer: ElementRef;

  @HostListener('document:keydown', ['$event']) onKeydownHandler(event: KeyboardEvent) {
    if (event.key === "Enter") {
        // Do things
        this.processuserinput();
    }
   }

  constructor(private connectionService: ConnectionService,private apiservice:ApiService,
    private spinner:NgxSpinnerService,private router:Router,private hostElement: ElementRef,
    private modalservice:BsModalService,private carouselconfig: CarouselConfig,private formbuilder:FormBuilder) {
    this.connectionService.monitor().subscribe((isConnected) => {
      //console.log('isconnected',isConnected)
      this.isConnected = isConnected;
      if (this.isConnected) {
        this.status = true;
      }
      else {
        this.status = false;
      }
    })

    this.carouselconfig.interval = 0;
    this.carouselconfig.showIndicators = false;

    this.frm_scr_serach = this.formbuilder.group({
      name:['',[Validators.required]],
      carmodel:['',[Validators.required]],
      dealername: [''],
      comment: ['',[Validators.required]],
    });
    
   }

   ngAfterViewChecked() {
    this.scrollToBottom();
}

private onScroll() {
  let element = this.myScrollContainer.nativeElement
  let atBottom = element.scrollHeight - element.scrollTop === element.clientHeight
  if (this.disableScrollDown && atBottom) {
      this.disableScrollDown = false
  } else {
      this.disableScrollDown = true
  }
}

   private scrollToBottom(): void {
    if (this.disableScrollDown) {
        return
    }
    try {
        this.myScrollContainer.nativeElement.scrollTop = this.myScrollContainer.nativeElement.scrollHeight;
    } catch(err) { }
    }
   
    ngOnInit() {
    this.resetchat();
    this.processapiresult();
    }
  
    processapiresult()
    {
    this.chat = JSON.parse(localStorage.getItem('userchat'));
    let msg:String='';
    let result=this.chat['apiresult']['result'];
    if(this.chat['apiresult']['context'])
    {
      let key=Object.keys(this.chat['apiresult']['context'])[0];
      this.chat[key]=this.chat['apiresult']['context'][key];
    }
    console.log(this.chat);
    let ele=new simplechat('O',result);
    this.chatarr.push(ele);
    console.log(this.chatarr);
    }

  resetchat()
  {
    this.spinner.show();
    //console.log("login click");
    this.apiservice.getstartedchat(localStorage.getItem('username'),localStorage.getItem('email')).subscribe(data=>{
      console.log(data);
      if(data['error'])
      {
        //console.log("Error While Processing");
      }
      else{
        localStorage.clear();
        localStorage.setItem('userchat',JSON.stringify(data['context']));
        this.router.navigate(['../chatbot/']);
      }
      this.spinner.hide();
    });
  }

  addjobstoarray(job:String)
  {
      
      this.jobs.push(job);
  }

  removejobstoarray(i:number)
  {
    this.jobs.splice(i,1);
  }

  get f() {return this.frm_scr_serach.controls}

  skipjobcardaddition(sessionkey:string)
  {
    console.log(sessionkey);
    this.jobs=[];
    let json=[{type:'text',message:"Job request not added."}];
    let ele=new simplechat('O',json);
    this.chatarr.push(ele);
      this.chat[""+sessionkey+""]=this.jobs;
      let body=JSON.stringify({input:{text:"job skipped"},context:this.chat});
      this.apiservice.getnextchat(body).subscribe(data=>{
        //console.log("Watson result");
        console.log(data);
      if(data['error'])
      {
        //console.log("Error While Processing");
      }
      else{
        localStorage.clear();
        localStorage.setItem('userchat',JSON.stringify(data['context']));
        this.processapiresult();
      }
      this.spinner.hide();
    });
  }

  addjobcardaddition(sessionkey:string)
  {
    let json=[{type:'text',message:"Job card added."}];
    let ele=new simplechat('O',json);
    this.chatarr.push(ele);
      this.chat[""+sessionkey+""]=this.jobs;
      let body=JSON.stringify({input:{text:"job added"},context:this.chat});
      this.apiservice.getnextchat(body).subscribe(data=>{
        //console.log("Watson result");
        console.log(data);
      if(data['error'])
      {
        //console.log("Error While Processing");
      }
      else{
        localStorage.clear();
        localStorage.setItem('userchat',JSON.stringify(data['context']));
        this.processapiresult();
      }
      this.spinner.hide();
    });
  }

  addaddress(sessionkey:string)
  {
      let json=[{type:'text',message:"Addess added"}];
      let ele=new simplechat('O',json);
      this.chatarr.push(ele);
      //this.address
      this.chat[""+sessionkey+""]=this.address;
      let body=JSON.stringify({input:{text:"Addess added"},context:this.chat});
      this.apiservice.getnextchat(body).subscribe(data=>{
        //console.log("Watson result");
        console.log(data);
      if(data['error'])
      {
        //console.log("Error While Processing");
      }
      else{
        localStorage.clear();
        localStorage.setItem('userchat',JSON.stringify(data['context']));
        this.processapiresult();
      }
      this.spinner.hide();
      
    });
    this.address='';
  }

  skipaddress(sessionkey:string)
  {
    this.processuserinputchips("No",sessionkey,JSON,'');
  }

  processuserinput()
  {
      if(this.userinputmessage)
      {
      let json=[{type:'text',message:this.userinputmessage.toString()}];
      let ele=new simplechat('I',json);
      this.chatarr.push(ele);
      let body=JSON.stringify({input:{text:this.userinputmessage.toString()},context:this.chat});
      this.apiservice.getnextchat(body).subscribe(data=>{
      this.userinputmessage='';
      //console.log("output after text entry");
      //console.log(data);
      if(data['error'])
      {
        //console.log("Error While Processing");
      }
      else{
        localStorage.clear();
        localStorage.setItem('userchat',JSON.stringify(data['context']));
        this.processapiresult();
      }
      this.spinner.hide();
      });
      }
  }

  processuserinputchips(btntext:String,sessionkey:String,chip:JSON,removecontext:String)
  {  
      if(btntext.toString() == "End Chat")
      {
        this.modalref = this.modalservice.show('#endchat',{backdrop:'static',keyboard:false});
      }
      else{
        let json=[{type:'text',message:btntext.toString()}];
        let ele=new simplechat('I',json);
        this.chatarr.push(ele);
        delete(this.chat[""+removecontext+""]);
        this.chat[""+sessionkey+""]=btntext.toString();
        let body=JSON.stringify({input:{text:btntext},context:this.chat});
        this.apiservice.getnextchat(body).subscribe(data=>{
          //console.log("Watson result");
          console.log(data);
        if(data['error'])
        {
          //console.log("Error While Processing");
        }
        else{
          localStorage.clear();
          localStorage.setItem('userchat',JSON.stringify(data['context']));
          this.processapiresult();
        }
        this.spinner.hide();
        });
     }
  }

  processpayload(data:String,sessionkey:String,chip:JSON,removecontext:String)
  {
      let json=[{type:'text',message:data.toString()}];
      let ele=new simplechat('I',json);
      this.chatarr.push(ele);
      delete(this.chat[""+removecontext+""]);
      this.chat[""+sessionkey+""]=chip;
      let body=JSON.stringify({input:{text:data},context:this.chat});
      this.apiservice.getnextchat(body).subscribe(data=>{
        //console.log("Watson result");
        console.log(data);
      if(data['error'])
      {
        //console.log("Error While Processing");
      }
      else{
        localStorage.clear();
        localStorage.setItem('userchat',JSON.stringify(data['context']));
        this.processapiresult();
      }
      this.spinner.hide();
    });
  }

  openModel(modalpoupid:TemplateRef<any>,sessionkey:string)
  {
    this.sessionkey=sessionkey;
    //console.log(modalpoupid);
    this.modalref = this.modalservice.show(modalpoupid,{backdrop:'static',keyboard:false});
  }
  

}
