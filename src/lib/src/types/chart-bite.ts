import { Bite, BiteFilters } from './bite';
import { Ingredient } from './ingredient';
import { AggregateFunctionOptions } from './ingredients';

export class ChartBite extends Bite {
  static colorPattern = ['#1ebfb3', '#0077ce', '#f2645a', '#9C27B0'];
  // HXL Proxy generated: values
  public values: any[];
  // HXL Proxy generated: categories
  public categories: string[];

  public swapAxis = true;
  public showGrid = false;
  public pieChart = false;
  public color = ChartBite.colorPattern[0];
  public sorting: string = null;

  static type(): string {
    return 'chart';
  }

  constructor(aggregateColumn: string, valueColumn: string, aggregateFunction: AggregateFunctionOptions,
              filters: BiteFilters, title?: string) {
    super(filters, title);
    this.ingredient = new Ingredient(aggregateColumn, valueColumn, aggregateFunction);
    this.dataTitle = valueColumn;
    this.displayCategory = 'Charts';
  }
}
