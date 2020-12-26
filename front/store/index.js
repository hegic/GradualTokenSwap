import {createStore} from 'vuex'

import notifications from './modules/notifications'
import gradualTokenSwap from './modules/GradualTokenSwap'
import connection from './modules/connection'

const store = createStore({
    modules:{
      notifications, gradualTokenSwap, connection
    },
    getters:{
        contracts: ({connection}) => connection.contracts,
        account: ({connection}) => connection.accounts[0]
    },
    actions:{
        init({state, dispatch}){
            return Promise.all([
                dispatch('gradualTokenSwap/init'),
            ])
        },
    }
})

store.dispatch('connection/resetCached')

export default store
