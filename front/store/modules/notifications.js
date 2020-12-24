import Web3 from 'web3'
const {toBN} = Web3.utils
import i18n from '../../i18n.js'

export default {
    namespaced:true,
    state: () => ({
        list: [],
    }),
    mutations:{
        addNotification(state, n){ state.list.push(n) },
        hideNotification({list}, n){ list.splice(list.indexOf(n), 1) },
    },
    actions:{
        showNotification({state, commit}, notification){
            const tmp = state.list
            const ntf = {
                close(){ commit('hideNotification', this) },
                ...notification,
            }
            setTimeout(() => ntf.close(), 15000)
            commit('addNotification', ntf)
            // tmp.push(ntf)
        },
        processContractInteraction({dispatch}, {method, name}){

            dispatch('showNotification', {
                title: i18n.global.t(`notifications.${name}.confirm.title`),
                text: i18n.global.t(`notifications.${name}.confirm.text`),
            })
            return method.send()
                .on('transactionHash', tx => dispatch('showNotification', {
                        title: i18n.global.t(`notifications.${name}.pending.title`),
                        text: i18n.global.t(`notifications.${name}.pending.text`),
                        tx
                    }))
                .on('receipt', receipt => dispatch('showNotification', {
                    title: i18n.global.t(`notifications.${name}.receipt.title`),
                    text: i18n.global.t(`notifications.${name}.receipt.text`),
                    tx: receipt.transactionHash
                }))
        }
    }
}
