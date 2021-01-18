import Web3 from 'web3'
import {toBN} from 'utils/BN'

import WalletConnectProvider from "@walletconnect/web3-provider";
import Web3Connect from "web3modal";
import MewConnect from "@myetherwallet/mewconnect-web-client";
import Authereum from "authereum";
import UniLogin from "@unilogin/provider";
import BurnerConnectProvider from "@burner-wallet/burner-connect-provider";

import Contracts from 'contracts'

// const infuraId = "a6fbe259558b4c8baf936d949d3d310d"
const infuraIds = [
	"bd143daef40448f48a722c6ead1b07d7",
	"a6fbe259558b4c8baf936d949d3d310d",
]

const infuraId = "41c02c3d86a442f1a31eb89e3196bf3a"
const localProvider = window.ethereum || `wss://mainnet.infura.io/ws/v3/${infuraId}`
const localWeb3 = new Web3(localProvider)


const buildContracts = (web3, [from]) => Object.fromEntries(
    Object.entries(Contracts)
        .map(([key, {address, abi}]) => [
            key,
            new web3.eth.Contract(abi, address, {from})
        ])
)


const web3Connect = new Web3Connect({
	theme: 'dark',
	cacheProvider: true,
	providerOptions:{
		walletconnect: { package: WalletConnectProvider, options: { infuraId } },
		mewconnect: { package: MewConnect, options: { infuraId } },
		authereum: { package: Authereum },
		unilogin: { package: UniLogin },
		burnerconnect: { package: BurnerConnectProvider }
	}
});


export default {
    namespaced:true,
    state: () => ({
			provider: null,
			accounts:[],
			web3: localWeb3,
    }),
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
    actions:{
			async setupProvider(ctx, {provider, account}){
					const web3 = new Web3(provider || localProvider)
					const accounts = account ? [account] : await web3.eth.getAccounts()
					ctx.commit('connect', {provider, accounts, web3})
			},
      reset({commit}){
        web3Connect.clearCachedProvider();
        commit('resetProvider')
      },
      resetCached({dispatch}) {
        if(web3Connect.cachedProvider) return dispatch('toggle')
      },
      async toggle({state:{provider}, commit, dispatch}) {
        if(provider){
          if(provider.close) await provider.close()
          dispatch('reset')
        } else {
          return await web3Connect.connect()
						.then(async provider => {
	            const web3 = new Web3(provider)
	            const account = new URLSearchParams(window.location.search).get('account')
	            await dispatch('setupProvider', {provider, account})
	            return dispatch('init',null,{root:true})
          	})
						.catch(error => {
	            console.error(error)
	            web3Connect.clearCachedProvider()
	            dispatch('reset')
							throw error;
	          })
        }
      }
    },
}
