import { BreakpointObserver } from '@angular/cdk/layout';
import { Component, HostBinding, OnInit } from '@angular/core';

@Component({
  selector: 'ti-entries-page',
  templateUrl: './entries-page.component.html',
  styleUrls: ['./entries-page.component.css'],
})
export class EntriesPageComponent implements OnInit {
  @HostBinding('class.is-portrait')
  isPortrait: boolean;

  constructor(private breakpointObserver: BreakpointObserver) {}

  ngOnInit(): void {
    this.breakpointObserver
      .observe('(orientation: portrait)')
      .subscribe((state) => {
        this.isPortrait = state.matches;
      });
  }
}
