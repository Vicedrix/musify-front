import { Component, OnInit } from '@angular/core';

import { UserService } from '../services/user.service';
import { User } from '../models/user';
import { AppComponent } from '../app.component';
import { GLOBAL } from '../services/global';

@Component({
  selector: 'app-user-edit',
  templateUrl: '../views/user-edit.html',
  providers: [UserService]
})
export class UserEditComponent implements OnInit {
  public titulo: string;
  public user: User;
  public identity;
  public token;
  public alertUpdate;
  public url;
  public filesToUpload: Array<File>;

  constructor(private _userService: UserService) {
    this.titulo = 'Actualizar mis datos';
    this.url = GLOBAL.url;

    // LocalStorage
    this.identity = this._userService.getIdentity();
    this.token = this._userService.getToken();
    this.user = this.identity;
  }

  ngOnInit() {
    console.log('user-edit.component.ts cargado');
  }

  onSubmit() {
    this._userService.update_user(this.user).subscribe(
      response => {
        if (!response.user) {
          this.alertUpdate = 'El usuario no se ha actualizado';
        } else {
          this.user = response.user;
          document.getElementById('identityname').innerHTML =
            response.user.name;
          localStorage.setItem('identity', JSON.stringify(this.user));
          this.alertUpdate = 'Datos actualizados correctamente';

          if (this.filesToUpload) {
            this.makeFileRequest(
              GLOBAL.url + 'upload-image-user/' + this.user._id,
              [],
              this.filesToUpload
            ).then((result: any) => {
              this.user.image = result.image;
              localStorage.setItem('identity', JSON.stringify(this.user));

              const imagePath = this.url + 'get-image-user/' + this.user.image;
              document.getElementById('image-logged').setAttribute('src', imagePath);
            });
          }
        }
      },
      error => {
        const errorMsg = <any>error;
        if (errorMsg != null) {
          const body = JSON.parse(errorMsg._body);
          this.alertUpdate = body.message;
        }
      }
    );
  }


  fileChangeEvent(fileInput: any) {
    this.filesToUpload = <Array<File>>fileInput.target.files;
  }

  makeFileRequest(url: string, params: Array<string>, files: Array<File>) {
    const token = this._userService.getToken();
    return new Promise(function(resolve, reject) {
      const formData: any = new FormData();
      const xhr = new XMLHttpRequest();

      for (let i = 0; i < files.length; i++) {
        formData.append('image', files[i], files[i].name);
      }

      xhr.onreadystatechange = function() {
        if (xhr.readyState === 4) {
          if (xhr.status === 200) {
            resolve(JSON.parse(xhr.response));
          } else {
            reject(xhr.response);
          }
        }
      };

      xhr.open('POST', url, true);
      xhr.setRequestHeader('Authorization', token);
      xhr.send(formData);
    });
  }
}
