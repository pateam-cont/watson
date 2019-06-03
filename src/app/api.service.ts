import { Injectable } from '@angular/core';
import { HttpClient,HttpHeaders } from '@angular/common/http'; 

const httpPostOptions =
{   
    headers:
        new HttpHeaders (
        {   
            "Content-Type": "application/json",
            "Authorization" : "Basic YXBpa2V5OnpKbVhvcHdhclJUOUtFUGxIOW5yT0dIZUtBUS1wZlAxdDVfdVZHYjdyZW9T",
        }),
    withCredentials: false
};

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(private http: HttpClient) { }
  API_URL  =  'https://gateway-lon.watsonplatform.net/assistant/api/v1/workspaces/d2063027-d040-442d-b58a-00d89f423ea7/message?version=2019-02-28';

  getstartedchat(username:string,mail:string)
  {
    let context={username:username,email:mail};
    const body=JSON.stringify({input:{text:'Hi'},"context":context});
    return this.http.post(this.API_URL,body,httpPostOptions)
  }

  getnextchat(body:any)
  {
    //console.log(body);
    return this.http.post(this.API_URL,body,httpPostOptions)
  }

  
}
