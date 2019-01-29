import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

import { UserService } from '../services/user.service';
import { UploadService } from '../services/upload.service';
import { GLOBAL } from '../services/global';
import { Artist } from '../models/artist';

import { ArtistService } from '../services/artist.service';

@Component({
    selector: 'app-artist-edit',
    templateUrl: '../views/artist-add.html',
    providers: [UserService, ArtistService, UploadService]
})

export class ArtistEditComponent implements OnInit {
    public titulo: string;
    public artist: Artist;
    public identity;
    public token;
    public url: string;
    public error: string;
    public message: string;
    public is_edit;
    public filesToUpload: Array<File>;

    constructor(
        private _route: ActivatedRoute,
        private _router: Router,
        private _userService: UserService,
        private _artistService: ArtistService,
        private _uploadService: UploadService
    ) {
        this.titulo = 'Editar artista';
        this.identity = this._userService.getIdentity();
        this.token = this._userService.getToken();
        this.url = GLOBAL.url;
        this.artist = new Artist('', '', '', '');
        this.is_edit = true;
    }

    ngOnInit() {
        console.log('artist-edit.component.ts cargado');
        // Llamar al metodo del api para sacar un artista en base a su id
        this.getArtist();
    }

    getArtist() {
        this._route.params.forEach((params: Params) => {
            const id = params['id'];

            this._artistService.getArtist(this.token, id).subscribe(
                response => {
                    if (!response.artist) {
                        this._router.navigate(['/']);
                    } else {
                        this.artist = response.artist;
                    }
                },
                error => {
                    const errorMessage = <any>error;
                    if (errorMessage != null) {
                        const body = JSON.stringify(error._body);
                        this.error = body;
                    }
                }
            );
        });
    }

    onSubmit() {
        this._route.params.forEach((params: Params) => {
            const id = params['id'];
            this._artistService.editArtist(this.token, id, this.artist).subscribe(
                response => {

                    if (!response.artist) {
                        this.error = 'Error al añadir el artista';
                    } else {
                        this.message = 'Artista editado correctamente'

                        // subir imagen artista
                        if (this.filesToUpload != null && this.filesToUpload.length > 0) {
                            this._uploadService.makeFileRequest(
                                      this.url + '/upload-image-artist/' + id, [],
                                      this.filesToUpload, this.token, 'image')
                            .then(
                                (result: any) => {
                                    this.message = 'Imagen añadida correctamente'
                                    console.log('este es el resultado' + result.image);
                                },
                                (error) => {
                                    this.error = error;
                                }
                            );
                        }
                    }
                },
                error => {
                    const errorMessage = <any>error;
                    if (errorMessage != null) {
                        const body = JSON.stringify(error._body);
                        this.error = body;
                    }
                }
            );
        });
    }

    fileChangeEvent(fileInput: any) {
        this.filesToUpload = <Array<File>>fileInput.target.files;
    }

}
