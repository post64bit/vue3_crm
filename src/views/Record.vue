<template>
    <div class="app-page">
        <div>
            <div class="page-title">
                <h3>{{$translate('recordNewRecord')}}</h3>
            </div>
            <Loader v-if="loading"/>
            <p
                v-else-if="!categories.length"
                class="center"
            >
                {{$translate('recordNoYet')}}
                <router-link to="/categories">{{$translate('recordAdd')}}</router-link>
            </p>
            <form v-else class="form" @submit.prevent="submitHandler">
                <div class="input-field" >
                    <select ref="select" v-model="category">
                        <option
                            v-for="c in categories"
                            :key="c.id"
                            :value="c.id"
                        >{{ c.title }}</option>
                    </select>
                    <label>{{$translate('recordChooseCat')}}</label>
                </div>

                <p>
                    <label>
                        <input
                            class="with-gap"
                            name="type"
                            type="radio"
                            value="income"
                            v-model="type"
                        />
                        <span>{{$translate('recordIncome')}}</span>
                    </label>
                </p>

                <p>
                    <label>
                        <input
                            class="with-gap"
                            name="type"
                            type="radio"
                            value="outcome"
                            v-model="type"
                        />
                        <span>{{$translate('recordOutcome')}}</span>
                    </label>
                </p>

                <div class="input-field">
                    <input
                        id="amount"
                        type="number"
                        v-model.number="amount"
                        :class="{invalid: v$.amount.$error}"
                    >
                    <label for="amount">{{$translate('recordSum')}}</label>
                    <span
                        v-if="v$.amount.$error"
                        class="helper-text invalid">{{$translate('recordEnterSum')}}</span>
                </div>

                <div class="input-field">
                    <input
                        id="description"
                        type="text"
                        v-model="description"
                        :class="{invalid: v$.description.$error}"
                    >
                    <label for="description">{{$translate('recordDescription')}}</label>
                    <span
                        v-if="v$.description.$error"
                        class="helper-text invalid">{{$translate('recordEnterDescription')}}</span>
                </div>

                <button class="btn waves-effect waves-light" type="submit">
                    {{$translate('recordCreate')}}
                    <i class="material-icons right">send</i>
                </button>
            </form>
        </div>
    </div>
</template>

<script>
import Loader from '../components/app/Loader'
import { minValue, required } from '@vuelidate/validators'
import useVuelidate from '@vuelidate/core'
import { mapGetters } from 'vuex'

export default {
    name: 'Record',
    components: { Loader },
    data () {
        return {
            v$: useVuelidate(),
            loading: true,
            categories: [],
            select: null,
            category: null,
            type: 'outcome',
            amount: 1,
            description: ''
        }
    },
    computed: {
        ...mapGetters(['info']),
        canCreateRecord () {
            if (this.type === 'income') return true
            return this.info.bill >= this.amount
        }
    },
    methods: {
        async submitHandler () {
            this.v$.$validate()
            if (!this.v$.$error) {
                if (this.canCreateRecord) {
                    try {
                        await this.$store.dispatch('createRecord', {
                            categoryId: this.category,
                            amount: this.amount,
                            date: new Date().toJSON(),
                            description: this.description,
                            type: this.type
                        })
                        const bill = this.type === 'income'
                            ? this.info.bill + this.amount
                            : this.info.bill - this.amount
                        await this.$store.dispatch('updateInfo', { bill })
                        this.$message('Запись успешно создана')
                        this.v$.$reset()
                        this.amount = 1
                        this.description = ''
                    } catch (e) {}
                } else {
                    this.$message(`Недостаточно средств (${this.amount - this.info.bill})`)
                }
            }
        }
    },
    validations () {
        return {
            amount: { required, min: minValue(1) },
            description: { required }
        }
    },
    async mounted () {
        this.categories = await this.$store.dispatch('fetchCategories')
        this.loading = false
        if (this.categories.length) this.category = this.categories[0].id
        setTimeout(() => {
            this.select = M.FormSelect.init(this.$refs.select)
            M.updateTextFields()
        }, 0)
    },
    unmounted () {
        if (this.select && this.select.destroy) this.select.destroy()
    }
}
</script>

<style scoped>

</style>
