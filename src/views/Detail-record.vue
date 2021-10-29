<template>
    <div class="app-page">
        <div>
            <Loader v-if="loading"/>
            <div v-else-if="record">
                <div class="breadcrumb-wrap">
                    <router-link to="/history" class="breadcrumb">{{$translate('sidebarHistory')}}</router-link>
                    <a @click.prevent class="breadcrumb">
                        {{ record.type === 'income' ? $translate('recordIncome') : $translate('recordOutcome') }}
                    </a>
                </div>
                <div class="row">
                    <div class="col s12 m6">
                        <div class="card" :class="record.type === 'income' ? 'green' : 'red'">
                            <div class="card-content white-text">
                                <p>{{$translate('recordDescription')}}: {{ record.description }}</p>
                                <p>{{$translate('recordSum')}}: {{ record.amount }}</p>
                                <p>{{$translate('detailCategory')}}: {{ record.categoryName }}</p>

                                <small>{{ $dateFormat(record.date) }}</small>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <p v-else class="center">{{$translate('detailNoSuchRecord')}}</p>
        </div>
    </div>
</template>

<script>
import Loader from '../components/app/Loader'
export default {
    name: 'Detail-record',
    components: { Loader },
    data () {
        return {
            loading: true,
            record: null
        }
    },
    async mounted () {
        const id = this.$route.params.id
        const record = await this.$store.dispatch('fetchRecordById', id)
        const category = await this.$store.dispatch('fetchCategoryById', record.categoryId)
        this.loading = false
        this.record = {
            ...record,
            categoryName: category.title
        }
    }
}
</script>

<style scoped>

</style>
