export {}

declare global {
  type Route = {
    name: string
    title: string
    icon: string
  }

  type Module = {
    name: string
    title: string
    icon: string
    description?: string
    routes: Route[]
  }

  type Modules = Module[]

  type FieldTypeConfig = {
    type: string
    props?: Record<string, any>
  }

  type CRUDActions = {
    create?: boolean
    update?: boolean
    delete?: boolean
    detail?: boolean
  }

  type ListConfig = {
    uid?: string
    getAPI?: string
    fields?: string[]
    fieldsAlias?: Record<string, string>
    fieldsProxy?: Record<string, string>
    fieldsType?: Record<string, FieldTypeConfig>
  }

  type ViewConfig = {
    getAPI?: string
    fields?: string[]
    fieldsAlias?: Record<string, string>
    fieldsProxy?: Record<string, string>
    fieldsType?: Record<string, FieldTypeConfig>
    list?: ListConfig
    detail?: ListConfig
  }

  type CRUDCompositeConfig = {
    name: string
    modelAPI?: string
    permission?: string
    title?: string
    actions?: CRUDActions
    fields?: string[]
    fieldsAlias?: Record<string, string>
    fieldsProxy?: Record<string, string>
    fieldsType?: Record<string, FieldTypeConfig>
    view?: ViewConfig
    transaction?: TransactionConfig
  }

  type CRUDPermissions = {
    view: boolean
    lookup: boolean
    detail: boolean
    create: boolean
    update: boolean
    delete: boolean
  }

  type InputFieldConfig = {
    type: string
    props?: Record<string, any>
    colSpan?: number
  }

  type InputConfig = Record<string, InputFieldConfig>

  type TransactionConfig = {
    fields?: string[]
    targetAPI?: string
    fieldsAlias?: Record<string, string>
    inputConfig?: InputConfig
    create?: {
      fields?: string[]
      targetAPI?: string
      fieldsAlias?: Record<string, string>
      inputConfig?: InputConfig
      onSuccess?: () => void
    }
    update?: {
      fields?: string[]
      getAPI?: string
      targetAPI?: string
      fieldsAlias?: Record<string, string>
      inputConfig?: InputConfig
    }
  }
}
