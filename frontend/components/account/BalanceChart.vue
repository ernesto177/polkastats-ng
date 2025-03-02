<template>
	<section class="section section-chart text-center" color="i-third-2">
		<div v-if="loading" class="text-center py-4">
			<Loading />
		</div>
		<template v-else>
			<header class="header-block my-3" varisant="i-primary" size="sm">
				<!-- TODO: Translate -->
				<h1>Balance</h1>
				<h2>{{ $t('components.balance_chart.title') }}</h2>
			</header>

			<ReactiveLineChart
				:chart-data="chartData"
				:options="chart.options"
			/>
		</template>
	</section>
  <!-- <div v-else>
    <ReactiveLineChart
      :chart-data="chartData"
      :options="chartOptions"
      :height="100"
      class="mb-4"
    />
  </div> -->
</template>
<script>
import { ApiPromise, WsProvider } from '@polkadot/api'
import { BigNumber } from 'bignumber.js'
import Loading from '@/components/Loading.vue'
import ReactiveLineChart from '@/components/charts/ReactiveLineChart.js'
import { config } from '@/frontend.config.js'
import { ChartLineOptions } from '@/components/charts/settings/chartline';

export default {
  components: {
    Loading,
    ReactiveLineChart,
  },
  props: {
    accountId: {
      type: String,
      default: () => '',
    },
  },
  data() {
    return {
	  chart: new ChartLineOptions(this.$t('components.balance_chart.block'), 'balance', 'Secondary'),
    //   chartOptions: {
    //     responsive: true,
    //     legend: {
    //       display: false,
    //     },
    //     title: {
    //       display: true,
    //       text: this.$t('components.balance_chart.title'),
    //       fontSize: 18,
    //       fontColor: '#000',
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
    //             color: 'rgba(200, 200, 200, 0.4)',
    //           },
    //           scaleLabel: {
    //             display: true,
    //             labelString: this.$t('components.balance_chart.block'),
    //           },
    //         },
    //       ],
    //       yAxes: [
    //         {
    //           ticks: {
    //             beginAtZero: true,
    //             suggestedMin: 0,
    //             // suggestedMax: 100,
    //           },
    //           gridLines: {
    //             display: true,
    //             color: 'rgba(200, 200, 200, 0.4)',
    //           },
    //           scaleLabel: {
    //             display: true,
    //             labelString: 'balance',
    //           },
    //         },
    //       ],
    //     },
    //   },
      loading: true,
      balances: [],
      points: 7, // 1 point per day
      historySize: 10 * 60 * 24 * 7, // 7 days
    }
  },
  computed: {
    chartData() {
		this.chart.setData(this.balances.map(({ total }) => total));
		this.chart.setLabels(this.balances.map(({ block }) => block));

		return this.chart.data;
    //   return {
    //     labels: this.balances.map(({ block }) => block),
    //     datasets: [
    //       {
    //         labels: 'total',
    //         data: this.balances.map(({ total }) => total),
    //         backgroundColor: 'rgba(255, 255, 255, 0.8)',
    //         borderColor: 'rgba(230, 0, 122, 0.8)',
    //         hoverBackgroundColor: 'rgba(255, 255, 255, 0.8)',
    //         fill: false,
    //         showLine: true,
    //       },
    //       // {
    //       //   labels: 'free',
    //       //   data: this.balances.map(({ free }) => free),
    //       //   backgroundColor: 'rgba(255, 255, 255, 0.8)',
    //       //   borderColor: 'rgba(230, 0, 122, 0.8)',
    //       //   hoverBackgroundColor: 'rgba(255, 255, 255, 0.8)',
    //       //   fill: false,
    //       //   showLine: true,
    //       // },
    //       // {
    //       //   labels: 'reserved',
    //       //   data: this.balances.map(({ reserved }) => reserved),
    //       //   backgroundColor: 'rgba(255, 255, 255, 0.8)',
    //       //   borderColor: 'rgba(230, 0, 122, 0.8)',
    //       //   hoverBackgroundColor: 'rgba(255, 255, 255, 0.8)',
    //       //   fill: false,
    //       //   showLine: true,
    //       // },
    //     ],
    //   }
    },
  },
  async created() {
    const wsProvider = new WsProvider(config.nodeWs)
    const api = await ApiPromise.create({ provider: wsProvider })
    await api.isReady
    // get latest block
    const lastSignedBlock = await api.rpc.chain.getBlock()
    const endBlock = lastSignedBlock.block.header.number
    const startBlock = endBlock - this.historySize
    this.balances = await this.getBalanceInRange(
      api,
      this.accountId,
      startBlock,
      endBlock
    )
    this.loading = false
  },
  methods: {
    async getBalanceInRange(api, address, startBlock, endBlock) {
      const blockHashes = []
      // Calculate the step size given the range of blocks and the number of points we want
      const step = Math.floor((endBlock - startBlock) / this.points)
      try {
        // Get all block hashes
        const blockHashPromises = []
        for (let i = startBlock + step; i <= endBlock; i = i + step) {
          if (!blockHashes.find((x) => x.block === i)) {
            const blockHashPromise = api.rpc.chain.getBlockHash(i)
            blockHashPromises.push(i, blockHashPromise)
          }
        }
        const hashResults = await Promise.all(blockHashPromises)
        for (let i = 0; i < hashResults.length; i = i + 2) {
          blockHashes.push({
            block: hashResults[i],
            hash: hashResults[i + 1],
          })
        }
        // console.log('block hashes:', blockHashes)

        const balancePromises = []

        // Loop over the blocks, using the step value
        for (let i = startBlock + step; i <= endBlock; i = i + step) {
          // If we already have data about that block, skip it
          if (!this.balances.find((x) => x.block === i)) {
            // Get the block hash
            const blockHash = blockHashes.find((x) => x.block === i).hash
            // Create a promise to query the balance for that block
            const accountDataPromise = api.query.system.account.at(
              blockHash,
              address
            )
            // Push data to a linear array of promises to run in parallel.
            balancePromises.push(i, accountDataPromise)
          }
        }

        // Call all promises in parallel for speed.
        const balanceResults = await Promise.all(balancePromises)

        // Restructure the data into an array of objects
        const balances = []
        for (let i = 0; i < balanceResults.length; i = i + 2) {
          const block = balanceResults[i]
          const accountData = balanceResults[i + 1]
          const free = this.formatBalance(accountData.data.free)
          const reserved = this.formatBalance(accountData.data.reserved)
          const total = free + reserved
          balances.push({
            block,
            free,
            reserved,
            total,
          })
        }
        // console.log('balances:', balances)
        return balances
      } catch (error) {
        // eslint-disable-next-line no-console
        console.log('error fetching balances:', error)
      }
    },
    formatBalance(balance) {
      return parseFloat(
        new BigNumber(balance)
          .div(new BigNumber(10).pow(config.tokenDecimals))
          .toFixed(3)
      )
    },
  },
}
</script>
