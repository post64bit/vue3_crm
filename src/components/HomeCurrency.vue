<template>
    <div class="col s12 m6 l8">
        <div class="card orange darken-3 ">
            <div class="card-content white-text">
                <div class="card-header">
                    <span class="card-title">{{$translate('homeCurrency')}}</span>
                </div>
                <table>
                    <thead>
                    <tr>
                        <th>{{$translate('homeCurrencyVal')}}</th>
                        <th>{{$translate('homeCurrencyCur')}}</th>
                        <th>{{$translate('homeCurrencyDate')}}</th>
                    </tr>
                    </thead>

                    <tbody>
                    <tr v-for="item in moneyItems"
                        :key="item"
                    >
                        <td>{{ item }}</td>
                        <td>{{currency.data[item].toFixed(3)}}</td>
                        <td>{{ new Intl.DateTimeFormat('ru-RU').format(new Date(currency.query.timestamp * 1000)) }}</td>
                    </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'HomeCurrency',
    props: ['currency', 'moneyItems']
}
</script>

<style scoped>

</style>
