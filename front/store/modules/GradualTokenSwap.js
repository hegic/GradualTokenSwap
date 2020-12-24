import Web3 from 'web3'
import BN from 'utils/BN'

const approveAmount = "115792089237316195423570985008687907853269984665640564039457584007913129639935"

export default {
    namespaced:true,
    state: () => ({
        available: BN(0),
        swappable: BN(0),
        rHEGIC:BN(0),
        HEGIC:BN(0),
    }),
    mutations:{
      setAvailable(state, amount){state.available = amount},
      setrHEGIC(state, amount){state.rHEGIC = amount},
      setHEGIC(state, amount){state.HEGIC = amount},
    },
    actions:{
      // subscribe({dispatch, rootGetters}){
      //   rootGetters.contracts.rSwap.events.TokensSwapped()
      //     .on('data', () => dispatch('updateBalances'))
      // },
      async updateBalances({commit, rootGetters}){
        const {GradualTokenSwap, rHEGIC, HEGIC} = rootGetters.contracts
        const {account} = rootGetters
        return Promise.all([
          GradualTokenSwap.methods.available(account).call().then(BN).then(x=>commit('setAvailable',x)),
          rHEGIC.methods.balanceOf(account).call().then(BN).then(x=>commit('setrHEGIC', x)),
          HEGIC.methods.balanceOf(account).call().then(BN).then(x=>commit('setHEGIC', x)),
        ])
      },
      async init({dispatch}){
        await dispatch('updateBalances')
        // dispatch('subscribe')
      },
      async provide({dispatch, rootGetters}, amount) {
        const {GradualTokenSwap, rHEGIC} = rootGetters.contracts
        const {account} = rootGetters
        const allowance = await rHEGIC.methods.allowance(account, GradualTokenSwap._address).call().then(BN)
        if(allowance.lt(amount)) await dispatch('notifications/processContractInteraction', {
          name: 'approve',
          method: rHEGIC.methods.approve(GradualTokenSwap._address, approveAmount)
        }, {root: true})

        await dispatch('notifications/processContractInteraction', {
          name: 'provide',
          method: GradualTokenSwap.methods.provide(amount)
        }, {root: true})
        await dispatch('updateBalances')
      },
      async withdraw({dispatch, rootGetters:{account, contracts}}, amount) {
        const {GradualTokenSwap, rHEGIC} = contracts
        await dispatch('notifications/processContractInteraction', {
          name: 'withdraw',
          method: GradualTokenSwap.methods.withdraw()
        }, {root: true})
        await dispatch('updateBalances')
      },
    }
}
