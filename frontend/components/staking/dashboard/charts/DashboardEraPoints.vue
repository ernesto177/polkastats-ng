<template>
  <ReactiveLineChart
    :chart-data="chartData"
    :options="chart.options"
  />
</template>

<script>
import { gql } from 'graphql-tag'
import { config } from '@/frontend.config.js'
import commonMixin from '@/mixins/commonMixin.js'
import ReactiveLineChart from '@/components/charts/ReactiveLineChart.js'
import { ChartLineOptions } from '@/components/charts/settings/chartline';

export default {
  components: {
    ReactiveLineChart,
  },
  mixins: [commonMixin],
  data() {
    return {
	  chart: new ChartLineOptions('era', this.$t('components.dashboard_era_points.avg_era_points'), 'Secondary'),
      config,
    //   chartOptions: {
    //     responsive: true,
    //     maintainAspectRatio: false,
    //     legend: {
    //       display: true,
    //     },
    //     title: {
    //       display: true,
    //       text: this.$t('components.dashboard_era_points.title'),
    //       fontSize: 18,
    //       fontColor: config.themeVersion === 'dark' ? '#fff' : '#000',
    //       fontStyle: 'lighter',
    //     },
    //     tooltips: {
    //       backgroundColor: '#000000',
    //     },
    //     scales: {
    //       xAxes: [
    //         {
    //           gridLines: {
    //             display: true,
    //             color:
    //               config.themeVersion === 'dark'
    //                 ? 'rgba(255, 255, 255, 0.1)'
    //                 : 'rgba(0, 0, 0, 0.1)',
    //           },
    //           scaleLabel: {
    //             display: true,
    //             labelString: 'era',
    //           },
    //         },
    //       ],
    //       yAxes: [
    //         {
    //           ticks: {
    //             beginAtZero: true,
    //             suggestedMin: 0,
    //             suggestedMax: 1,
    //           },
    //           gridLines: {
    //             display: true,
    //             color:
    //               config.themeVersion === 'dark'
    //                 ? 'rgba(255, 255, 255, 0.1)'
    //                 : 'rgba(0, 0, 0, 0.1)',
    //           },
    //           scaleLabel: {
    //             display: true,
    //             labelString: this.$t(
    //               'components.dashboard_era_points.avg_era_points'
    //             ),
    //           },
    //         },
    //       ],
    //     },
    //   },
      chartData: null,
      rows: [],
      currentEra: 0,
    }
  },
  computed: {
    eras() {
      return this.rows.map((row) => row.era)
    },
    selectedValidatorAddresses() {
      return this.$store.state.ranking.selectedAddresses
    },
    chainValidatorAddresses() {
      return this.$store.state.ranking.chainValidatorAddresses
    },
  },
  apollo: {
    $subscribe: {
      currentEra: {
        query: gql`
          subscription total {
            total(where: { name: { _eq: "current_era" } }, limit: 1) {
              count
            }
          }
        `,
        result({ data }) {
          this.currentEra = data.total[0].count
        },
      },
      era_points_avg: {
        query: gql`
          subscription era_points_avg($minEra: Int!) {
            era_points_avg(
              where: { era: { _gte: $minEra } }
              order_by: { era: asc }
            ) {
              era
              points_avg
            }
          }
        `,
        variables() {
          return {
            minEra: this.currentEra - config.historySize,
          }
        },
        skip() {
          return this.currentEra === 0
        },
        result({ data }) {
          this.rows = data.era_points_avg
        //   this.chartData = {
        //     labels: this.rows.map(({ era }) => era),
        //     datasets: [
        //       {
        //         label: 'network',
        //         data: [...this.rows.map((row) => row.points_avg)],
        //         backgroundColor: 'rgba(255, 255, 255, 0.8)',
        //         borderColor: 'rgba(23, 162, 184, 0.8)',
        //         hoverBackgroundColor: 'rgba(255, 255, 255, 0.8)',
        //         fill: false,
        //         showLine: true,
        //       },
        //     ],
        //   }

		  	this.chart.setData(this.rows.map((row) => row.points_avg));
			this.chart.setLabels(this.rows.map(({ era }) => era));
			this.chartData = this.chart.data;
        },
      },
      chain_relative_performance_avg: {
        query: gql`
          subscription era_points($minEra: Int!, $validators: [String!]) {
            era_points(
              order_by: { era: asc }
              where: {
                stash_address: { _in: $validators }
                era: { _gte: $minEra }
              }
            ) {
              era
              points
            }
          }
        `,
        variables() {
          return {
            minEra: this.currentEra - config.historySize,
            validators: this.chainValidatorAddresses,
          }
        },
        skip() {
          return !this.chartData
        },
        result({ data }) {
          const localChartData = {
            ...this.chartData,
          }
          if (data.era_points.length > 0) {
            const items = this.eras.map((era) => {
              return (
                data.era_points
                  .filter((row) => row.era === era)
                  .map((v) => parseFloat(v.points))
                  .reduce((a, b) => a + b) /
                data.era_points.filter((row) => row.era === era).length
              )
            })
            const dataset = {
              id: 'chain',
              label: 'on-chain validators',
              data: items,
              backgroundColor: 'rgba(255, 255, 255, 0.8)',
              borderColor: 'rgba(184, 162, 23, 0.8)',
              hoverBackgroundColor: 'rgba(255, 255, 255, 0.8)',
              fill: false,
              showLine: true,
            }
            if (localChartData?.datasets) {
              if (localChartData.datasets.find(({ id }) => id === 'chain')) {
                const datasetIndex = localChartData.datasets.findIndex(
                  ({ id }) => id === 'chain'
                )
                localChartData.datasets[datasetIndex] = dataset
              } else {
                localChartData.datasets.push(dataset)
              }
            } else {
              localChartData.datasets.push(dataset)
            }
          } else if (localChartData?.datasets) {
            if (localChartData.datasets.find(({ id }) => id === 'chain')) {
              const datasetIndex = localChartData.datasets.findIndex(
                ({ id }) => id === 'chain'
              )
              localChartData.datasets.splice(datasetIndex, 1)
            }
          }
          this.chartData = localChartData
        },
      },
      selected_relative_performance_avg: {
        query: gql`
          subscription era_points($minEra: Int!, $validators: [String!]) {
            era_points(
              order_by: { era: asc }
              where: {
                stash_address: { _in: $validators }
                era: { _gte: $minEra }
              }
            ) {
              era
              points
            }
          }
        `,
        variables() {
          return {
            minEra: this.currentEra - config.historySize,
            validators: this.selectedValidatorAddresses,
          }
        },
        skip() {
          return !this.chartData
        },
        result({ data }) {
          const localChartData = {
            ...this.chartData,
          }
          if (data.era_points.length > 0) {
            const items = this.eras.map((era) => {
              return (
                data.era_points
                  .filter((row) => row.era === era)
                  .map((v) => parseFloat(v.points))
                  .reduce((a, b) => a + b) /
                data.era_points.filter((row) => row.era === era).length
              )
            })
            const dataset = {
              id: 'selected',
              label: 'selected validators',
              data: items,
            //   backgroundColor: 'rgba(255, 255, 255, 0.8)',
            //   borderColor: 'rgba(184, 23, 102, 0.8)',
            //   hoverBackgroundColor: 'rgba(255, 255, 255, 0.8)',
            //   fill: false,
            //   showLine: true,
			  ...this.chart.getDataSeed('Third')
            }
            if (localChartData?.datasets) {
              if (localChartData.datasets.find(({ id }) => id === 'selected')) {
                const datasetIndex = localChartData.datasets.findIndex(
                  ({ id }) => id === 'selected'
                )
                localChartData.datasets[datasetIndex] = dataset
              } else {
                localChartData.datasets.push(dataset)
              }
            } else {
              localChartData.datasets.push(dataset)
            }
          } else if (localChartData?.datasets) {
            if (localChartData.datasets.find(({ id }) => id === 'selected')) {
              const datasetIndex = localChartData.datasets.findIndex(
                ({ id }) => id === 'selected'
              )
              localChartData.datasets.splice(datasetIndex, 1)
            }
          }
          this.chartData = localChartData
        },
      },
    },
  },
}
</script>
