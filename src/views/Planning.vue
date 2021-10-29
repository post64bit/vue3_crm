<template>
    <div class="app-page">
        <div>
            <div class="page-title">
                <h3>{{$translate('planningTitle')}}</h3>
                <h4>
                    {{ currencyFormat(info.bill) }}
                </h4>
            </div>
            <Loader v-if="loading" />
            <p
                v-else-if="!categories.length"
                class="center"
            >
                Категорий пока нет
                <router-link to="/categories">{{$translate('planningAddCat')}}</router-link>
            </p>
            <section v-else>
                <div
                    v-tooltip="cat.tooltip"
                    v-for="cat in categories"
                    :key="cat.id"
                >
                    <p>
                        <strong>{{ cat.title }}:</strong>
                        {{ `${currencyFormat(cat.spend)} ${$translate('planningFrom')} ${currencyFormat(cat.limit)}` }}
                    </p>
                    <div class="progress">
                        <div
                            class="determinate"
                            :class="cat.progressColor"
                            :style="{width: cat.progressPercent + '%'}"
                        ></div>
                    </div>
                </div>
            </section>
        </div>

    </div>

</template>

<script>
import Loader from '../components/app/Loader'
import { mapGetters } from 'vuex'

export default {
    name: 'Planning',
    components: { Loader },
    data () {
        return {
            loading: true,
            categories: []
        }
    },
    computed: {
        ...mapGetters(['info'])
    },
    async mounted () {
        const records = await this.$store.dispatch('fetchRecords')
        const categories = await this.$store.dispatch('fetchCategories')
        this.categories = categories.map(category => {
            const spend = records
                .filter(record => record.categoryId === category.id)
                .filter(record => record.type === 'outcome')
                .reduce((total, record) => {
                    return total + +record.amount
                }, 0)
            const percent = 100 * spend / category.limit
            const progressPercent = percent > 100 ? 100 : percent
            const progressColor = percent < 60
                ? 'green'
                : percent < 100
                    ? 'yellow' : 'red'
            const tooltipValue = category.limit - spend
            const tooltip = `${tooltipValue < 0 ? this.$translate('planningExcessOn')
                : this.$translate('planningLeft')}
            ${this.currencyFormat(Math.abs(tooltipValue))}`
            return {
                ...category,
                progressPercent,
                progressColor,
                spend,
                tooltip
            }
        })
        this.loading = false
    },
    methods: {
        currencyFormat (integer) {
            return new Intl.NumberFormat(this.$store.getters.info.locale, {
                style: 'currency',
                currency: 'UAH'
            }).format(integer)
        }
    }
}
</script>

<style scoped>

</style>
