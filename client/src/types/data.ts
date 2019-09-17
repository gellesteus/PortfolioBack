export interface IBeast {
  _id: string;
  name: string;
  shortDesc: string;
  longDesc: string;
  images?: string[] | null;
}

export interface ICharacter {
  _id: string;
  apperance?: string | null;
  bond?: string | null;
  description?: string | null;
  flaws?: string | null;
  goal?: string | null;
  ideal?: string | null;
  known: boolean;
  mannerism?: string | null;
  name: string;
  secret?: string;
}

export interface IItem {
  _id: string;
  created_at: Date;
  images: string[];
  longDesc: string;
  name: string;
  shortDesc: string;
}
export interface ILocation {
  _id: string;
  images: string[];
  longDesc: string;
  name: string;
  shortDesc: string;
}

export interface IOrganization {
  _id: string;
  holding: ILocation[] | undefined;
  longDesc: string;
  members: ICharacter[] | undefined;
  name: string;
  shortDesc: string;
}

export interface IRule {
  _id: string;
  longDesc: string;
  name: string;
  shortDesc: string;
}
