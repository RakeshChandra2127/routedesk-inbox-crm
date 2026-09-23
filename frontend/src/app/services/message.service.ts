import { Injectable, inject } from '@angular/core';
import { ApiService } from './api.service';
import { IMessage } from '../models';

@Injectable({ providedIn: 'root' })
export class MessageService {
  private api = inject(ApiService);
  getMessages(ticketId: string) { return this.api.get<IMessage[]>(`/tickets/${ticketId}/messages`); }
  sendMessage(ticketId: string, content: string) { return this.api.post<IMessage>(`/tickets/${ticketId}/messages`, { content }); }
}
