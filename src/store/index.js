import { createStore } from 'vuex'
import auth from './auth'
import info from './info'
import category from './category'
import record from './record'
import image from './image'

export default createStore({
    state: {
        error: null
    },
    mutations: {
        setLikes (state) {
            state.likes += 1
        },
        setError (state, error) {
            state.error = error
        },
        clearError (state) {
            state.error = null
        }
    },
    getters: {
        error: state => state.error
    },
    actions: {
        async fetchCurrency () {
            // const key = process.env.VUE_APP_FIXER2
            // const res = await fetch(`http://data.fixer.io/api/latest?access_key=${key}&symbols=USD,EUR,UAH`)
            // const res = await fetch(`http://api.exchangeratesapi.io/v1/latest?access_key=${key}&symbols=USD,EUR,UAH`)
            return await fetch('https://freecurrencyapi.net/api/v2/latest?apikey=7af1fec0-2e65-11ec-b26a-e14bfec9cc92')
                .then((response) => response.json())
                .then((promiseResult) => {
                    return promiseResult
                })
        }
    },
    modules: {
        auth, info, category, record, image
    }
})
