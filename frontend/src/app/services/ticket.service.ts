import { Injectable, inject } from '@angular/core';
import { ApiService } from './api.service';
import { ITicket } from '../models';

@Injectable({ providedIn: 'root' })
export class TicketService {
  private api = inject(ApiService);
  getTickets() { return this.api.get<ITicket[]>('/tickets'); }
  getTicket(id: string) { return this.api.get<ITicket>(`/tickets/${id}`); }
  resolveTicket(id: string) { return this.api.post(`/tickets/${id}/resolve`, {}); }
  escalateTicket(id: string) { return this.api.post(`/tickets/${id}/escalate`, {}); }
  closeTicket(id: string) { return this.api.post(`/tickets/${id}/close`, {}); }
}
