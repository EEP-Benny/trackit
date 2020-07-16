import { Component, HostListener, OnInit } from '@angular/core';
import { PermissionService } from './services/permission.service';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';

@Component({
  selector: 'ti-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  constructor(
    private permissionService: PermissionService,
    private breakpointObserver: BreakpointObserver
  ) {}

  title = 'TrackIt';

  version = document.lastModified;

  isMobile = false;

  deferredPrompt: any;
  showButton = false;
  isPersisted = false;
  persistenceInfo: object;

  ngOnInit() {
    this.breakpointObserver.observe('(max-width: 800px)').subscribe((state) => {
      this.isMobile = state.matches;
    });

    (async () => {
      this.isPersisted = await this.permissionService.isStoragePersisted();
    })();
    (async () => {
      this.persistenceInfo = await this.permissionService.getStorageInfo();
    })();
  }

  @HostListener('window:beforeinstallprompt', ['$event'])
  onbeforeinstallprompt(e) {
    console.log(e);
    // Prevent Chrome 67 and earlier from automatically showing the prompt
    e.preventDefault();
    // Stash the event so it can be triggered later.
    this.deferredPrompt = e;
    this.showButton = true;
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