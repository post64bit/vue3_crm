import _ from 'lodash'

export default {
    data () {
        return {
            page: +this.$route.query.page || 1,
            pageSize: 5,
            pageCount: 0,
            allItems: [],
            items: []
        }
    },
    methods: {
        updatePath () {
            this.$router.push(`${this.$route.path}?page=${this.page}`)
        },
        updateItems () {
            this.items = this.allItems[this.page - 1] || this.allItems[0]
        },
        setupPagination (allItems) {
            this.allItems = _.chunk(allItems, this.pageSize)
            this.pageCount = this.allItems.length
            this.updateItems()
        },
        changePage (p) {
            this.page = p
            this.updateItems()
            this.updatePath()
        },
        nextPageButton () {
            if (this.page + 1 <= this.pageCount) {
                this.page++
                this.updateItems()
                this.updatePath()
            }
        },
        prevPageButton () {
            if (this.page - 1 >= 1) {
                this.page--
                this.updateItems()
                this.updatePath()
            }
        }
    }
}
