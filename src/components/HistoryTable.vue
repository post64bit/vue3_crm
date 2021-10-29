<template>
    <table>
        <thead>
        <tr>
            <th>#</th>
            <th>{{$translate('recordSum')}}
                <div @change="sortBySum" class="switch">
                    <label>
                        Cheap
                        <input type="checkbox" v-model="modelSortBySum">
                        <span class="lever"></span>
                        Expansive
                    </label>
                </div>
            </th>
            <th>{{$translate('homeCurrencyDate')}}
                <div @change="sortByDate" class="switch">
                    <label>
                        New
                        <input type="checkbox" v-model="modelSortByDate">
                        <span class="lever"></span>
                        Old
                    </label>
                </div>
            </th>
            <th>{{$translate('detailCategory')}}</th>
            <th>{{$translate('historyTableType')}}</th>
            <th>{{$translate('historyTableOpen')}}</th>
            <th>Delete</th>
        </tr>
        </thead>

        <tbody>
        <tr
            class="trans"
            v-for="(record, index) in records"
            :key="record.id"
        >
            <td>{{ index + 1 }}</td>
            <td>{{ currencyFormat(record.amount) }}</td>
            <td>{{ $dateFormat(record.date) }}</td>
            <td>{{ record.categoryName }}</td>
            <td>
                <span class="white-text badge" :class="record.typeClass">
                    {{record.typeText === 'Доход' ? this.$translate('recordIncome')
                    : this.$translate('recordOutcome')}}
                </span>
            </td>
            <td>
                <button
                    class="btn-small btn"
                    @click="$router.push('/detail-record/' + record.id)"
                    v-tooltip="this.$translate('historyTableLookUp')"
                ><i class="material-icons">open_in_new</i>
                </button>
            </td>
            <td>
                <button
                    @click="initModal(record)"
                    v-tooltip="'Delete'"
                    data-target="modal1"
                    class="btn-small btn red modal-trigger"
                ><i class="material-icons center">delete</i>
                </button>
            </td>
            <!-- Modal Structure  !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!   -->
            <div id="modal1" class="modal">
                <div class="modal-content">
                    <h4>Delete</h4>
                    <p>Are you sure you want to delete this record?
                    You will cannot to restore it</p>
                </div>
                <div class="modal-footer">
                    <button @click="deleteRecord"
                            :style="{marginRight: '30px'}"
                            class="red btn modal-close waves-effect waves-light">Yes
                        <i class="material-icons left">delete</i>
                    </button>
                    <button
                        class="btn modal-close waves-effect waves-light">No
                        <i class="material-icons left">cancel</i>
                    </button>
                </div>
            </div>
        </tr>
        </tbody>
    </table>
</template>

<script>

export default {
    name: 'HistoryTable',
    props: {
        records: {
            required: true,
            type: Array
        },
        resetFilters: {
            required: true
        }
    },
    data () {
        return {
            instance: null,
            recordToDelById: null,
            modelSortBySum: null,
            modelSortByDate: null
        }
    },
    methods: {
        currencyFormat (integer) {
            return new Intl.NumberFormat(this.$store.getters.info.locale || 'ru-RU', {
                style: 'currency',
                currency: 'UAH'
            }).format(integer)
        },
        async deleteRecord () {
            await this.$store.dispatch('deleteRecordById', this.recordToDelById)
            this.$emit('deleteRecord')
        },
        async initModal (record) {
            const elems = document.querySelectorAll('.modal')
            this.instances = M.Modal.init(elems)
            this.recordToDelById = record.id
        },
        sortBySum () {
            this.$emit('sortBySum', this.modelSortBySum)
        },
        sortByDate () {
            this.$emit('sortByDate', this.modelSortByDate)
        }
    },
    watch: {
        resetFilters () {
            if (this.resetFilters === null) {
                this.modelSortByDate = null
                this.modelSortBySum = null
            }
        }
    }
}
</script>

<style scoped>
.trans {
    transition: .5s;
}
.trans:hover {
    background-color: rgb(253, 166, 57);
}
</style>
