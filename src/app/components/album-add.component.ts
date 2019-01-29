import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

import { UserService } from '../services/user.service';
import { GLOBAL } from '../services/global';
import { Artist } from '../models/artist';
import { Album } from '../models/album';

import { ArtistService } from '../services/artist.service';
import { AlbumService } from '../services/album.service';

@Component({
    selector: 'app-album-add',
    templateUrl: '../views/album-add.html',
    providers: [UserService, ArtistService, AlbumService]
})

export class AlbumAddComponent implements OnInit {
    public titulo: string;
    public artist: Artist;
    public album: Album;
    public albumId: string;
    public identity;
    public token;
    public url: string;
    public error: string;
    public message: string;
    public ruta: string;

    constructor(
        private _route: ActivatedRoute,
        private _router: Router,
        private _userService: UserService,
        private _artistService: ArtistService,
        private _albumService: AlbumService,
    ) {
        this.titulo = 'Crear nuevo album';
        this.identity = this._userService.getIdentity();
        this.token = this._userService.getToken();
        this.url = GLOBAL.url;
        this.album = new Album('', '', '', (new Date()).getFullYear(), '', '');
        this.ruta = this._router.url;
    }

    ngOnInit() {
        console.log('album-add.component.ts cargado');
    }

    onSubmit() {
        console.log(this.album);
        this._route.params.forEach((params: Params) => {
            this.album.artist = params['artist'];
        });
        this._albumService.addAlbum(this.token, this.album).subscribe(
            response => {
                if (!response.album) {
                    this.error = 'Error al añadir el album';
                } else {
                    this.message = 'Album añadido correctamente';
                    this.album = response.album;
                    this._router.navigate(['albums/editar/' + response.album._id]);
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
    }
}
