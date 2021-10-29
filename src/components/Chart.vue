<template>
    <div style="height:400px;width: 400px;">
        <vue3-chart-js
            :id="myChart.id"
            :type="myChart.type"
            :data="myChart.data"
            :options="myChart.options"
        ></vue3-chart-js>
    </div>
</template>

<script>
import Vue3ChartJs from '@j-t-mcc/vue3-chartjs'

export default {
    name: 'Chart',
    components: { Vue3ChartJs },
    props: {
        categories: {
            required: true
        },
        records: {
            required: true
        },
        sums: {
            required: true
        }
    },
    setup (props) {
        const myChart = {
            id: 'doughnut',
            type: 'pie',
            options: {
                plugins: {
                    legend: {
                        position: 'right'
                    }
                }
            },
            data: {
                labels: props.categories.map(c => c.title),
                datasets: [
                    {
                        backgroundColor: [
                            'rgba(255, 99, 132, 0.2)',
                            'rgba(54, 162, 235, 0.2)',
                            'rgba(255, 206, 86, 0.2)',
                            'rgba(75, 192, 192, 0.2)',
                            'rgba(153, 102, 255, 0.2)',
                            'rgba(255, 159, 64, 0.2)'
                        ],
                        borderColor: [
                            'rgba(255, 99, 132, 1)',
                            'rgba(54, 162, 235, 1)',
                            'rgba(255, 206, 86, 1)',
                            'rgba(75, 192, 192, 1)',
                            'rgba(153, 102, 255, 1)',
                            'rgba(255, 159, 64, 1)'
                        ],
                        data: props.sums
                    }
                ]
            }
        }
        return {
            myChart
        }
    }
}
</script>
