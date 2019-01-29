import { Component, OnInit } from '@angular/core';
import { UserService } from './services/user.service';
import { User } from './models/user';
import { GLOBAL } from './services/global';
import { Router, ActivatedRoute, Params } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  providers: [UserService]
})
export class AppComponent implements OnInit {
  title = 'MUSIFY';
  public user: User;
  public userRegister: User;
  public identity;
  public token;
  public errorMessage;
  public url;

  constructor(
    private _userService: UserService,
    private _route: ActivatedRoute,
    private _router: Router
  ) {
    this.user = new User('', '', '', '', '', 'ROLE_USER', '');
    this.userRegister = new User('', '', '', '', '', 'ROLE_USER', '');
    this.url = GLOBAL.url;
  }

  public onSubmit() {
    this._userService.signup(this.user).subscribe(
      response => {
        const identity = response.user;
        this.identity = identity;

        if (!this.identity._id) {
          this.errorMessage = 'El usuario no esta correctamente identificado';
        } else {
          // Crear elemento local storage
          localStorage.setItem('identity', JSON.stringify(this.identity));

          // conseguir el token para cada peticion
          this._userService.signup(this.user, true).subscribe(
            // tslint:disable-next-line:no-shadowed-variable
            response => {
              const token = response.token;
              this.token = token;

              if (this.token.length < 1) {
                this.errorMessage = 'El TOKEN no esta correcto';
              } else {
                localStorage.setItem('token', JSON.stringify(this.token));
                this.token = response.token;
                // console.log('ya está listo el token: '+ this.token);
              }
            },
            error => {
              const errorMessage = <any>error;
              if (errorMessage != null) {
                const body = JSON.parse(error._body);
                this.errorMessage = body.message;
              }
            }
          );
        }
      },
      error => {
        const errorMessage = <any>error;
        if (errorMessage != null) {
          const body = JSON.parse(error._body);
          this.errorMessage = body.message;
        }
      }
    );
  }

  public onSubmitRegister() {
    this._userService.register(this.userRegister).subscribe(
      response => {
        const user = response.user;
        this.userRegister = user;
        if (!user._id) {
          alert('Error al registrarse');
        } else {
          this.userRegister = new User('', '', '', '', '', 'ROLE_USER', '');
        }
      },
      error => {}
    );
  }

  public ngOnInit() {
    this.identity = this._userService.getIdentity();
    this.token = this._userService.getToken();
  }

  public logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('identity');
    this.identity = null;
    this.token = null;
    this.user = new User('', '', '', '', '', 'ROLE_USER', '');
    this._router.navigate(['/']);
  }

  public updateData(newUserInfo) {
    this.user = newUserInfo;
  }
}
