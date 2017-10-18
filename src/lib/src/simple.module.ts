import { HttpModule } from '@angular/http';
import { MyLogService } from './service/mylog.service';
import { CookBookService } from './service/cook-book.service';
import { HxlproxyService } from './service/hxlproxy.service';
import { AnalyticsService } from './service/analytics.service';
import { NgModule, ModuleWithProviders } from '@angular/core';
import { ModalModule } from 'ngx-bootstrap/modal';
import { SimpleModalComponent } from './component/simple-modal.component';

@NgModule({
  imports: [
    HttpModule,
    ModalModule.forRoot()
  ],
  declarations: [SimpleModalComponent],
  providers: [HxlproxyService, CookBookService, AnalyticsService, MyLogService],
  exports: [
    SimpleModalComponent
  ]
})
export class SimpleModule {}
