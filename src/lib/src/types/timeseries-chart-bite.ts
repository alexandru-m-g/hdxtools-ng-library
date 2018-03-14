import { ChartBite } from './chart-bite';
import { AggregateFunctionOptions } from './ingredients';
import { BiteFilters, Ingredient } from './ingredient';

export class TimeseriesChartBite extends ChartBite {
  static type(): string {
    return 'timeseries';
  }

  constructor(ingredient: Ingredient) {

    super(ingredient);
    this.color = ChartBite.colorPattern[1];
    this.displayCategory = 'Timeseries';
  }
}
