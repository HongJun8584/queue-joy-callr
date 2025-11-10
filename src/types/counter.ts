export interface Counter {
  name: string;
  prefix: string;
  nowServing: number;
  lastIssued: number;
  active: boolean;
  busy: boolean;
  lastAdvanceAt?: number;
}

export interface CountersData {
  [counterId: string]: Counter;
}

export interface QueueItem {
  queueId: string;
  chatId?: string;
  status: string;
  counterId?: string;
  serverNotifyRequested?: boolean;
  serverNotifyRequestedAt?: number;
  notifiedAt?: number;
}
