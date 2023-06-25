import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AboutComponent } from './about/about.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { DashboardhostComponent } from './dashboardhost/dashboardhost.component';
import { GameComponent } from './game/game.component';
import { GettokenComponent } from './gettoken/gettoken.component';
import { AuthGuardService } from './guard/auth-guard.service';
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
  canActivate: [AuthGuardService]
  },
  {
    path: 'host',
    component: NameComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: '',
    component: HomeComponent,
  },
  {
    path: 'mygames',
    component: MygamesComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'game/:name',
    component: GameComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'playgame/:name',
    component: PlaygameComponent,
    canActivate: [AuthGuardService]
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
    canActivate: [AuthGuardService]
  },
  {
    path: 'dashboard/hostgame',
    component: DashboardhostComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'hederatoken',
    component: GettokenComponent,
    canActivate: [AuthGuardService]
  },
  // { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
