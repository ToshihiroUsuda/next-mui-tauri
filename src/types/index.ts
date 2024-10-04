export type TAppSettings = {
  name: string
  age: number
  folder?: string
  jsonFile?: string
  date?: string
  tags: TTag[]
}

export type TTag = {
  name: string
  color: string
}
