import { Injectable } from '@angular/core';
import { MyLogService } from './mylog.service';

declare const ga: any;
declare const mixpanel: any;

export type MapOfStrings = { [s: string]: string|boolean|number; };
export type GaExtras = {
  'type'?: string,
  'label'?: string,
  'action'?: string,
  'value'?: number,
};

export const GA_PAGEVIEW = 'pageview';
export const GA_EVENT = 'event';

/**
 * Service that will try to abstract sending the analytics events
 * to Google Analytics and Mixpanel, but do nothing if the libs are
 * not loaded
 */
@Injectable()
export class AnalyticsService {
  private gaInitialised = false;
  private mpInitialised = false;

  public gaToken: string;
  public mpToken: string;

  constructor(private logger: MyLogService) { }

  public init(gaKey: string, mpKey: string) {
    try {
      this.gaToken = gaKey;
      if (this.gaToken) {
        ga('create', this.gaToken, 'auto');
        this.gaInitialised = true;
      }
    } catch (err) {
      this.logger.info('Can\'t initialize Google Analytics: ' + err);
    }

    try {
      this.mpToken = mpKey;
      if (this.mpToken) {
        mixpanel.init(this.mpToken);
        this.mpInitialised = true;
      }
    } catch (err) {
      this.logger.info('Can\'t initialize Mixpanel: ' + err);
    }
  }

  public isInitialized(): boolean {
    return this.gaInitialised && this.mpInitialised;
  }

  // public trackView() {
  //   const category = 'hxl preview';
  //   const {url, pageTitle} = this.extractPageInfo();
  //   const gaData = {
  //     type: 'pageview',
  //     category: category,
  //     action: 'view',
  //     label: pageTitle || ''
  //   };
  //   const mpData = {
  //     category: category,
  //     metadata: {
  //       url: url,
  //       pageTitle: pageTitle,
  //     }
  //   };
  //   this.send(gaData, mpData);
  // }

  private extractPageInfo() {
    let url: string;
    let pageTitle: string;
    try {
      url = (window.location !== window.parent.location)
        ? document.referrer
        : document.location.href;
      pageTitle = window.parent ? window.parent.document.title : window.document.title;
    } catch (Exception) {
      /* we don't have access to the parent due to cross-origin */
      url = document.referrer;
      pageTitle = window.document.title;
      this.logger.log(`in security error because of cross origin - url is ${url} and pageTitle is ${pageTitle}`);
    }
    return {url, pageTitle};
  }

  // public trackSave() {
  //   this.trackEventCategory('hxl preview edit');
  // }

  public trackEventCategory(category: string, additionalGaData?: GaExtras, additionalMpData?: MapOfStrings) {
    const {url, pageTitle} = this.extractPageInfo();
    additionalGaData = additionalGaData ? additionalGaData : {};

    const gaData = {
      type: additionalGaData.type || GA_EVENT,
      category: category,
      action: additionalGaData.action || null,
      label: additionalGaData.label || pageTitle || null,
      value: additionalGaData.value || null
    };

    const mpData = {
      category: category,
      metadata: {
        'embedded in': url,
        'page title': pageTitle,
      }
    };
    if (additionalMpData) {
      Object.assign(mpData.metadata, additionalMpData);
    }


    this.send(gaData, mpData);
  }

  private send(gaData: any, mpData: any) {
    // this.logger.info('Logging the event...');
    if (this.gaInitialised) {
      // this.logger.info('    Google Analytics - ok');
      if (GA_PAGEVIEW === gaData.type) {
        ga('send', 'pageview');
      } else {
        ga('send', gaData.type, gaData.category, gaData.action, gaData.label, gaData.value);
      }
    }

    if (this.mpInitialised) {
      // this.logger.info('    Mixpanel         - ok');
      mixpanel.track(mpData.category, mpData.metadata);
    }
  }

}
