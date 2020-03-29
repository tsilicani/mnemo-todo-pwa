import Vue from "vue"
import Vuex from "vuex"

import VuexPersist from 'vuex-persist'

const vuexPersist = new VuexPersist({
    key: 'my-app',
    storage: window.localStorage
})

Vue.use(Vuex);

const state = {
    loggedIn: undefined,
    userInfo: undefined
}

const mutations = {
    SET_LOGGED_IN(state, payload) {
        state.loggedIn = true
        state.userInfo = payload
    },
    SET_LOGGED_OUT(state) {
        state.loggedIn = false
        state.userInfo = null
    }
}

const actions = {
    setLoggedIn(context, userInfo) {
        context.commit('SET_LOGGED_IN', userInfo)
    },
    setLoggedOut(context) {
        context.commit('SET_LOGGED_OUT')
    }
}

const getters = {
    userIsLoggedIn(state) {
        return state.loggedIn
    },
    userEmail(state) {
        if (state.userInfo) {
            return state.userInfo.email
        } else {
            return null
        }
    },
    userEmailIsVerified(state) {
        if (state.userInfo) {
            return state.userInfo.verified
        } else {
            return false
        }
    }
}

export default new Vuex.Store({
    state,
    mutations,
    actions,
    getters,
    plugins: [vuexPersist.plugin]
})