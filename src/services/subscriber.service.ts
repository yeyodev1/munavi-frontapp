import APIBase from './httpBase'
import type { Subscriber } from '@/types'

export interface SubscribeResponse {
  message: string
  couponCode: string
  percent: number
}

class SubscriberService extends APIBase {
  async subscribe(email: string, source: Subscriber['source']): Promise<SubscribeResponse> {
    const { data } = await this.post<SubscribeResponse>('subscribers', { email, source })
    return data
  }
}

export const subscriberService = new SubscriberService()
