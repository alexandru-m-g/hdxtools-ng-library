import { NgModule } from '@angular/core';
import { ModalModule } from 'ngx-bootstrap/modal';
import { SimpleModalComponent } from './component/simple-modal.component';

@NgModule({
  imports: [
    ModalModule.forRoot()
  ],
  declarations: [SimpleModalComponent],
  exports: [SimpleModalComponent]
})
export class SimpleModule { }
