import { BrowserModule } from '@angular/platform-browser'
import { NgModule } from '@angular/core'
import { AppComponent } from './app.component'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import { TaskComponent } from './form-component/form.component'
import { FormsModule } from '@angular/forms'
import { DatePipe } from '@angular/common'
import { ConfirmationService, MessageService } from 'primeng/api'

// Import individual PrimeNG modules
import { PickListModule } from 'primeng/picklist'
import { CalendarModule } from 'primeng/calendar'
import { InputSwitchModule } from 'primeng/inputswitch'
import { ButtonModule } from 'primeng/button'
import { InputTextModule } from 'primeng/inputtext'
import { ListboxModule } from 'primeng/listbox'
import { ToastModule } from 'primeng/toast'
import { BadgeModule } from 'primeng/badge'
import { ConfirmDialogModule } from 'primeng/confirmdialog'
import { SelectButtonModule } from 'primeng/selectbutton';
import { DialogModule } from 'primeng/dialog';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { TaskListComponent } from './task-list-component/taskListComponent'
import { CallFunctionServiceService } from './callFunctionService.service'

// List of PrimeNG modules
const PrimeNGModules = [
  PickListModule,
  CalendarModule,
  InputSwitchModule,
  ButtonModule,
  InputTextModule,
  ConfirmDialogModule,
  ListboxModule,
  ToastModule,
  BadgeModule,
  SelectButtonModule, 
  DialogModule,
  IconFieldModule,
  InputIconModule
]

@NgModule({
  imports: [BrowserModule, BrowserAnimationsModule, FormsModule, DatePipe, ...PrimeNGModules],
  declarations: [TaskComponent, AppComponent, TaskListComponent],
  bootstrap: [AppComponent],
  providers: [MessageService, ConfirmationService, CallFunctionServiceService],
})
export class AppModule { }
