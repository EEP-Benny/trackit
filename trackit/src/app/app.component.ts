import { Component, HostListener, OnInit, ViewChild } from '@angular/core';
import {
  PermissionService,
  PermissionInfo,
} from './services/permission.service';
import { BreakpointObserver } from '@angular/cdk/layout';
import { NavigationEnd, Router } from '@angular/router';
import { MatSidenav } from '@angular/material/sidenav';

@Component({
  selector: 'ti-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  @ViewChild('sideNav') sideNav: MatSidenav;

  title = 'TrackIt';

  version = document.lastModified;

  isMobile = false;

  deferredPrompt: any;
  showButton = false;
  isPersisted = false;
  persistenceInfo: PermissionInfo;

  constructor(
    private permissionService: PermissionService,
    private breakpointObserver: BreakpointObserver,
    private router: Router
  ) {}

  @HostListener('window:beforeinstallprompt', ['$event'])
  onbeforeinstallprompt(e) {
    console.log(e);
    // Prevent Chrome 67 and earlier from automatically showing the prompt
    e.preventDefault();
    // Stash the event so it can be triggered later.
    this.deferredPrompt = e;
    this.showButton = true;
  }

  ngOnInit() {
    this.breakpointObserver.observe('(max-width: 800px)').subscribe((state) => {
      this.isMobile = state.matches;
    });
    this.router.events.subscribe((e) => {
      if (this.isMobile && e instanceof NavigationEnd) {
        this.sideNav.close();
      }
    });

    (async () => {
      this.isPersisted = await this.permissionService.isStoragePersisted();
    })();
    (async () => {
      this.persistenceInfo = await this.permissionService.getStorageInfo();
    })();
  }

  addToHomeScreen() {
    // hide our user interface that shows our A2HS button
    this.showButton = false;
    // Show the prompt
    this.deferredPrompt.prompt();
    // Wait for the user to respond to the prompt
    this.deferredPrompt.userChoice.then((choiceResult: { outcome: string }) => {
      if (choiceResult.outcome === 'accepted') {
        console.log('User accepted the A2HS prompt');
      } else {
        console.log('User dismissed the A2HS prompt');
      }
      this.deferredPrompt = null;
    });
  }

  async askForPermission() {
    await this.permissionService.persist();
    this.isPersisted = await this.permissionService.isStoragePersisted();
    this.persistenceInfo = await this.permissionService.getStorageInfo();
  }
}
