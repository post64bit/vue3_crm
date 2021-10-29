<template>
    <div class="col s12 m6">
        <div>
            <div class="page-subtitle">
                <h4>{{$translate('categoryEditEdit')}}</h4>
            </div>

            <form @submit.prevent="submitHandler">
                <div class="input-field">
                    <select ref="select" v-model="state.current">
                        <option
                            v-for="c in categories"
                            :key="c.id"
                            :value="c.id"
                        >
                            {{ c.title }}
                        </option>
                    </select>
                    <label>{{$translate('recordChooseCat')}}</label>
                </div>

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
                        {{$translate('recordChooseEnterName')}}
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
                    {{$translate('recordChooseUpdate')}}
                    <i class="material-icons right">send</i>
                </button>
                <button data-target="modal1" class="delete_btn btn waves-effect waves-light red modal-trigger">
                    Delete
                    <i class="material-icons right">delete</i>
                </button>
            </form>
        </div>
    </div>
    <!-- Modal Structure -->
    <div id="modal1" class="modal">
        <div class="modal-content">
            <h4>Delete category</h4>
            <p>Are you sure you want to delete this category and all those category's records?
            It cannot be restore!</p>
        </div>
        <div class="modal-footer">
            <a @click="deleteCategory"
               style="margin-right: 30px"
               class="modal-close waves-effect waves-light btn red">
                <i class="material-icons right">delete</i>Delete
            </a>
            <a class="modal-close waves-effect waves-light btn">
                <i class="material-icons right">cancel</i>Cancel
            </a>
        </div>
    </div>
</template>

<script>
import { computed, reactive, watch } from 'vue'
import { minValue, required } from '@vuelidate/validators'
import useVuelidate from '@vuelidate/core'

export default {
    name: 'CategoryEdit',
    props: {
        categories: {
            type: Array,
            required: true
        }
    },
    setup (props) {
        const state = reactive({
            categories: props.categories,
            title: '',
            limit: 1,
            select: null,
            current: null
        })
        watch(() => state.current, (newValue) => {
            const { title, limit } = state.categories.find(item => item.id === newValue)
            state.title = title
            state.limit = limit
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
                    const categoryData = {
                        title: this.state.title,
                        limit: this.state.limit,
                        id: this.state.current
                    }
                    await this.$store.dispatch('updateCategory', categoryData)
                    this.$message(this.$translate('recordChooseUpdatedSuccess'))
                    this.$emit('updated', categoryData)
                } catch (e) {}
            }
        },
        deleteCategory () {
            this.$store.dispatch('deleteCategory', this.state.current)
            this.$store.dispatch('deleteRecordsOfCategory', this.state.current)
            this.$emit('deleted')
            this.$message('Deleted')
        }
    },
    created () {
        const { id, title, limit } = this.state.categories[0]
        this.state.current = id
        this.state.title = title
        this.state.limit = limit
    },
    mounted () {
        this.state.select = M.FormSelect.init(this.$refs.select)
        M.updateTextFields()
        const elems = document.querySelectorAll('.modal')
        const instances = M.Modal.init(elems)
    },
    unmounted () {
        if (this.state.select && this.state.select.destroy) {
            this.state.select.destroy()
        }
    }
}
</script>

<style scoped>
.delete_btn {
    margin-left: 40px;
}
</style>
