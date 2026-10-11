export interface AuditLogEntry {
  id: string;
  actor_id?: string;
  actor_name?: string;
  action: string;
  entity_type: "episode" | "revenue" | "comment" | "member" | "settings";
  entity_id: string;
  diff?: Record<string, any>;
  created_at: string;
  request_id?: string;
}
