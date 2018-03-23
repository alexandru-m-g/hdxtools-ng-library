import { AggregateFunctionOptions } from './ingredients';
import { BiteFilters, Ingredient } from './ingredient';
import { ChartBite, ChartDataProperties, ChartUIProperties } from './chart-bite';

export class ComparisonChartBite extends ChartBite {

  static type(): string {
    return 'comparison-chart';
  }

  constructor(ingredient: Ingredient) {
    super(ingredient);
    this.dataProperties = new ComparisonChartDataProperties();

  }

}
export class ComparisonChartDataProperties extends ChartDataProperties {
  // HXL Proxy generated: values
  public comparisonValues: any[];
}

export class ComparisonChartUIProperties extends ChartUIProperties {
  public stackChart = false;
}
