<template>
  <div v-if="variant">
    <template v-if="!timestamp || sameDay">
      <span
        v-b-tooltip.hover
        :title="$t('components.fiat_conversion.current_value')"
      >
		<b-badge class="mr-1" :variant="variant">FIAT</b-badge>
        {{ formatNumber(FIATValue.toFixed(2)) }}
      </span>
    </template>
    <template v-else @click="historical = !historical">
      <span
        v-if="historical"
        v-b-tooltip.hover
        :title="$t('components.fiat_conversion.historic_value')"
      >
		<b-badge class="mr-1" :variant="variant">FIAT</b-badge>
        {{ formatNumber(historicalFIATValue.toFixed(2)) }}
      </span>
      <span
        v-else
        v-b-tooltip.hover
        :title="$t('components.fiat_conversion.current_value')"
      >
		<b-badge class="mr-1" :variant="variant">FIAT</b-badge>
        {{ formatNumber(FIATValue.toFixed(2)) }}
      </span>
    </template>
  </div>

  
  <div v-else class="d-inline-block">
    <div v-if="!timestamp || sameDay">
      <span
        v-if="short"
        v-b-tooltip.hover
        :title="`$${formatNumber(FIATValue.toFixed(2))}`"
      >
        <font-awesome-layers class="fa-lg align-middle fiat-conversion-short">
          <font-awesome-icon icon="circle" />
          <font-awesome-icon icon="dollar-sign" transform="shrink-6" />
        </font-awesome-layers>
      </span>
      <div
        v-else
        v-b-tooltip.hover
        class="fiat-conversion"
        :title="$t('components.fiat_conversion.current_value')"
      >
        (${{ formatNumber(FIATValue.toFixed(2)) }})
      </div>
    </div>
    <div v-else @click="historical = !historical">
      <div
        v-if="historical"
        v-b-tooltip.hover
        class="fiat-conversion"
        :title="$t('components.fiat_conversion.historic_value')"
      >
        (${{ formatNumber(historicalFIATValue.toFixed(2)) }})
      </div>
      <div
        v-else
        v-b-tooltip.hover
        class="fiat-conversion"
        :title="$t('components.fiat_conversion.current_value')"
      >
        (${{ formatNumber(FIATValue.toFixed(2)) }})
      </div>
    </div>
  </div>
</template>
<script>
import axios from 'axios'
import { BigNumber } from 'bignumber.js'
import commonMixin from '@/mixins/commonMixin.js'
import { config } from '@/frontend.config.js'

export default {
  mixins: [commonMixin],
  props: {
    units: {
      type: Number,
      default: 0,
      required: true,
    },
    timestamp: {
      type: Number,
      default: 0,
    },
    short: {
      type: Boolean,
      default: false,
    },
    variant: {
      type: String
    },
  },
  data() {
    return {
      historical: false,
      config,
      historicalFIATValue: 0,
    }
  },
  computed: {
    date() {
      return this.getDateFromTimestampDDMMYYYY(this.timestamp)
    },
    USDConversion() {
      return parseFloat(this.$store.state.fiat.usd)
    },
    FIATValue() {
      return (
        this.USDConversion *
        new BigNumber(this.units).div(
          new BigNumber(10).pow(config.tokenDecimals)
        )
      )
    },
    sameDay() {
      return this.date === this.getDateFromTimestampDDMMYYYY(Date.now())
    },
  },
  async mounted() {
    this.historicalFIATValue = this.timestamp
      ? await this.getHistoricalFIATValue()
      : 0
  },
  methods: {
    async getHistoricalFIATValue() {
      if (config.coinGeckoDenom) {
        const response = await axios
          .get(
            `https://api.coingecko.com/api/v3/coins/${config.coinGeckoDenom}/history?date=${this.date}`
          )
          .catch((error) => {
            // eslint-disable-next-line no-console
            console.log('Error fetching historical fiat value: ', error)
          })
          .finally(() => {
            return 0
          })
        return (
          response.data.market_data.current_price.usd *
          new BigNumber(this.units).div(
            new BigNumber(10).pow(config.tokenDecimals)
          )
        )
      }
    },
  },
}
</script>
