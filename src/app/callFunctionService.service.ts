import { Injectable } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CallFunctionServiceService {

  private functionCallSubject = new Subject<void>();

  constructor(private confirmationService: ConfirmationService, private messageService: MessageService) { }

  callFunction() {
    this.functionCallSubject.next();
  }

  onFunctionCall(): Observable<void> {
    return this.functionCallSubject.asObservable();
  }

  confirmWithMessage(message: string, header: string): Promise<boolean> {
    return new Promise<boolean>((resolve) => {
      this.confirmationService.confirm({
        message,
        header,
        icon: 'pi pi-exclamation-triangle',
        accept: () => {
          this.messageService.add({
            severity: 'info',
            summary: 'Confirmed',
            detail: 'You have accepted',
          })
          resolve(true)
        },
        reject: () => {
          this.messageService.add({
            severity: 'error',
            summary: 'Rejected',
            detail: 'You have rejected',
          })
          resolve(false)
        },
      })
    })
  }

}
