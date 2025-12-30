export type ActionType =
  | "CLOSE_SAME_DOMAIN"
  | "CLOSE_SAME_SUBDOMAIN"
  | "CLOSE_SAME_SUBDIRECTORY"
  | "GROUP_BY_DOMAIN";

export interface Message {
  action: ActionType;
}

export interface ActionResponse {
  success: boolean;
  closedCount?: number;
  groupId?: number;
  error?: string;
}

export interface ParsedURL {
  protocol: string;
  hostname: string;
  domain: string;
  subdomain: string;
  pathname: string;
  firstPathSegment: string;
}

export type CloseTabsResult =
  | { success: true; closedCount: number }
  | { success: false; error: string };

export type GroupTabsResult =
  | { success: true; groupId: number }
  | { success: false; error: string };
