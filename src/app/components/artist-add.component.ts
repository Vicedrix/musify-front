import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

import { UserService } from '../services/user.service';
import { GLOBAL } from '../services/global';
import { Artist } from '../models/artist';

import { ArtistService } from '../services/artist.service';

@Component({
    selector: 'app-artist-add',
    templateUrl: '../views/artist-add.html',
    providers: [UserService, ArtistService]
})

export class ArtistAddComponent implements OnInit {
    public titulo: string;
    public artist: Artist;
    public identity;
    public token;
    public url: string;
    public error: string;

    constructor(
        private _route: ActivatedRoute,
        private _router: Router,
        private _userService: UserService,
        private _artistService: ArtistService
    ) {
        this.titulo = 'Crear nuevo artista';
        this.identity = this._userService.getIdentity();
        this.token = this._userService.getToken();
        this.url = GLOBAL.url;
        this.artist = new Artist('', '', '', '');
    }

    ngOnInit() {
        console.log('artist-add.component.ts cargado');
    }

    onSubmit() {
        this._artistService.addArtist(this.token, this.artist).subscribe(
            response => {

                if (!response.artist) {
                    this.error = 'Error al añadir el artista';
                } else {
                    this.artist = response.artist;
                    this._router.navigate(['/artistas/editar/' + response.artist._id]);
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
