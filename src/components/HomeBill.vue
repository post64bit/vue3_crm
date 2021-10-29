<template>
    <div class="col s12 m6 l4">
        <div class="card light-blue">
            <div class="card-content white-text">
                <span class="card-title">{{ this.$translate('homeBillBillInVal') }}</span>

                <p class="currency-line"
                   v-for="cur in moneyItems"
                   :key="cur"
                >
                    <span>
                        {{getCurrency(cur)}}
                    </span>
                </p>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'HomeBill',
    props: ['currency', 'moneyItems'],
    computed: {
        dollars () {
            return this.$store.getters.info.bill / this.currency.data.UAH
        }
    },
    methods: {
        getCurrency (cur) {
            return new Intl.NumberFormat(this.$store.getters.info.locale || 'ru-RU', {
                style: 'currency',
                currency: cur
            }).format(Math.floor(this.dollars * this.currency.data[cur]))
        }
    }
}
</script>

<style scoped>

</style>
