export type AggregateFunctionOptions = 'sum' | 'count' | 'distinct-count';

/**
 * List of key-value pairs like {"columnName": "valueToFilter"}
 */
export type HxlFilter = { [s: string]: string; }[];

export interface Ingredients {
  aggregateColumns: string[];
  valueColumns: string[];
  aggregateFunctions: AggregateFunctionOptions[];
  filtersWith: HxlFilter[];
  filtersWithout: HxlFilter[];
}
