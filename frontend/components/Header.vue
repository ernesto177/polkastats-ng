<template>
  <div>
    <div class="container text-right pt-3">
      <button
        v-b-modal.wallet-modal
        type="button"
        class="btn btn-outline-info mr-2"
        style="font-size: 0.8rem"
      >
        <span v-if="selectedAddress">
          <Identicon :address="selectedAddress" :size="22" />
          {{ shortAddress(selectedAddress) }}
        </span>
        <span v-else>{{ $t('components.header.connect') }}</span>
      </button>
      <b-dropdown
        id="selected-validators"
        ref="selectedValidators"
        class="selected-validators mb-0"
        toggle-class="btn btn-selected"
        right
      >
        <template #button-content>
          <span v-if="loading" style="font-size: 0.8rem !important">{{
            capitalize($t('components.header.selected'))
          }}</span>
          <span v-else style="font-size: 0.8rem !important">
            {{ selectedValidatorAddresses.length }}/{{
              config.validatorSetSize
            }}
            {{ $t('components.header.selected') }}
          </span>
        </template>
        <SelectedValidators />
      </b-dropdown>
    </div>
    <b-navbar toggleable="xl">
      <b-container class="px-sm-3">
        <b-navbar-brand>
          <nuxt-link
            :to="localePath('/')"
            class="navbar-brand"
            title="PolkaStats block explorer"
          >
            <img class="logo" src="/img/polkastats_logo_dark@1x.png" />
          </nuxt-link>
        </b-navbar-brand>
        <a
          v-if="config.coinGeckoDenom && USDConversion && USD24hChange"
          :href="`https://www.coingecko.com/en/coins/${config.coinGeckoDenom}`"
          target="_blank"
          class="fiat mh-2"
        >
          <strong>{{ config.tokenSymbol }}</strong> ${{ USDConversion }} ({{
            USD24hChange
          }}%)
        </a>
        <b-navbar-toggle target="nav-collapse" />
        <b-collapse id="nav-collapse" is-nav>
          <b-navbar-nav class="ml-auto">
            <b-nav-item right :to="localePath('/accounts')">{{
              $t('layout.default.accounts')
            }}</b-nav-item>
            <b-nav-item right :to="localePath('/transfers')">{{
              $t('layout.default.transfers')
            }}</b-nav-item>
            <b-nav-item-dropdown text="Staking">
              <b-dropdown-item :to="localePath('/staking/dashboard')">
                {{ $t('layout.default.staking_dashboard') }}
              </b-dropdown-item>
              <b-dropdown-item :to="localePath('/staking/validators')">
                {{ $t('layout.default.validators') }}
              </b-dropdown-item>
              <b-dropdown-item
                :to="localePath('/staking/polkastats-validator')"
              >
                {{ $t('layout.default.validator') }}
              </b-dropdown-item>
              <b-dropdown-item :to="localePath('/staking/how-to-stake')">
                {{ $t('layout.default.how_to_stake') }}
              </b-dropdown-item>
            </b-nav-item-dropdown>
            <b-nav-item-dropdown text="Blockchain">
              <b-dropdown-item :to="localePath('/blocks')">
                {{ $t('layout.default.blocks') }}
              </b-dropdown-item>
              <b-dropdown-item :to="localePath('/extrinsics')">
                {{ $t('layout.default.extrinsics') }}
              </b-dropdown-item>
              <b-dropdown-item :to="localePath('/events')">
                {{ $t('layout.default.events') }}
              </b-dropdown-item>
            </b-nav-item-dropdown>
            <b-nav-item-dropdown>
              <template #button-content>
                <img
                  class="network-logo"
                  :src="`/img/networks/icons/${config.id}.svg`"
                />
                {{ config.name }}
              </template>
              <b-dropdown-item href="https://kusama.polkastats.io">
                <img
                  class="network-logo"
                  src="/img/networks/icons/kusama.svg"
                />
                KUSAMA
              </b-dropdown-item>
              <b-dropdown-item href="https://polkastats.io">
                <img
                  class="network-logo"
                  src="/img/networks/icons/polkadot.svg"
                />
                POLKADOT
              </b-dropdown-item>
            </b-nav-item-dropdown>
            <Languages />
          </b-navbar-nav>
        </b-collapse>
      </b-container>
      <b-modal id="wallet-modal" size="lg" hide-header hide-footer>
        <template #default="{ hide }">
          <WalletSelector @close="hide()" />
          <p class="text-right mb-0">
            <b-button class="btn-sm" @click="hide()">Close</b-button>
          </p>
        </template>
      </b-modal>
    </b-navbar>
    <CoinZillaBanner />
  </div>
</template>

<script>
import commonMixin from '@/mixins/commonMixin.js'
import { config } from '@/frontend.config.js'
import Identicon from '@/components/Identicon.vue'
import SelectedValidators from '@/components/staking/SelectedValidators.vue'
import Languages from '@/components/Languages.vue'
import WalletSelector from '@/components/WalletSelector.vue'
import CoinZillaBanner from '@/components/CoinZillaBanner.vue'

export default {
  components: {
    Identicon,
    SelectedValidators,
    Languages,
    WalletSelector,
    CoinZillaBanner,
  },
  mixins: [commonMixin],
  data() {
    return {
      config,
    }
  },
  computed: {
    loading() {
      return this.$store.state.ranking.loading
    },
    USDConversion() {
      return parseFloat(this.$store.state.fiat.usd).toFixed(3)
    },
    USD24hChange() {
      return parseFloat(this.$store.state.fiat.usd_24h_change).toFixed(2)
    },
    selectedValidatorAddresses() {
      return this.$store.state.ranking.selectedAddresses
    },
    selectedAddress() {
      return this.$store.state.ranking.selectedAddress
    },
  },
  created() {
    // Refresh fiat conversion values every minute
    if (this.config.coinGeckoDenom) {
      this.$store.dispatch('fiat/update')
      setInterval(() => {
        this.$store.dispatch('fiat/update')
      }, 60000)
    }
  },
}
</script>
