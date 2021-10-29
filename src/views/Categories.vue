<template>
    <div class="app-page">

        <div>
            <div class="page-title">
                <h3>{{ $translate('categoriesTitle') }}</h3>
            </div>
            <section>
                <Loader v-if="loading"/>
                <div v-else class="row">
                    <CategoryCreate
                        @newCategory="addCategory"
                    />
                    <CategoryEdit
                        v-if="categories.length"
                        :categories="categories"
                        :key="categories.length + updateCount"
                        @updated="updateCategories"
                        @deleted="deleted"
                    />
                    <p v-else class="center">{{ $translate('categoriesNote') }}</p>
                </div>
            </section>
        </div>
    </div>
</template>

<script>
import CategoryCreate from '@/components/CategoryCreate'
import CategoryEdit from '@/components/CategoryEdit'
import Loader from '../components/app/Loader'

export default {
    name: 'Categories',
    components: { CategoryEdit, CategoryCreate, Loader },
    data () {
        return {
            categories: [],
            loading: true,
            updateCount: 0
        }
    },
    async mounted () {
        this.categories = await this.$store.dispatch('fetchCategories')
        this.loading = false
    },
    methods: {
        addCategory (category) {
            this.categories.push(category)
        },
        updateCategories (category) {
            const idx = this.categories.findIndex(item => item.id === category.id)
            this.categories[idx].title = category.title
            this.categories[idx].limit = category.limit
            this.updateCount++
        },
        async deleted () {
            this.loading = true
            this.categories = await this.$store.dispatch('fetchCategories')
            this.loading = false
        }
    }
}
</script>

<style scoped>

</style>
