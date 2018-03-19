import { Bite, UIProperties, ComputedProperties, DataProperties } from './bite';
export abstract class BiteLogic {

  constructor(protected bite: Bite) {
    if (!bite.uiProperties) {
      bite.uiProperties = new UIProperties();
    }
    if (!bite.computedProperties) {
      bite.computedProperties = new ComputedProperties();
    }
    if (bite['description']) {
      bite.uiProperties.description = bite['description'];
      delete bite['description'];
    }
    if (bite['title']) {
      bite.uiProperties.title = bite['title'];
      delete bite['title'];
    }
  }


  public abstract initUIProperties(): UIProperties;
  public abstract initComputedProperties(): ComputedProperties;
  public abstract initDataProperties(): DataProperties;
  /**
   * Generally used before saving the bite. We don't want the values to be saved as well.
   * The bites should have fresh data loaded from the data source each time.
   *
   * @return {BiteLogic}
   */
  public unpopulateBite(): BiteLogic {
    this.bite.dataProperties = this.initDataProperties();
    return this;
  }

  public resetBite(): BiteLogic {
    this.bite.dataProperties = this.initDataProperties();
    this.bite.uiProperties = this.initUIProperties();
    this.bite.computedProperties = this.initComputedProperties();
    return this;
  }

  protected populateDataTitleWithHxlProxyInfo(): BiteLogic {
    if (!this.bite.computedProperties.dataTitle) {
      this.bite.computedProperties.dataTitle = this.bite.ingredient.valueColumn;
    }
    return this;
  }

  protected findHxlTagIndex(hxlTag: string, hxlData: any[][]): number {
    if (hxlData && hxlData.length > 2) {
      for (let i = 0; i < hxlData[1].length; i++) {
        const currentTag: string = hxlData[1][i];
        if (currentTag === hxlTag) {
          return i;
        }
      }
    }
    return -1;
  }

  public getBite(): Bite {
    return this.bite;
  }

  public populateHashCode(): BiteLogic {
    this.bite.hashCode = this.strListHash(this.buildImportantPropertiesList());
    return this;
  }

  protected buildImportantPropertiesList(): string[] {
    const importantProperties: string[] = [];
    importantProperties.push(this.bite.ingredient.title, this.bite.type);
    importantProperties.push(this.bite.ingredient.valueColumn, this.bite.ingredient.aggregateColumn);
    return importantProperties;
  }

  protected strHash(theString: string, startHash?: number): number {
    let i, chr, len;
    let hash = startHash ? startHash : 0;
    if (!theString || theString.length === 0) {
      return hash;
    }
    for (i = 0, len = theString.length; i < len; i++) {
      chr = theString.charCodeAt(i);
      /* tslint:disable */
      hash = ((hash << 5) - hash) + chr;
      hash |= 0; // Convert to 32bit integer
      /* tslint:enable */
    }
    return hash;
  };

  protected strListHash(strList: string[]): number {
    let hash = 0;
    if (strList) {
      for (let i = 0; i < strList.length; i++) {
        const curStr = strList[i];
        hash = this.strHash(curStr, hash);
      }
    }
    return hash;
  };

  public populateWithTitle(columnNames: string[], hxlTags: string[]): BiteLogic {
    if (!this.bite.ingredient.title) {
      const availableTags = {};
      hxlTags.forEach((v, idx) => availableTags[v] = idx);

      const valueColumn = columnNames[availableTags[this.bite.ingredient.valueColumn]];
      const hxlValueColumn = hxlTags[availableTags[this.bite.ingredient.valueColumn]];
      const groupColumn = columnNames[availableTags[this.bite.ingredient.aggregateColumn]];
      let aggFunction = null;
      switch (this.bite.ingredient.aggregateFunction) {
        case 'count':
          aggFunction = 'Row Count';
          break;
        case 'distinct-count':
          aggFunction = 'Unique Values in';
          break;
        case 'sum':
          aggFunction = 'Sum of';
          break;
        default:
          aggFunction = 'Sum of';
          break;
      }

      let title = aggFunction;
      if (valueColumn && valueColumn.trim().length > 0) {
        title += ' ' + valueColumn;
      } else if (hxlValueColumn && hxlValueColumn.trim().length > 0) {
        title += ' ' + hxlValueColumn;
      }
      if (groupColumn && groupColumn.trim().length > 0) {
        title += ' grouped by ' + groupColumn;
      }
      this.bite.computedProperties.title = title;
    }

    return this;
  }

  public hasFilters(): boolean {
    if (this.bite.ingredient.filters) {
      const filterWith = this.bite.ingredient.filters.filterWith;
      const filterWithout = this.bite.ingredient.filters.filterWithout;
      if (filterWith && filterWith.length > 0) {
        return true;
      } else if (filterWithout && filterWithout.length > 0 ) {
        return true;
      }
    }
    return false;
  }

  public usesDateColumn(): boolean {
    // if (this.bite.ingredient.dateColumn) {
    //   return true;
    // }
    return false;
  }

  public get dataProperties(): DataProperties {
    return this.bite.dataProperties;
  }

  public get uiProperties(): UIProperties {
    return this.bite.uiProperties;
  }

  public get computedProperties(): ComputedProperties {
    return this.bite.computedProperties;
  }

  public get dateColumn(): string {
    return this.bite.ingredient.dateColumn;
  }

  public get valueColumns(): string[] {
    return [this.bite.ingredient.valueColumn];
  }

  public get title(): string {
    const title = this.bite.uiProperties.title || this.bite.ingredient.title || this.bite.computedProperties.title;
    return title;
  }

  public get description(): string {
    const description = this.bite.uiProperties.description || this.bite.ingredient.description;
    return description;
  }

  public get dataTitle(): string {
    const dataTitle = this.bite.uiProperties.dataTitle || this.bite.computedProperties.dataTitle;
    return dataTitle;
  }

  public abstract populateWithHxlProxyInfo(hxlData: any[][], tagToTitleMap: any): BiteLogic;

  public abstract colorUsage(): ColorUsage;

}

export enum ColorUsage {
  NONE,
  ONE,
  MANY
}
