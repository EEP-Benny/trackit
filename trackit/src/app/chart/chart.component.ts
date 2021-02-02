import {
  Component,
  ElementRef,
  HostListener,
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
  private width: number;
  private height: number;
  private entries: IEntry[];

  private hostElement: HTMLElement;

  private xScaleBase = d3
    .scaleTime()
    .domain([d3.timeMonth.offset(new Date(), -1), new Date()]);
  private xScale = this.xScaleBase;
  private yScale = d3.scaleLinear();
  private dataContainer: d3.Selection<SVGGElement, unknown, null, unknown>;
  private xAxisContainer: d3.Selection<SVGGElement, unknown, null, unknown>;
  private yAxisContainer: d3.Selection<SVGGElement, unknown, null, unknown>;

  constructor(private readonly entryService: EntryService, elRef: ElementRef) {
    this.hostElement = elRef.nativeElement;
  }

  @HostListener('window:resize')
  private resize() {
    if (!this.hostElement || !this.xAxisContainer || !this.yAxisContainer) {
      return;
    }
    this.width = this.hostElement.clientWidth;
    this.height = this.hostElement.clientHeight;

    const margin = { top: 20, right: 30, bottom: 30, left: 40 };
    const left = margin.left;
    const right = this.width - margin.right;
    const top = margin.top;
    const bottom = this.height - margin.bottom;

    this.xScaleBase.range([left, right]);
    this.xScale.range([left, right]);
    this.yScale.range([bottom, top]);

    this.xAxisContainer.attr('transform', `translate(0,${bottom})`);
    this.yAxisContainer.attr('transform', `translate(${left},0)`);

    this.redrawXAxis();
    this.redrawYAxis();
    this.redrawData();
  }

  ngOnInit(): void {
    this.initializeChart();
    this.resize();

    // TODO: unsubscribe
    this.entryService.getAllEntries().subscribe((entries) => {
      this.entries = entries;
      this.yScale.domain(d3.extent(entries, (d) => d.value));
      this.redrawYAxis();
      this.redrawData();
    });
  }

  private initializeChart() {
    const svg = d3.select(this.hostElement).append('svg');
    svg.call(d3.zoom().on('zoom', (event) => this.zoomed(event)));
    this.dataContainer = svg.append('g');
    this.xAxisContainer = svg.append('g');
    this.yAxisContainer = svg.append('g');
  }

  private zoomed(event: d3.D3ZoomEvent<null, unknown>) {
    this.xScale = event.transform.rescaleX(this.xScaleBase);
    this.redrawXAxis();
    this.redrawData();
  }

  private redrawXAxis() {
    if (!this.xAxisContainer) {
      return;
    }
    this.xAxisContainer.call(
      d3
        .axisBottom(this.xScale)
        .ticks(this.width / 80)
        .tickSizeOuter(0)
    );
  }
  private redrawYAxis() {
    if (!this.yAxisContainer) {
      return;
    }
    this.yAxisContainer.call(d3.axisLeft(this.yScale).ticks(this.height / 40));
  }
  private redrawData() {
    if (!this.dataContainer || !this.entries) {
      return;
    }
    this.dataContainer
      .selectAll('circle')
      .data(this.entries)
      .join((enter) => enter.append('circle'))
      .attr('cx', (d) => this.xScale(d.timestamp))
      .attr('cy', (d) => this.yScale(d.value));
  }
}
