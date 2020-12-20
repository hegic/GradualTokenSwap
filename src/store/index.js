import {createStore} from 'vuex'

import Web3 from 'web3'

import Contracts from 'build/contracts.json'
import notifications from './modules/notifications'
import rSwap from './modules/rSwap'
import connection from './modules/connection'


const infuraId = "41c02c3d86a442f1a31eb89e3196bf3a"
const localProvider = window.ethereum || `wss://mainnet.infura.io/ws/v3/${infuraId}`
const localWeb3 = new Web3(localProvider)

const toBN = Web3.utils.toBN

toBN(0).__proto__.format = function(decimals, precision = 0){
    const num = this.toString() / 10 ** decimals
    return num.toLocaleString(undefined, {
        maximumFractionDigits: precision
    })

}

const buildContracts = (web3, [from]) => Object.fromEntries(
    Object.entries(Contracts)
        .map(([key, {address, abi}]) => [
            key,
            new web3.eth.Contract(abi, address, {from})
        ])
)


const store = createStore({
    modules:{
      notifications, rSwap, connection
    },
    state:{
        accounts:[],
        provider: null,
        web3:localWeb3,
        contracts:{},

    },
    mutations:{
        connect(state, {provider, accounts, web3}){
            window.s = this
            state.provider = provider
            state.web3 = web3
            state.accounts = accounts
            state.contracts = buildContracts(web3, accounts)
        },
        resetProvider(state){
            state.web3.eth.clearSubscriptions()
            state.provider = null
            state.web3 = localWeb3
            state.accounts = []
            state.contracts = buildContracts(localWeb3, [])
        },
    },
    getters:{
        web3: state => state.web3 || localWeb3,
    },
    actions:{
        async setupProvider(ctx, {provider, account}){
            const web3 = new Web3(provider || localProvider)
            const accounts = account ? [account] : await web3.eth.getAccounts()
            ctx.commit('connect', {provider, accounts, web3})
        },
        init({state, dispatch}){
            return Promise.all([
                dispatch('rSwap/init'),
            ])
        },
    }
})
// store.commit('resetProvider')

window.s = store
export default store
