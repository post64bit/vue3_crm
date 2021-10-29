<template>
    <div class="app-page">

        <div>
            <div class="page-title">
                <h3>{{$translate('historyOfRecords')}}</h3>
            </div>

            <div class="history-chart">
                <Chart
                    v-if="!loading"
                    :categories="categories"
                    :records="records"
                    :sums="sums"
                />
            </div>
            <div :key="key" class="selects">
                <div class="input-field col s12 m6">
                    <select v-model="selectByCategory">
                        <option :value="null" disabled selected>Category</option>
                        <option
                            v-for="c in categories"
                            :key="c.id"
                            :value="c.id"
                        >{{ c.title }}</option>
                    </select>
                </div>
                <div class="input-field col s12 m6">
                    <select v-model="selectByType">
                        <option :value="null" disabled selected>Income/Outcome</option>
                        <option value="income">Income</option>
                        <option value="outcome">Outcome</option>
                    </select>
                </div>
                <button @click="resetSelectors"
                        :class="{disabled: selectByType === null && selectByCategory === null && resetFilters === null}"
                        class="btn waves-effect waves-light" name="action">Reset
                    <i class="material-icons right">autorenew</i>
                </button>
            </div>
            <Loader v-if="loading"/>
            <p
                v-else-if="!records.length" class="center"
            >
                {{$translate('historyRecordsNotYet')}}
                <router-link to="/record">{{$translate('historyAddFirst')}}</router-link>
            </p>
            <section v-else>
                <HistoryTable
                    :records="items"
                    :resetFilters="resetFilters"
                    @deleteRecord="updateRecords"
                    @sortBySum="sortBySum"
                    @sortByDate="sortByDate"
                />
                <ul class="pagination">
                    <li class="disabled" @click="prevPageButton">
                        <a href="#!">
                            <i class="material-icons">chevron_left</i>
                        </a>
                    </li>
                    <li
                        v-for="p in pageCount"
                        :key="p"
                        @click="changePage(p)"
                        :class="{active: page === p}"
                        class="waves-effect"
                    ><a href="#!">{{ p }}</a>
                    </li>
                    <li class="waves-effect" @click="nextPageButton">
                        <a href="#!">
                            <i class="material-icons">chevron_right</i>
                        </a>
                    </li>
                </ul>
            </section>

        </div>

    </div>

</template>

<script>
import HistoryTable from '../components/HistoryTable'
import Loader from '../components/app/Loader'
import paginationMixin from '../mixins/pagination.mixin'
import Chart from '../components/Chart'
import _ from 'lodash'

export default {
    name: 'History',
    components: { Loader, HistoryTable, Chart },
    mixins: [paginationMixin],
    data () {
        return {
            loading: true,
            records: [],
            categories: [],
            sums: [],
            selectByType: null,
            selectByCategory: null,
            instances: null,
            key: 0,
            resetFilters: null
        }
    },
    async mounted () {
        this.records = await this.$store.dispatch('fetchRecords')
        this.categories = await this.$store.dispatch('fetchCategories')
        this.setup()
        this.sums = this.categories.map(cat => {
            return this.records.reduce((total, rec) => {
                if (cat.id === rec.categoryId && rec.type === 'outcome') {
                    total += +rec.amount
                }
                return total
            }, 0)
        })
        this.loading = false
        setTimeout(() => {
            const elems = document.querySelectorAll('select')
            this.instances = M.FormSelect.init(elems)
        })
    },
    methods: {
        setup () {
            this.setupPagination(this.records.map(record => {
                return {
                    ...record,
                    categoryName: this.categories.find(c => c.id === record.categoryId).title,
                    typeClass: record.type === 'income' ? 'green' : 'red',
                    typeText: record.type === 'income' ? 'Доход' : 'Расход'
                }
            }).reverse())
        },
        async updateRecords () {
            this.records = await this.$store.dispatch('fetchRecords')
            this.setup()
        },
        async resetSelectors () {
            this.selectByType = null
            this.selectByCategory = null
            this.resetFilters = null
            this.key++
            setTimeout(() => {
                const elems = document.querySelectorAll('select')
                this.instances = M.FormSelect.init(elems)
            })
            this.records = await this.$store.dispatch('fetchRecords')
            this.setup()
        },
        async generalSelect () {
            this.records = await this.$store.dispatch('fetchRecords')
            if (this.selectByType && this.selectByCategory) {
                this.records = this.records.filter(record => {
                    return record.type === this.selectByType && record.categoryId === this.selectByCategory
                })
            } else if (this.selectByType) {
                this.records = this.records.filter(record => {
                    return record.type === this.selectByType
                })
            } else if (this.selectByCategory) {
                this.records = this.records.filter(record => {
                    return record.categoryId === this.selectByCategory
                })
            }
            this.setup()
        },
        sortBySum (modelSortBySum) {
            if (modelSortBySum) {
                this.records = this.records.sort((rec1, rec2) => {
                    return rec1.amount - rec2.amount
                })
            } else {
                this.records = this.records.sort((rec1, rec2) => {
                    return rec1.amount - rec2.amount
                }).reverse()
            }
            this.setup()
            this.resetFilters = true
        },
        sortByDate (modelSortByDate) {
            if (modelSortByDate) {
                this.records = this.records.sort((rec1, rec2) => {
                    return new Date(rec1.date).getTime() - new Date(rec2.date).getTime()
                }).reverse()
            } else {
                this.records = this.records.sort((rec1, rec2) => {
                    return new Date(rec1.date).getTime() - new Date(rec2.date).getTime()
                })
            }
            this.setup()
            this.resetFilters = true
        }
    },
    watch: {
        async selectByType () {
            await this.generalSelect()
        },
        async selectByCategory () {
            await this.generalSelect()
        }
    }
}
</script>

<style scoped>
.selects {
    display: flex;
}
.selects div {
    margin-right: 30px;
}
.btn {
    margin: auto auto auto 30px;
}
</style>
