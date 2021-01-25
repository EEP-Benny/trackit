import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'ti-spinner',
  templateUrl: './spinner.component.html',
  styleUrls: ['./spinner.component.css'],
})
export class SpinnerComponent implements OnInit {
  @Input()
  size = 48;

  constructor() {}

  ngOnInit(): void {}
}
