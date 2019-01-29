import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

// Importar componentes usuario
import { UserEditComponent } from './components/user-edit.component';

// importar componente artista
import { ArtistListComponent } from './components/artist-list.component';
import { ArtistAddComponent } from './components/artist-add.component';
import { ArtistDetailComponent } from './components/artist-detail.component';
import { ArtistEditComponent } from './components/artist-edit.component';

// import componente album
import { AlbumAddComponent } from './components/album-add.component';
import { AlbumEditComponent } from './components/album-edit.component';

// importar el home
import { HomeComponent } from './components/home.component';

const appRoutes: Routes = [
  { path: '', component: HomeComponent },
  {
    path: 'artistas',
    children: [
      { path: 'crear', component: ArtistAddComponent },
      { path: 'ver/:id', component: ArtistDetailComponent },
      { path: 'editar/:id', component: ArtistEditComponent },
      { path: '', redirectTo: '1', pathMatch: 'full' },
      { path: ':page', component: ArtistListComponent }
    ]
  },
  { path: '', component: HomeComponent },
  {
    path: 'albums',
    children: [
      { path: 'crear/:artist', component: AlbumAddComponent },
      { path: 'editar/:id', component: AlbumEditComponent }
      // { path: 'ver/:id', component: ArtistDetailComponent },
      // { path: '', redirectTo: '1', pathMatch: 'full' },
      // { path: ':page', component: ArtistListComponent }
    ]
  },
  // {path: 'artistas/:page', component: ArtistListComponent },
  // {path: 'crear-artista', component: ArtistAddComponent },
  // {path: 'editar-artista/:id', component: ArtistEditComponent },
  { path: 'mis-datos', component: UserEditComponent },
  { path: '**', component: HomeComponent }
];

export const appRoutingProviders: any[] = [];
export const routing: ModuleWithProviders = RouterModule.forRoot(appRoutes);
