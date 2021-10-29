<template>
    <div class="app-page">
        <div>
            <div class="page-title">
                <h3>{{$translate("sidebarBill")}}</h3>

                <button class="btn waves-effect waves-light btn-small" @click="refresh">
                    <i class="material-icons">refresh</i>
                </button>
            </div>
            <loader v-if="loading" />
            <div v-else class="row">
                <HomeBill :currency="currency" :moneyItems="moneyItems"/>
                <HomeCurrency :currency="currency" :moneyItems="moneyItems"/>
            </div>
        </div>
    </div>
</template>

<script>
import HomeBill from '../components/HomeBill'
import HomeCurrency from '../components/HomeCurrency'
import Loader from '../components/app/Loader'
import firebase from 'firebase/compat'

export default {
    name: 'Home',
    data () {
        return {
            loading: true,
            currency: null,
            moneyItems: ['UAH', 'EUR', 'USD', 'RUB']
        }
    },
    components: {
        Loader,
        HomeBill,
        HomeCurrency
    },
    async mounted () {
        this.currency = await this.$store.dispatch('fetchCurrency')
        this.loading = false
        this.currency.data.USD = 1
    },
    methods: {
        async refresh () {
            this.loading = true
            this.currency = await this.$store.dispatch('fetchCurrency')
            this.currency.data.USD = 1
            this.loading = false
        }
    }
}
</script>
