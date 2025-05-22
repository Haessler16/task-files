export interface Item {
  id: string
  message: string
  done: boolean
  created_at: Date
}

export interface CheckList {
  slug: string
  title: string
  items: Item[]
  created_at: Date
}

export interface Data {
  lists: CheckList[]
}

export type RootStackParamList = {
  Home: undefined
  ListDetail: { slug: string }
  CreateList: undefined
  EditList: { slug: string }
}
