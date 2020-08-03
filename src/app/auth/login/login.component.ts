import { Component, OnInit } from '@angular/core';
import { NgForm, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { HttpService } from '../../../services/http.service'
import { UserService } from 'src/services/user.service';
import { Router } from '@angular/router';
import { SERVICE_CONFIG } from 'src/configs'

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  public form = {
    username: null,
    password: null,
  };

  constructor(
    private _httpService: HttpService,
    private _userService: UserService,
    private _router: Router,
  ) { }

  ngOnInit(): void {
  }

  onSubmit(form: NgForm) {
    console.log('click');
    
    this._httpService.postHttp(SERVICE_CONFIG.LOGIN, this.form, false)
        .subscribe(
          res => {
           console.log(res);
           if (res.code === 200) {
            const message = `Login successfull!`;
            this._userService.set(res.data);
            // this._notifier.display('success', message);
            this._router.navigate(['/dashboard']);
           }
          },
          error => {
           console.log(error);
           
          });
    
  }

}
