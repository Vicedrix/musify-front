import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

import { UserService } from '../services/user.service';
import { GLOBAL } from '../services/global';
import { Artist } from '../models/artist';
import { Album } from '../models/album';

import { ArtistService } from '../services/artist.service';
import { AlbumService } from '../services/album.service';

@Component({
    selector: 'app-artist-detail',
    templateUrl: '../views/artist-detail.html',
    providers: [UserService, ArtistService, AlbumService]
})

export class ArtistDetailComponent implements OnInit {
    public artist: Artist;
    public identity;
    public token;
    public url: string;
    public error: string;
    public message: string;
    public pageColor: string;
    public albums: Album[];

    constructor(
        private _route: ActivatedRoute,
        private _router: Router,
        private _userService: UserService,
        private _artistService: ArtistService,
        private _albumService: AlbumService,
    ) {
        this.identity = this._userService.getIdentity();
        this.token = this._userService.getToken();
        this.url = GLOBAL.url;
        this.pageColor = '';
    }

    ngOnInit()     {
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
                        this.error = 'Ha ocurrido un error'
                    } else {
                        console.log(response);
                        this.artist = response.artist;
                        this.pageColor = '#' + response.artistColor;
                        console.log(this.pageColor);
                        // poner el color del artista

                        // Sacar album artista
                        this.getAlbums();
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

    getAlbums() {
        this._albumService.getAlbums(this.token, this.artist._id, 1).subscribe(
            response => {
               this.albums = response.albums;
               console.log(this.albums);
            },
            error => {

            }
        );
    }

    deleteAlbum(id: string) {
        this._albumService.deleteAlbum(this.token, id).subscribe(
            response => {
                if (!response.album) {
                    this.error = 'No se ha podido borrar el album';
                } else {
                    this.message = 'Album borrado correctamente';
                    this.getAlbums();
                }
            }
        )
    }
}
