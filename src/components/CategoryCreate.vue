<template>
    <div class="col s12 m6">
        <div>
            <div class="page-subtitle">
                <h4>{{$translate('recordCreate')}}</h4>
            </div>

            <form @submit.prevent="submitHandler">
                <div class="input-field">
                    <input
                        id="name"
                        type="text"
                        v-model="state.title"
                        :class="{invalid: v$.title.$error}"
                    >
                    <label for="name">{{$translate('recordChooseName')}}</label>
                    <span
                        v-if="v$.title.$error"
                        class="helper-text invalid"
                    >
                        {{$translate('categoryCreateEnterName')}}
                    </span>
                </div>

                <div class="input-field">
                    <input
                        id="limit"
                        type="number"
                        v-model.number="state.limit"
                        :class="{invalid: v$.limit.$error}"
                    >
                    <label for="limit">{{$translate('categoryCreateLimit')}}</label>
                    <span
                        v-if="v$.limit.$error"
                        class="helper-text invalid"
                    >
                        {{$translate('recordChooseMinVal')}} {{v$.limit.min.$params.min}}
                    </span>
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
import { minValue, required } from '@vuelidate/validators'
import useVuelidate from '@vuelidate/core'
import { reactive, computed } from 'vue'

export default {
    name: 'CategoryCreate',
    setup () {
        const state = reactive({
            title: '',
            limit: 1
        })
        const rules = computed(() => {
            return {
                title: { required },
                limit: { required, min: minValue(1) }
            }
        })
        const v$ = useVuelidate(rules, state)
        return {
            state, v$
        }
    },
    methods: {
        async submitHandler () {
            this.v$.$validate()
            if (!this.v$.$error) {
                try {
                    const category = await this.$store.dispatch('createCategory', {
                        title: this.state.title,
                        limit: this.state.limit
                    })
                    this.state.title = ''
                    this.state.limit = 1
                    this.v$.$reset()
                    this.$message(this.$translate('categoryCreateWasCreated'))
                    this.$emit('newCategory', category)
                } catch (e) {}
            }
        }
    },
    mounted () {
        M.updateTextFields()
    }
}
</script>

<style scoped>
.invalid {
    color: rgb(239 68 60);
}
</style>
