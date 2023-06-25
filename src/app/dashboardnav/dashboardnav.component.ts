import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboardnav',
  templateUrl: './dashboardnav.component.html',
  styleUrls: ['./dashboardnav.component.css']
})
export class DashboardnavComponent implements OnInit {
  currentUrl = ''
  constructor(private router: Router) { }

  ngOnInit(): void {
    this.currentUrl = this.router.url;
    console.log(this.currentUrl, 'this is the url..');
  }
  logoutFunction(){
    localStorage.clear()
    this.router.navigate(['/']);

  }
}
