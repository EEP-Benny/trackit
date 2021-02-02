import {
  Component,
  ElementRef,
  OnInit,
  ViewEncapsulation,
} from '@angular/core';
import * as d3 from 'd3';
import { EntryService } from '../services/entry.service';
import { IEntry } from '../interfaces/IEntry';

@Component({
  selector: 'ti-chart',
  encapsulation: ViewEncapsulation.None,
  template: '', // we don't need a template, content is added by D3
  styleUrls: ['./chart.component.scss'],
})
export class ChartComponent implements OnInit {
  private margin = { top: 20, right: 30, bottom: 30, left: 40 };
  private width: number;
  private height: number;
  private entries: IEntry[];

  private hostElement: HTMLElement;
  private chartContainer: d3.Selection<SVGGElement, unknown, null, unknown>;
  private dataContainer: d3.Selection<SVGGElement, unknown, null, unknown>;
  private xAxisContainer: d3.Selection<SVGGElement, unknown, null, unknown>;
  private yAxisContainer: d3.Selection<SVGGElement, unknown, null, unknown>;

  constructor(private readonly entryService: EntryService, elRef: ElementRef) {
    this.hostElement = elRef.nativeElement;
  }

  ngOnInit(): void {
    this.width =
      this.hostElement.clientWidth - this.margin.left - this.margin.right;
    this.height =
      this.hostElement.clientHeight - this.margin.top - this.margin.bottom;

    // TODO: unsubscribe
    this.entryService.getAllEntries().subscribe((entries) => {
      this.entries = entries;
      this.updateChart();
    });
  }

  private initializeChart() {
    const svg = d3.select(this.hostElement).append('svg');

    this.chartContainer = svg
      .append('g')
      .attr(
        'transform',
        `translate(${this.margin.left},${this.margin.top + this.height})`
      );
    this.dataContainer = this.chartContainer.append('g');
    this.xAxisContainer = this.chartContainer.append('g');
    this.yAxisContainer = this.chartContainer.append('g');
  }

  private updateChart() {
    if (!this.dataContainer || !this.xAxisContainer || !this.yAxisContainer) {
      this.initializeChart();
    }
    const x = d3
      .scaleUtc()
      .domain(d3.extent(this.entries, (d) => d.timestamp))
      .range([0, this.width]);
    const y = d3
      .scaleLinear()
      .domain([0, d3.max(this.entries, (d) => d.value)])
      .range([0, -this.height]);

    this.xAxisContainer.call(
      d3
        .axisBottom(x)
        .ticks(this.width / 80)
        .tickSizeOuter(0)
    );

    this.yAxisContainer.call(d3.axisLeft(y).ticks(this.height / 40));

    this.dataContainer
      .selectAll('circle')
      .data(this.entries)
      .join((enter) => enter.append('circle'))
      .attr('cx', (d) => x(d.timestamp))
      .attr('cy', (d) => y(d.value));
  }
}
