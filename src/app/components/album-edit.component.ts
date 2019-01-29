import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

import { UserService } from '../services/user.service';
import { GLOBAL } from '../services/global';
import { Artist } from '../models/artist';
import { Album } from '../models/album';

import { AlbumService } from '../services/album.service';
import { UploadService } from '../services/upload.service';

@Component({
    selector: 'app-album-edit',
    templateUrl: '../views/album-add.html',
    providers: [UserService, AlbumService, UploadService]
})

export class AlbumEditComponent implements OnInit {
    public titulo: string;
    public album: Album;
    public albumId: string;
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
        private _albumService: AlbumService,
        private _uploadService: UploadService,
    ) {
        this.titulo = 'Editar album';
        this.identity = this._userService.getIdentity();
        this.token = this._userService.getToken();
        this.url = GLOBAL.url;
        this.album = new Album('', '', '', (new Date()).getFullYear(), '', '');
        this.is_edit = true;
    }

    ngOnInit() {
        console.log('album-edit.component.ts cargado');
        this.loadAlbumData();
    }

    loadAlbumData() {
        this._route.params.forEach((params: Params) => {
            const id = params['id'];
            this._albumService.getAlbum(this.token, id).subscribe(
                response => {
                    if (!response.album) {
                        this._router.navigate(['/']);
                    } else {
                        this.album = response.album;
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
        console.log(this.album);
        this._route.params.forEach((params: Params) => {
            const id = params['id'];
            this._albumService.addAlbum(this.token, this.album).subscribe(
            response => {
                if (!response.album) {
                    this.error = 'Error al añadir el album';
                } else {
                    this.message = 'Album añadido correctamente';
                    this.album = response.album;
                    if (this.filesToUpload != null && this.filesToUpload.length > 0) {
                        this._uploadService.makeFileRequest(
                                  this.url + 'upload-image-album/' + id, [],
                                  this.filesToUpload, this.token, 'image')
                        .then(
                            (result: any) => {
                                this.message = 'Album editado correctamente'
                            },
                            (error) => {
                                this.error = error;
                            }
                        );
                    }
                    // this._router.navigate(['/artistas/editar/'+response.artist._id]);
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
