import { BiteFilters } from './bite';
import { ChartBite } from './chart-bite';
import { AggregateFunctionOptions } from './ingredients';

export class TimeseriesChartBite extends ChartBite {
  static type(): string {
    return 'timeseries';
  }

  constructor(dateColumn: string, aggregateColumn: string, valueColumn: string,
              aggregateFunction: AggregateFunctionOptions, filters: BiteFilters, title?: string) {

    super(aggregateColumn, valueColumn, aggregateFunction, filters, title);
    this.ingredient.dateColumn = dateColumn;
    this.displayCategory = 'Timeseries';
    this.color = ChartBite.colorPattern[1];
  }
}
