import { Dayjs } from 'dayjs';

import { Delivery, GiftCard } from './blinksky';

export interface EventStep {
  id: string;
  platform?: string;
  format: StepFormat;
  title: string;
  description: string;
  link: string;
}

export interface EventPrize {
  type: string;
  // title: string; // TODO: delete these
  value: number;
  count: number;
  id: string;
  card: GiftCard;
}

export interface EventWinner {
  name: string;
  phone?: string;
  email: string;
  prizeId: string;
  title: string;
  value: number;
  status: EventWinnerStatus;
  card: GiftCard;
  winnerId: string;
  delivery?: Delivery;
}
export enum EventWinnerStatus {
  Selected = 'Selected',
  Delivered = 'Delivered',
}

export interface RaffleEvent {
  id: string;
  name: string;
  description: string;
  starts_at: number;
  finishes_at: number;
  announced_at: number;
  organiser: any;
  organiser_id: string;
  steps: EventStep[];
  participants?: Record<string, EventParticipant>;
  prizes: EventPrize[];
  winners?: Record<string, EventWinner>;
}

export interface EventParticipantStep extends EventStep {
  checked: boolean;
  data: Record<string, string>;
}

export interface EventParticipant {
  created_at: Date;
  name: string;
  phone: string;
  email: string;
  steps: EventParticipantStep[]; // TODO: clarify
  status: ParticipantStatus;
  id: string;
  accounts: {
    instagram?: string;
    twitter?: string;
    facebook?: string;
  };
}

export enum EventStatus {
  Future = 'Future',
  Open = 'Open',
  Closed = 'Closed',
  Announced = 'Announced',
}

export interface TransformedEvent extends RaffleEvent {
  status: EventStatus;
  startsAt: Dayjs;
  finishesAt: Dayjs;
  announcedAt: Dayjs;
}

export enum StepFormat {
  INSTAGRAM_SHARE_POST_IN_STORY = 'INSTAGRAM_SHARE_POST_IN_STORY',
  INSTAGRAM_SHARE_POST_IN_POST = 'INSTAGRAM_SHARE_POST_IN_POST',
  INSTAGRAM_LIKE_POST = 'INSTAGRAM_LIKE_POST',
  INSTAGRAM_COMMENT_POST = 'INSTAGRAM_COMMENT_POST',
  INSTAGRAM_REACT_TO_STORY = 'INSTAGRAM_REACT_TO_STORY',
  INSTAGRAM_FOLLOW = 'INSTAGRAM_FOLLOW',
  TWITTER_FOLLOW = 'TWITTER_FOLLOW',
  TWITTER_LIKE_POST = 'TWITTER_LIKE_POST',
  TWITTER_COMMENT_POST = 'TWITTER_COMMENT_POST',
  TWITTER_SHARE_RETWEET = 'TWITTER_SHARE_RETWEET',
  FACEBOOK_LIKE_PAGE = 'FACEBOOK_LIKE_PAGE',
  FACEBOOK_LIKE_POST = 'FACEBOOK_LIKE_POST',
  FACEBOOK_COMMENT_POST = 'FACEBOOK_COMMENT_POST',
  FACEBOOK_SHARE_POST = 'FACEBOOK_SHARE_POST',
  FACEBOOK_SHARE_PAGE = 'FACEBOOK_SHARE_PAGE',
  EMAIL_SIGN_UP = 'EMAIL_SIGN_UP',
}

export enum ParticipantStatus {
  Unverified = 'Unverified',
  Verified = 'Verified',
  Disqualified = 'Disqualified',
}
