import { BiteLogic, ColorUsage } from './bite-logic';
import { ChartBite, ChartDataProperties, ChartUIProperties, ChartComputedProperties } from './chart-bite';

export class ChartBiteLogic extends BiteLogic {

  constructor(protected bite: ChartBite) {
    super(bite);
  }

  public populateWithHxlProxyInfo(hxlData: any[][], tagToTitleMap: any): ChartBiteLogic {
    super.populateDataTitleWithHxlProxyInfo();

    const valColIndex = this.findHxlTagIndex(this.bite.ingredient.valueColumn, hxlData);
    const aggColIndex = this.findHxlTagIndex(this.bite.ingredient.aggregateColumn, hxlData);

    const dataProperties = this.bite.dataProperties as ChartDataProperties;
    const computedProperties = this.bite.computedProperties as ChartComputedProperties;
    if ( aggColIndex >= 0 && valColIndex >= 0) {

      dataProperties.values = [computedProperties.dataTitle];
      dataProperties.categories = [];

      for (let i = 2; i < hxlData.length; i++) {
        dataProperties.values.push(hxlData[i][valColIndex]);
        dataProperties.categories.push(hxlData[i][aggColIndex]);
      }

      computedProperties.pieChart = !(dataProperties.values.length > 5);

    } else {
      throw new Error(`${this.bite.ingredient.valueColumn} or ${this.bite.ingredient.aggregateColumn}`
          + 'not found in hxl proxy response');
    }
    return this;
  }

  public initUIProperties(): ChartUIProperties {
    return new ChartUIProperties();
  }
  public initComputedProperties(): ChartComputedProperties {
    return new ChartComputedProperties();
  }
  public initDataProperties(): ChartDataProperties {
    return new ChartDataProperties();
  }

  public colorUsage(): ColorUsage {
    if (this.pieChart) {
      return ColorUsage.NONE;
    }
    return ColorUsage.ONE;
  }

  public get dataProperties(): ChartDataProperties {
    return this.bite.dataProperties as ChartDataProperties;
  }

  public get uiProperties(): ChartUIProperties {
    return this.bite.uiProperties as ChartUIProperties;
  }

  public get computedProperties(): ChartComputedProperties {
    return this.bite.computedProperties as ChartComputedProperties;
  }

  public get pieChart(): boolean {
    return this.computedProperties.pieChart;
  }

  public get swapAxis(): boolean {
    return this.uiProperties.swapAxis;
  }

  public get showGrid(): boolean {
    return this.uiProperties.showGrid;
  }

  public get color(): string {
    return this.uiProperties.color;
  }

  public get sorting(): string {
    return this.uiProperties.sorting;
  }

  public get limit(): number {
      return this.uiProperties.limit;
  }

  public get categories(): string[] {
    return this.dataProperties.categories;
  }

  public get values(): any[] {
    return this.dataProperties.values;
  }

}
