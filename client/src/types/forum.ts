import { IUser } from './index';

export interface ITopic {
  _id: string;
  body: IPost;
  category: ICategory;
  created_at: Date;
  poster: IUser;
  posts: IPost[] | undefined;
  title: string;
}

export interface IPost {
  _id: string;
  body: string;
  category: ICategory;
  created_at: Date;
  poster: IUser;
  topic: ITopic;
  updated: boolean;
  updated_at: Date;
}

export interface ICategory {
  _id: string;
  name: string;
  desc: string;
  position: number;
  created_at: Date;
  section: string;
  topics: ITopic[] | undefined;
  moderators: IUser[] | undefined;
  shortDesc: string;
  icon: string;
}
