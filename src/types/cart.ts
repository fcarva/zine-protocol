export interface CartItem {
  slug: string;
  title: string;
  artistName: string;
  coverImage: string;
  revnetProjectId: number;
  quantity: number;
  amountBRL: number;
}

export interface AddCartItemInput {
  slug: string;
  title: string;
  artistName: string;
  coverImage: string;
  revnetProjectId: number;
  amountBRL?: number;
}
