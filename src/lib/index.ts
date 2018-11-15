export { SimpleModalComponent } from './src/component/simple-modal.component';
export { SimpleModule } from './src/simple.module';

// export { CookBookService } from './src/service/cook-book.service';
// export { HxlproxyService } from './src/service/hxlproxy.service';

// export { KeyFigureBiteLogic } from './src/types/key-figure-bite-logic';
// export { KeyFigureBite } from './src/types/key-figure-bite';
// export { TimeseriesChartBiteLogic } from './src/types/timeseries-chart-bite-logic';
// export { TimeseriesChartBite } from './src/types/timeseries-chart-bite';
// export { ChartBite } from './src/types/chart-bite';
// export { Bite } from './src/types/bite';
// export { BiteConfig } from './src/types/bite-config';
// export { BiteLogicFactory } from './src/types/bite-logic-factory';

import { CookBookService, CookbooksAndTags } from './src/service/cook-book.service';
import { HxlproxyService } from './src/service/hxlproxy.service';
import { AnalyticsService, GA_EVENT, GA_PAGEVIEW, GaExtras, MapOfStrings } from './src/service/analytics.service';

import { KeyFigureBiteLogic } from './src/types/key-figure-bite-logic';
import { KeyFigureBite, KeyFigureUIProperties, KeyFigureComputedProperties, KeyFigureDataProperties } from './src/types/key-figure-bite';
import { TimeseriesChartBiteLogic } from './src/types/timeseries-chart-bite-logic';
import { TimeseriesChartBite } from './src/types/timeseries-chart-bite';
import { ComparisonChartBiteLogic } from './src/types/comparison-chart-bite-logic';
import { ComparisonChartBite, ComparisonChartDataProperties, ComparisonChartUIProperties } from './src/types/comparison-chart-bite';
import { ChartBite, ChartUIProperties, ChartComputedProperties, ChartDataProperties } from './src/types/chart-bite';
import { ChartBiteLogic } from './src/types/chart-bite-logic';
import { ColorUsage, BiteLogic } from './src/types/bite-logic';
import { Bite, UIProperties, ComputedProperties, DataProperties } from './src/types/bite';
import { BiteConfig, Cookbook } from './src/types/bite-config';
import { BiteLogicFactory } from './src/types/bite-logic-factory';
import { UnitsUtil } from './src/util/units-util';


export { CookBookService, HxlproxyService, AnalyticsService, KeyFigureBite, KeyFigureBiteLogic, ChartBite, ChartBiteLogic,
    TimeseriesChartBite, TimeseriesChartBiteLogic, ComparisonChartBite, ComparisonChartBiteLogic, BiteLogic,
    Bite, BiteConfig, BiteLogicFactory, ColorUsage, UnitsUtil,
    Cookbook, CookbooksAndTags,
    UIProperties, KeyFigureUIProperties, ChartUIProperties, ComparisonChartUIProperties,
    ComputedProperties, KeyFigureComputedProperties, ChartComputedProperties,
    DataProperties, KeyFigureDataProperties, ChartDataProperties, ComparisonChartDataProperties,
    GA_EVENT, GA_PAGEVIEW, GaExtras, MapOfStrings }
