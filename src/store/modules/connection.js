import Web3 from 'web3'
const {toBN} = Web3.utils

import WalletConnectProvider from "@walletconnect/web3-provider";
import Web3Connect from "web3modal";
import MewConnect from "@myetherwallet/mewconnect-web-client";
import Authereum from "authereum";
import UniLogin from "@unilogin/provider";
import BurnerConnectProvider from "@burner-wallet/burner-connect-provider";



// const infuraId = "a6fbe259558b4c8baf936d949d3d310d"
const infuraId = "bd143daef40448f48a722c6ead1b07d7"

const web3Connect = new Web3Connect({
	// network:  "mainnet",
	theme: 'dark',
	cacheProvider: true,
	providerOptions:{
		walletconnect: {
		    package: WalletConnectProvider,
		    options: { infuraId }
	    },
		mewconnect: {
			package: MewConnect,
			options: { infuraId }
		},
		authereum: {
			package: Authereum // required
		},
		unilogin: {
			package: UniLogin // required
		},
		burnerconnect: {
			package: BurnerConnectProvider // required
		}
	}
});


export default {
    namespaced:true,
    state: () => ({
      connectionError: null
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
      reset({commit}){
        web3Connect.clearCachedProvider();
        commit('resetProvider',null,{root:true})
      },
      tryReconnect({dispatch}) {
        if(web3Connect.cachedProvider) return dispatch('toggle')
      },
      async toggle({state, commit, dispatch, rootState}) {
        const {provider} = rootState
        if(provider){
          if(provider.close) await provider.close()
          dispatch('reset')
        } else {
          await web3Connect.connect().then(async provider => {
            const web3 = new Web3(provider)
            const account = new URLSearchParams(window.location.search).get('account')
            await dispatch('setupProvider', {provider, account}, {root:true})
            dispatch('init',null,{root:true})
          }).catch(error => {
            console.error(error)
            this.popUpError = "Something went wrong. Please, try another web3-provider."
            web3Connect.clearCachedProvider()
            dispatch('reset')
          })
        }
      }
    },
}
