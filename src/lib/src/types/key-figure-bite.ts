import { Bite } from './bite';
import { Ingredient, BiteFilters } from './ingredient';
import { AggregateFunctionOptions } from './ingredients';

export class KeyFigureBite extends Bite {
  // HXL Proxy generated: value
  public value: number;

  /* k, mln, bln */
  public unit: string;

  /**
   * User properties
   */
  // text preceding "value"
  public preText: string;
  // text after "value"
  public postText: string;
  // description of key figure
  public description: string;

  public numberFormat: string;

  static type(): string {
    return 'key figure';
  }

  constructor(ingredient: Ingredient) {
    super(ingredient);
    this.dataTitle = ingredient.valueColumn;
    this.displayCategory = 'Key Figures';
    this.unit = null;
  }

}
