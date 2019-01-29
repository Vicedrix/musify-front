import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

import { UserService } from '../services/user.service';
import { ArtistService } from '../services/artist.service';
import { GLOBAL } from '../services/global';
import { Artist } from '../models/artist';
@Component({
  selector: 'app-artist-list',
  templateUrl: '../views/artist-list.html',
  providers: [UserService, ArtistService]
})
export class ArtistListComponent implements OnInit {
  public titulo: string;
  public artists: Artist[];
  public page: number;
  public pages: number;
  public identity;
  public token;
  public url: string;
  public next_page;
  public prev_page;
  public artistToDelete;
  public error;

  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
    private _userService: UserService,
    private _artistService: ArtistService
  ) {
    this.titulo = 'Artistas';
    this.identity = this._userService.getIdentity();
    this.token = this._userService.getToken();
    this.url = GLOBAL.url;
  }

  ngOnInit() {
    console.log('artist-list.component.ts cargado');
    this.getArtists();
    // Conseguir listado de artistas
  }

  getArtists() {
    this._route.params.forEach((params: Params) => {
      this.page = +params['page'];
      if (!this.page) {
        this.page = 1;
      } else {
        this.next_page = this.page + 1;
        this.prev_page = this.page > 1 ? this.page - 1 : 1;
      }

      this._artistService.getArtists(this.token, this.page).subscribe(
        response => {
          if (!response.artists) {
            this._router.navigate(['/']);
          } else {
            this.artists = response.artists;
            this.pages = response.pages;
          }
        },
        error => {
          const errorMessage = <any>error;
          if (errorMessage != null) {
            const body = JSON.parse(error._body);
            console.log(body);
          }
        }
      );
    });
  }

  onDeleteConfirm(artist: Artist) {
    // document.getElementById('modal').modal('show');
    this.artistToDelete = artist;
  }

  delete(artist: Artist) {
    this.artistToDelete = null;
    const id = artist._id;
    this._artistService.deleteArtist(this.token, id).subscribe(
      response => {
        if (!response.artist) {
          this.error = 'No se ha borrado el artista';
        } else {
          this.getArtists();
        }
      },

      error => {}
    );
  }
}
