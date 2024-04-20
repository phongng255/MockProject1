import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core'
import { Task } from '../../model/task'
import { MessageService } from 'primeng/api'
import { NgForm } from '@angular/forms'
import * as uuid from 'uuid';
import { CallFunctionServiceService } from '../callFunctionService.service';

@Component({
  selector: 'app-Task',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.css'],
})
export class TaskComponent implements OnInit {
  isEditMode = true
  @Input() task: Task = new Task()
  @Output() messageEvent = new EventEmitter<Task>()
  @ViewChild('taskForm') taskForm!: NgForm

  constructor(
    private messageService: MessageService,
    private callFunctionServiceService: CallFunctionServiceService
  ) {
  }

  ngOnInit(): void {
    this.callFunctionServiceService.onFunctionCall().subscribe(() => {
      this.resetValueForm();
    });
  }

  resetValueForm(flagChangeisEditMode : boolean = true): void {
    this.taskForm.form.markAsPristine();
    this.taskForm.form.markAsUntouched();
    this.taskForm.form.updateValueAndValidity();
    this.task = new Task()
    if(flagChangeisEditMode){
      this.isEditMode = true;
    }
    // this.isEditMode = true;
  }

  enableCreateButton(): boolean {
    const enableButton =
      !!this.task.taskName &&
      !!this.task.description &&
      (this.task.dueDate != null || this.task.dueDate != undefined)
    return enableButton
  }

  async saveTask(): Promise<void> {
    const confirmed = await this.callFunctionServiceService.confirmWithMessage('Are you sure?', 'Confirmation')
    if (!confirmed || !this.taskForm.valid) {
      this.messageService.add({
        severity: 'error',
        summary: 'Rejected',
        detail: 'You have rejected',
      })
      return
    }

    this.task.id = uuid.v4()
    this.messageEvent.emit({ ...this.task })
    this.resetValueForm(true);
  }

  async updateItem(): Promise<void> {
    const confirmed = await this.callFunctionServiceService.confirmWithMessage('Are you sure?', 'Confirmation')
    if (!confirmed || !this.taskForm.valid) {
      return;
    }
    this.messageEvent.emit({ ...this.task })
    this.resetValueForm(true)
  }

  onLoadEditTask(task: Task) {
    if (task.id != '') {
      this.isEditMode = false;
    }
    this.task = { ...task }
  }
}

