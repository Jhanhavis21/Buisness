import axios, { AxiosError } from 'axios';
import { AppError } from '../errors/app-error.js';
import { logger } from '../utils/logger.js';
import type { MondayBoardResponse, MondayConfig, MondayItem } from '../types/monday.js';

export class MondayService {
  constructor(private readonly config: MondayConfig) {}

  public async getStatus(): Promise<{ configured: boolean; boardIds: { deals?: string; workOrders?: string } }> {
    return {
      configured: Boolean(this.config.apiToken && this.config.apiUrl),
      boardIds: {
        deals: this.config.dealBoardId,
        workOrders: this.config.workOrderBoardId
      }
    };
  }

  public async getDeals(): Promise<MondayItem[]> {
    return this.fetchBoardItems(this.config.dealBoardId, 'deals');
  }

  public async getWorkOrders(): Promise<MondayItem[]> {
    return this.fetchBoardItems(this.config.workOrderBoardId, 'work_orders');
  }

  private async fetchBoardItems(boardId: string | undefined, label: string): Promise<MondayItem[]> {
    if (!boardId) {
      throw new AppError(`Missing ${label} board ID`, 400);
    }

    if (!this.config.apiToken) {
      throw new AppError('MONDAY_API_TOKEN is not configured', 500);
    }

    const query = `
      query GetBoardItems($boardId: ID!) {
        boards(ids: [$boardId]) {
          id
          name
          columns {
            id
            title
          }
          items_page(limit: 500) {
            items {
              id
              name
              column_values {
                id
                text
                value
              }
            }
          }
        }
      }
    `;

    try {
      const response = await axios.post(
        this.config.apiUrl,
        { query, variables: { boardId } },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: this.config.apiToken
          },
          validateStatus: () => true
        }
      );

      const payload = response.data as MondayBoardResponse;
      const httpStatus = response.status;

      if (httpStatus >= 400) {
        const details = {
          httpStatus,
          graphqlErrors: payload?.errors ?? [],
          responseBody: payload,
          axiosErrorMessage: 'Request failed with status code ' + httpStatus
        };
        logger.error('Monday HTTP error', details);
        throw new AppError('Monday GraphQL request failed', 502, true, details);
      }

      if (payload.errors?.length) {
        const details = {
          httpStatus,
          graphqlErrors: payload.errors,
          responseBody: payload,
          axiosErrorMessage: 'GraphQL returned errors'
        };
        logger.error('Monday GraphQL error', details);
        throw new AppError('Monday GraphQL request failed', 502, true, details);
      }

      const boards = payload.data?.boards ?? [];
      const firstBoard = boards[0];
      const boardColumns = firstBoard?.columns ?? [];
      const columnTitleById = new Map<string, string>();

      for (const column of boardColumns) {
        if (column.id && column.title) {
          columnTitleById.set(column.id, column.title);
        }
      }

      // Support both `items` and `items_page.items` depending on Monday schema
      const boardItems = firstBoard?.items ?? firstBoard?.items_page?.items ?? [];
      return boardItems.map((item: MondayItem) => ({
        ...item,
        id: item.id ?? 'unknown',
        column_values: (item.column_values ?? []).map((column) => ({
          ...column,
          title: columnTitleById.get(column.id) ?? column.title ?? undefined
        }))
      }));
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }

      const axiosError = error as AxiosError;
      const responseData = axiosError.response?.data as MondayBoardResponse | undefined;
      const details = {
        httpStatus: axiosError.response?.status ?? null,
        graphqlErrors: responseData?.errors ?? [],
        responseBody: responseData ?? null,
        axiosErrorMessage: axiosError.message
      };
      logger.error('Monday request exception', details);
      throw new AppError('Monday GraphQL request failed', 502, true, details);
    }
  }
}
