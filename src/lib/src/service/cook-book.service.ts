import { BiteFilters } from './../types/bite';
import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/operator/reduce';
import 'rxjs/add/observable/forkJoin';
import { BiteConfig } from '../types/bite-config';
import { HxlproxyService } from './hxlproxy.service';
import { Bite } from '../types/bite';
import { ChartBite } from '../types/chart-bite';
import { KeyFigureBite } from '../types/key-figure-bite';
import { ComparisonChartBite } from './../types/comparison-chart-bite';
import { BiteLogicFactory } from '../types/bite-logic-factory';
import { AggregateFunctionOptions } from '../types/ingredients';
import { TimeseriesChartBite } from '../types/timeseries-chart-bite';
import { MyLogService } from './mylog.service';
import { Observable } from 'rxjs/Observable';
import { AsyncSubject } from 'rxjs/AsyncSubject';
import 'rxjs/Rx';

@Injectable()
export class CookBookService {

  private config: { [s: string]: string; } = {};

  private cookBooks: string[];

  constructor(private logger: MyLogService, private hxlproxyService: HxlproxyService, private http: Http) {
    this.cookBooks = [
      // 'assets/bites-chart.json',
      // 'assets/bites-key-figure.json',
      'assets/bites.json',
    ];
  }

  private hxlMatcher(generalColumn: string, dataColumn: string): boolean {
    if (generalColumn === dataColumn) {
      return true;
    }
    return dataColumn.startsWith(generalColumn + '+');
  }

  private matchInSet(dataColumn: string, recipeColumns: string[]): boolean {
    return recipeColumns.filter(column => this.hxlMatcher(column, dataColumn)).length !== 0;
  }

  private findColsForComparisonChart(recipeColumns: string[], dataColumns: string[]): ComparisonBiteInfo[] {
    const comparisonBiteInfoList: ComparisonBiteInfo[] = [];
    recipeColumns.forEach(recipeCol => {
      // comp_sections should be something like: [1st_value_hxltag, comparison_operator, 2nd_value_hxltag]
      const comp_sections = recipeCol.split(' ');
      if (comp_sections.length === 3) {
        const info = new ComparisonBiteInfo(comp_sections[1]);
        dataColumns.forEach(dataCol => {
          if (dataCol === comp_sections[0]) {
            info.valueCol = dataCol;
          } else if (dataCol === comp_sections[2]) {
            info.comparisonValueCol = dataCol;
          }
        });
        if (info.isFilled()) {
          comparisonBiteInfoList.push(info);
        }
      } else {
        this.logger.error(`${recipeCol} should have 3 parts`);
      }
    });
    return comparisonBiteInfoList;
  }

