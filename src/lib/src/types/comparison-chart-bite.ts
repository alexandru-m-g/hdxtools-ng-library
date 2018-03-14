import { AggregateFunctionOptions } from './ingredients';
import { BiteFilters, Ingredient } from './ingredient';
import { ChartBite } from './chart-bite';

export class ComparisonChartBite extends ChartBite {

  // HXL Proxy generated: values
  public comparisonValues: any[];

  static type(): string {
    return 'comparison-chart';
  }
}
