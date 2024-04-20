import { Component, EventEmitter, Output, ViewChild, viewChild } from '@angular/core'
import { PickListMoveToSourceEvent, PickListMoveToTargetEvent } from 'primeng/picklist'
import { ConfirmationService, MessageService } from 'primeng/api'
import { Task } from '../../model/task';
import { TASKLIST } from '../../model/data';
import { CallFunctionServiceService } from '../callFunctionService.service';

@Component({
  selector: 'app-TaskList',
  templateUrl: './taskList.component.html',
  styleUrls: ['./taskList.component.css'],
})
export class TaskListComponent {
  @Output() messageEvent = new EventEmitter<Task>()

  tasks: Task[] = [];
  targetTask: Task[] = [];
  displayBasic: boolean = false;
  taskHover: Task = new Task();
  currentDate = new Date();

  constructor(private messageService: MessageService, private callFunctionServiceService: CallFunctionServiceService) {
    setInterval(() => {
      this.currentDate = new Date();
    }, 1000);

    TASKLIST.forEach(element => {
      if (element.status == false) this.tasks.push(element);
      else this.targetTask.push(element);
    });
  }

  callParentFunction() {
    this.callFunctionServiceService.callFunction();
  }

  async deleteTask(task: Task): Promise<void> {
    const confirmed = await this.callFunctionServiceService.confirmWithMessage('Are you sure?', 'Confirmation')
    if (!confirmed) {
      return;
    }
    const findTaskIndex = this.tasks.findIndex((item) => item.taskName === task.taskName)
    if (findTaskIndex !== -1) {
      this.tasks.splice(findTaskIndex, 1)
      this.tasks = this.tasks.slice();
      this.callParentFunction();
      this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Delete Item Successfully' })
    } else {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Item not found' })
    }
  }

  onMoveToSource(event: PickListMoveToSourceEvent): void {
    const itemMoveToSource = event.items[0]
    if (itemMoveToSource) {
      const findTaskIndex = this.tasks.findIndex((item) => item.id === itemMoveToSource.id)
      if (findTaskIndex !== -1) {
        itemMoveToSource.status = false;
        itemMoveToSource.actualDate = new Date();
        this.tasks[findTaskIndex] = itemMoveToSource
      }
    }
  }

  async onMoveToTarget($event: PickListMoveToTargetEvent): Promise<void> {
    const itemMoveToTarget = $event.items.shift()
    if (itemMoveToTarget) {
      const existingTaskIndex = this.targetTask.findIndex((item) => item.id === itemMoveToTarget.id)
      if (existingTaskIndex !== -1) {
        itemMoveToTarget.status = true;
        itemMoveToTarget.actualDate = new Date();
        this.targetTask[existingTaskIndex] = itemMoveToTarget
      }
    }
  }

  addItemSource(event: Task): void {
    const findTaskIndex = this.tasks.findIndex((item) => item.id === event.id)
    if (findTaskIndex !== -1) {
      this.tasks[findTaskIndex] = event;
    } else {
      this.tasks.push(event);
    }
    this.tasks = this.tasks.slice();
  }

  async editTask(task: Task): Promise<void> {
    const confirmed = await this.callFunctionServiceService.confirmWithMessage('Are you sure?', 'Confirmation')
    if (!confirmed) {
      return;
    }
    this.messageEvent.emit({ ...task });
  }

  async doneTask(task: Task): Promise<void> {
    const confirmed = await this.callFunctionServiceService.confirmWithMessage('Are you sure?', 'Confirmation')
    if (!confirmed) {
      return;
    }
    if (task) {
      const findTaskIndex = this.tasks.findIndex((item) => item.id === task.id)
      if (findTaskIndex !== -1) {
        task.status = true
        task.actualDate = new Date()
        this.tasks.splice(findTaskIndex, 1)
        this.targetTask = [...this.targetTask, task]
        this.callParentFunction();
      }
    }
  }

  showModelPreview(task: Task): void {
    if (task.status != true) {
      this.taskHover = task;
      this.displayBasic = true;
    }
  }

  hideModelPreview(): void {
    this.displayBasic = false;
    this.taskHover = new Task();
  }

  getDeviation(task: Task): number {
    return Math.floor((task.actualDate.getTime() - task.dueDate.getTime()) / (1000 * 60 * 60));
  }

  getTotalDeviation(): number {
    return this.targetTask.reduce((total, element) => total + this.getDeviation(element), 0);
  }
}
