import { ColorUsage } from './bite-logic';
import { ComparisonChartBite } from './comparison-chart-bite';
import { ChartBiteLogic } from './chart-bite-logic';

export class ComparisonChartBiteLogic extends ChartBiteLogic {

  constructor(protected bite: ComparisonChartBite) {
    super(bite);
  }

  protected buildImportantPropertiesList(): string[] {
    const importantProperties = super.buildImportantPropertiesList();
    importantProperties.push(this.bite.ingredient.comparisonValueColumn, this.bite.ingredient.comparisonOperator);
    return importantProperties;
  }

  public populateWithHxlProxyInfo(hxlData: any[][], tagToTitleMap: any): ComparisonChartBiteLogic {
    super.populateWithHxlProxyInfo(hxlData, tagToTitleMap);
    this.bite.pieChart = false;

    const valColIndex = this.findHxlTagIndex(this.bite.ingredient.valueColumn, hxlData);
    const compColIndex = this.findHxlTagIndex(this.bite.ingredient.comparisonValueColumn, hxlData);

    if ( compColIndex >= 0) {
      this.bite.comparisonValues = [this.bite.ingredient.comparisonValueColumn];

      for (let i = 2; i < hxlData.length; i++) {
        let computedValue = hxlData[i][compColIndex];

        // If we have more than 1 row of data
        if (hxlData.length > 3) {
          computedValue = computedValue - hxlData[i][valColIndex];
        }
        this.bite.comparisonValues.push(computedValue);
      }
      this.bite.init = true;
    } else {
      throw new Error(`${this.bite.ingredient.comparisonValueColumn}` + ' not found in hxl proxy response');
    }

    return this;
  }

  public get valueColumns(): string[] {
    return [
      this.bite.ingredient.valueColumn,
      this.bite.ingredient.comparisonValueColumn
    ];
  }

  public colorUsage(): ColorUsage {
    return ColorUsage.MANY;
  }
}
