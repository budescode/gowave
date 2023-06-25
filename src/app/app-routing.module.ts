import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AboutComponent } from './about/about.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { DashboardhostComponent } from './dashboardhost/dashboardhost.component';
import { GameComponent } from './game/game.component';
import { HomeComponent } from './home/home.component';
import { MygamesComponent } from './mygames/mygames.component';
import { NameComponent } from './name/name.component';
import { NamedetailsComponent } from './namedetails/namedetails.component';
import { PlaygameComponent } from './playgame/playgame.component';
import { SigninComponent } from './signin/signin.component';
import { SupportComponent } from './support/support.component';

const routes: Routes = [
  {
    path: 'details/:name',
    component: NamedetailsComponent,
  },
  {
    path: 'host',
    component: NameComponent,
  },
  {
    path: '',
    component: HomeComponent,
  },
  {
    path: 'mygames',
    component: MygamesComponent,
  },
  {
    path: 'game/:name',
    component: GameComponent,
  },
  {
    path: 'playgamegame/:name',
    component: PlaygameComponent,
  },
  {
    path: 'signin',
    component: SigninComponent,
  },
  {
    path: 'support',
    component: SupportComponent,
  },
  {
    path: 'about',
    component: AboutComponent,
  },
  {
    path: 'dashboard',
    component: DashboardComponent,
  },
  {
    path: 'dashboard/hostgame',
    component: DashboardhostComponent,
  },
  // { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
