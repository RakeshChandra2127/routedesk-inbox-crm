export interface IAnalyticsDashboard {
  overview: IOverviewMetrics;
  slaMetrics: ISLAMetrics;
  channelBreakdown: IChannelBreakdown[];
  agentPerformance: IAgentPerformance[];
  hourlyVolume: IHourlyVolume[];
}

export interface IOverviewMetrics {
  totalTickets: number;
  openTickets: number;
  resolvedToday: number;
  avgFirstResponseMs: number;
  avgResolutionMs: number;
  medianFirstResponseMs: number;
}

export interface ISLAMetrics {
  firstResponseBreachRate: number;
  resolutionBreachRate: number;
  firstResponseBreachCount: number;
  resolutionBreachCount: number;
  totalTicketsWithSLA: number;
}

export interface IChannelBreakdown {
  channel: string;
  ticketCount: number;
  avgResponseMs: number;
  breachRate: number;
}

export interface IAgentPerformance {
  agentId: string;
  agentName: string;
  ticketsResolved: number;
  avgResponseMs: number;
  slaBreachCount: number;
  activeTickets: number;
  satisfaction?: number;
}

export interface IHourlyVolume {
  hour: number;
  inbound: number;
  outbound: number;
}
