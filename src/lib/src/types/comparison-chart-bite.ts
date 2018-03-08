import { BiteFilters } from './bite';
import { AggregateFunctionOptions } from './ingredients';
import { ChartBite } from './chart-bite';

export class ComparisonChartBite extends ChartBite {

  // HXL Proxy generated: values
  public comparisonValues: any[];

  static type(): string {
    return 'comparison-chart';
  }

  constructor(aggregateColumn: string, valueColumn: string, aggregateFunction: AggregateFunctionOptions,
    comparisonValueColumn: string, comparisonOperator: string,
    filters: BiteFilters, title?: string) {
    super(aggregateColumn, valueColumn, aggregateFunction, filters, title);

    this.ingredient.comparisonOperator = comparisonOperator;
    this.ingredient.comparisonValueColumn = comparisonValueColumn;
  }

}
