import { atomWithStorage } from 'jotai/utils'

import { TAppSettings } from '../types'

export const appSettingsAtom = atomWithStorage<TAppSettings>('appSettings', undefined, undefined, {
  getOnInit: true,
})
