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
  private canvas: d3.Selection<HTMLCanvasElement, unknown, null, unknown>;
  private context: CanvasRenderingContext2D;
  private xAxisContainer: d3.Selection<SVGGElement, unknown, null, unknown>;
  private yAxisContainer: d3.Selection<SVGGElement, unknown, null, unknown>;
  private redrawTimeout: d3.Timer;

  constructor(private readonly entryService: EntryService, elRef: ElementRef) {
    this.hostElement = elRef.nativeElement;
  }

  @HostListener('window:resize')
  private resize() {
    if (!this.hostElement) {
      return;
    }
    this.width = this.hostElement.clientWidth;
    this.height = this.hostElement.clientHeight;

    this.canvas.attr('width', this.width);
    this.canvas.attr('height', this.height);

    this.xScaleBase.range([0, this.width]);
    this.xScale.range([0, this.width]);
    this.yScale.range([this.height, 0]);

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
      const [yMin, yMax] = d3.extent(entries, (d) => d.value);
      const padding = (yMax - yMin) * 0.01;
      this.yScale.domain([yMin - padding, yMax + padding]);
      this.redrawYAxis();
      this.redrawData();
    });
  }

  private initializeChart() {
    const host = d3.select(this.hostElement);
    this.canvas = host.append('canvas');
    this.canvas.call(d3.zoom().on('zoom', (event) => this.zoomed(event)));
    this.context = this.canvas.node().getContext('2d');
    this.xAxisContainer = host.append('svg').attr('class', 'bottom');
    this.yAxisContainer = host.append('svg').attr('class', 'left');
  }

  private zoomed(event: d3.D3ZoomEvent<null, unknown>) {
    this.xScale = event.transform.rescaleX(this.xScaleBase);
    this.redrawTimeout?.stop();
    this.redrawTimeout = d3.timeout(() => {
      this.redrawXAxis();
      this.redrawData();
    });
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
    this.yAxisContainer.call(
      d3
        .axisLeft(this.yScale)
        .ticks(this.height / 40)
        .tickSizeOuter(0)
    );
  }
  private redrawData() {
    if (!this.entries) {
      return;
    }
    this.context.clearRect(0, 0, this.width, this.height);
    this.entries.forEach((d: IEntry) => {
      const x = this.xScale(d.timestamp);
      const y = this.yScale(d.value);
      const radius = 3;
      const startAngle = 0;
      const endAngle = 2 * Math.PI;
      this.context.beginPath();
      this.context.fillStyle = '#000000';
      this.context.arc(x, y, radius, startAngle, endAngle);
      this.context.fill();
    });
  }
}
