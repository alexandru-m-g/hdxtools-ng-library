import { Ingredients } from './ingredients';

/**
 * Represents 1 loaded HXL Recipe
 */
export interface BiteConfig {
  name: string;
  title: string;
  description: string;
  type: string;
  ingredients: Ingredients;
}