  private determineAvailableBites(columnNames: Array<string>, hxlTags: Array<string>,
                                  biteConfigs: Array<BiteConfig>): Observable<Bite> {

    const bites: Observable<Bite> = new Observable<Bite>(observer => {
      biteConfigs.forEach((biteConfig) => {
        const aggregateColumns: Array<string> = [];
        const recipeColumns = biteConfig.ingredients.valueColumns;

        const dateColumns: Array<string> = [];

        let aggregateFunctions: AggregateFunctionOptions[] = biteConfig.ingredients.aggregateFunctions;
        if ( !aggregateFunctions || aggregateFunctions.length === 0 ) {
          aggregateFunctions = ['sum'];
        }


        let avAggCols: string[] = [];
        if (biteConfig.ingredients.aggregateColumns) {
          biteConfig.ingredients.aggregateColumns.forEach(col => {
            if (!(biteConfig.type === 'timeseries' && col.indexOf('#date') >= 0)) {
              aggregateColumns.push(col);
            }
          });

          // filter the available hxlTags, and not the recipe general tags
          avAggCols = hxlTags.filter(col => this.matchInSet(col, aggregateColumns));
          // avAggCols = aggregateColumns.filter(col => this.matchInSet(col, hxlTags));
        }

        let avValCols: string[] = [];
        let comparisonBiteInfoList: ComparisonBiteInfo[] = [];
        if (recipeColumns) {
          if (biteConfig.type === ComparisonChartBite.type()) {
            // avValCols will be empty in this case
            // We need to find data column pairs that match the recipe
            comparisonBiteInfoList = this.findColsForComparisonChart(recipeColumns, hxlTags);
          } else {
            // filter the available hxlTags, and not the recipe general tags
            avValCols = hxlTags.filter(col => this.matchInSet(col, recipeColumns));
          }

        }

        if (biteConfig.type === TimeseriesChartBite.type()) {
          hxlTags.forEach(col => {
            if (col.indexOf('#date') >= 0) {
              dateColumns.push(col);
            }
          });
        }

        this.logger.info(recipeColumns);

        const currentFilters = new BiteFilters(biteConfig.ingredients.filtersWith, biteConfig.ingredients.filtersWithout);
        switch (biteConfig.type) {
          case TimeseriesChartBite.type():
            dateColumns.forEach(dateColumn => {
              aggregateFunctions.forEach(aggFunction => {
                /* For count function we don't need value columns */
                const modifiedValueColumns = aggFunction === 'count' ? ['#count'] : avValCols;
                modifiedValueColumns.forEach(val => {
                  const simple_bite = new TimeseriesChartBite(dateColumn, null, val, aggFunction, currentFilters);
                  BiteLogicFactory.createBiteLogic(simple_bite).populateHashCode()
                    .populateWithTitle(columnNames, hxlTags);
                  observer.next(simple_bite);
                  avAggCols.forEach(agg => {
                    const multiple_data_bite = new TimeseriesChartBite(dateColumn, agg, val, aggFunction, currentFilters);
                    BiteLogicFactory.createBiteLogic(multiple_data_bite).populateHashCode()
                      .populateWithTitle(columnNames, hxlTags);
                    observer.next(multiple_data_bite);
                  });
                });
              });
            });

            break;
          case ComparisonChartBite.type():
            aggregateFunctions.forEach(aggFunction => {
              // We add a fake empty column for generating total comparisons (NOR grouped by any col)
              const avAggColsAndFake = avAggCols.concat(['']);
              avAggColsAndFake.forEach((agg) => {
                comparisonBiteInfoList.forEach(info => {
                  const bite = new ComparisonChartBite(agg, info.valueCol, aggFunction, info.comparisonValueCol,
                      info.operator, currentFilters);
                  BiteLogicFactory.createBiteLogic(bite).populateHashCode().populateWithTitle(columnNames, hxlTags);
                  observer.next(bite);
                });
              });
            });
            break;
          case ChartBite.type():
            aggregateFunctions.forEach(aggFunction => {
              avAggCols.forEach((agg) => {

                /* For count function we don't need value columns */
                const modifiedValueColumns = aggFunction === 'count' ? ['#count'] : avValCols;
                modifiedValueColumns.forEach(val => {
                  const bite = new ChartBite(agg, val, aggFunction, currentFilters);
                  BiteLogicFactory.createBiteLogic(bite).populateHashCode().populateWithTitle(columnNames, hxlTags);
                  observer.next(bite);
                });
              });
            });
            break;
          case KeyFigureBite.type():
            aggregateFunctions.forEach(aggFunction => {
              /* For count function we don't need value columns */
              const modifiedValueColumns = aggFunction === 'count' ? ['#count'] : avValCols;
              modifiedValueColumns.forEach(val => {
                const bite = new KeyFigureBite(val, aggFunction, currentFilters);
                BiteLogicFactory.createBiteLogic(bite).populateHashCode().populateWithTitle(columnNames, hxlTags);
                observer.next(bite);
              });
            });
            break;
        }
      });
      observer.complete();
    });

    return bites;
  }

  load(url: string, recipeUrl: string): Observable<Bite> {

    // if user is using an external recipe, provided as url
    if ( typeof recipeUrl !== 'undefined' ) {
      this.logger.info('Using external recipe from: ' + recipeUrl);
      this.cookBooks = [recipeUrl];
    }

    const cookBooksObs: Array<Observable<Response>> = this.cookBooks.map(book => this.http.get(book));
    const biteConfigs: Observable<BiteConfig[]> = cookBooksObs
      .reduce((prev, current, idx) => prev.merge(current))
      .mergeMap((res: Response) => res.json())
      .map((biteConfig) => <BiteConfig>biteConfig)
      .toArray();
      // .subscribe(json => console.log(json);
    const metaRows = this.hxlproxyService.fetchMetaRows(url);

    const bites: Observable<Bite> = Observable.forkJoin(
      biteConfigs,
      metaRows
    )
      .mergeMap(
        res => {
          const configs: BiteConfig[] = res[0];
          const rows = res[1];
          const columnNames: string[] = rows[0];
          const hxlTags: string[] = rows[1];

          return this.determineAvailableBites(columnNames, hxlTags, configs);
        }
      );

    let temp = bites.catch(err => this.handleError(err));
    temp.subscribe(bite => this.logger.log(bite), (error: any) => console.log('RECIPE: ' + error));

    return bites;
  }

  private handleError (error: Response | any) {
    let errMsg: string;
    if (error instanceof Response) {
      try {
        const body = error.json() || '';
        const err = body.error || JSON.stringify(body);
        errMsg = `${error.status} - ${error.statusText || ''} ${err}`;
      } catch (e) {
        errMsg = e.toString();
      }
    } else {
      errMsg = error.message ? error.message : error.toString();
    }
    console.error('ERR! ' + errMsg);
    const retValue = Observable.throw(errMsg);
    return retValue;
  }

}

class ComparisonBiteInfo {
  public valueCol: string;
  public comparisonValueCol: string;

  constructor(public operator: string) {}

  public isFilled(): boolean {
    if (this.valueCol && this.comparisonValueCol && this.operator) {
      return true;
    }
    return false;
  }
}
