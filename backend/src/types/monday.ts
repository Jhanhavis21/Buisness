export interface MondayConfig {
  apiToken: string;
  apiUrl: string;
  dealBoardId?: string;
  workOrderBoardId?: string;
}

export interface MondayItem {
  id: string;
  name?: string;
  column_values?: Array<{
    id: string;
    title?: string;
    text?: string;
    value?: string | null;
  }>;
  [key: string]: unknown;
}

export interface MondayBoardResponse {
  data?: {
    boards?: Array<{
      id: string;
      name?: string;
      columns?: Array<{
        id: string;
        title?: string;
      }>;
      items?: MondayItem[];
      items_page?: {
        items: MondayItem[];
      };
    }>;
  };
  errors?: Array<{ message?: string }>;
}
