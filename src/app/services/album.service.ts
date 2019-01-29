import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/map';
import { Observable } from 'rxjs/Observable';
import { GLOBAL } from './global';
import { Album } from '../models/album';

@Injectable()
export class AlbumService {
  public url: string;

  constructor(private _http: Http) {
    this.url = GLOBAL.url;
  }

  addAlbum(token, album: Album) {
    const params = JSON.stringify(album);
    const headers = new Headers({
      'Content-Type': 'application/json',
      Authorization: token
    });

    return this._http
      .post(this.url + 'album', params, { headers: headers })
      .map(res => res.json());
  }

  getAlbum(token, id: string) {
    const headers = new Headers({
      'Content-Type': 'application/json',
      Authorization: token
    });

    let options = new RequestOptions({ headers: headers });
    return this._http
      .get(this.url + 'album/' + id, options)
      .map(res => res.json());
  }

  getAlbums(token, artistID = null, page: number) {
    let headers = new Headers({
      'Content-Type': 'application/json',
      Authorization: token
    });
    let options = new RequestOptions({ headers: headers });

    if (artistID == null) {
      return this._http
        .get(this.url + 'albums/', options)
        .map(res => res.json());
    } else {
      return this._http
        .get(this.url + 'albums/' + artistID, options)
        .map(res => res.json());
    }
  }

  /*
    getArtist(token, id: string)
    {
        let headers = new Headers({
            'Content-Type': 'application/json',
            'Authorization': token
        });

        let options = new RequestOptions({ headers: headers});
        return this._http.get(this.url + 'artist/' + id, options)
            .map(res => res.json());
    }
    */
  /*
    editArtist(token, id:string, artist: Artist)
    {
        let params = JSON.stringify(artist);
        let headers = new Headers({
            'Content-Type': 'application/json',
            'Authorization': token
        });

        return this._http.put(this.url+'artist/'+id, params, {headers: headers})
            .map(res => res.json());
    }

    */
  deleteAlbum(token, id: string) {
    let headers = new Headers({
      'Content-Type': 'application/json',
      Authorization: token
    });

    let options = new RequestOptions({ headers: headers });
    return this._http
      .delete(this.url + 'album/' + id, options)
      .map(res => res.json());
  }
}
