import * as sdk from 'botpress/sdk'

import en from '../translations/en.json'
import fr from '../translations/fr.json'

import api from './api'
import { registerMiddleware, unregisterMiddleware } from './middleware'
import Repository from './repository'

export interface StateType {
  cacheEscalation?: Function
  expireEscalation?: Function
}

const state: StateType = {}

let repository

const onServerStarted = async (bp: typeof sdk) => {
  repository = new Repository(bp)
}

const onServerReady = async (bp: typeof sdk) => {
  await api(bp, repository, state)
  await registerMiddleware(bp, state)
}

const onModuleUnmount = async (bp: typeof sdk) => {
  bp.http.deleteRouterForBot('hitl2')
  unregisterMiddleware(bp)
}

const entryPoint: sdk.ModuleEntryPoint = {
  onServerStarted,
  onServerReady,
  onModuleUnmount,
  translations: { en, fr },
  definition: {
    name: 'hitl2',
    menuIcon: 'chat',
    menuText: 'HITL 2',
    fullName: 'HITL 2',
    homepage: 'https://botpress.com',
    noInterface: false
  }
}

export default entryPoint
