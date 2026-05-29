export interface AppNotification {
  _id: string;
  title: string;
  message: string;
  channelType: 'b2b' | 'retail';
  poSource: 'sps' | 'costco';
  orderId: string;
  poNumber: string;
  actorName: string;
  actorEmail?: string;
  read: boolean;
  createdAt: string;
}

export interface NotificationsResponse {
  items: AppNotification[];
  unreadCount: number;
  lastUpdated: string;
}
