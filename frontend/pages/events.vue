<template>

	<main>

		<!-- TODO: Add Label to translate -->
		<header-component>
			<search-section 
				:title="$t('pages.events.title')" 
				:placeholder="$t('pages.events.search_placeholder')"
				label="Search"
				v-model="filter"
				:results="formatNumber(totalRows)"
			>
				<b-row class="my-3 text-left">
					<b-col md="4" sm="12" class="mb-2">
						<input-control
							kind="select"
							variant="i-fourth"
							label="Runtime"
							v-model="selectedRuntimeVersion"
							:options="runtimeSpecVersionOptions"
							@input="selectedPalletName = null"
						/>
					</b-col>
					<b-col md="4" sm="6" class="mb-2">
						<input-control
							kind="select"
							variant="i-fourth"
							label="Pallet"
							v-model="selectedPalletName"
							:options="palletNameOptions"
							@input="selectedPalletEvent = null"
						/>
					</b-col>
					<b-col md="4" sm="6">
						<input-control
							kind="select"
							variant="i-fourth"
							label="Event"
							v-model="selectedPalletEvent"
							:options="palletEventOptions"
						/>
					</b-col>
				</b-row>
				<b-button size="sm" variant="i-primary" @click="reloadQueries()">
					<font-awesome-icon icon="sync" size="sm" class="mr-1" />
					Reload
				</b-button>
			</search-section>
		</header-component>

		<section class="section">

			<Loading v-if="$apollo.loading" />
			<table-component v-else :items="events" :fields="fields" :options="options" :pagination="pagination" @paginate="currentPage = $event" class="text-center">
				<template #cell(block_number)="data">
                    <nuxt-link
                      v-b-tooltip.hover
                      :to="
                        localePath(
                          `/event/${data.item.block_number}/${data.item.event_index}`
                        )
                      "
                      :title="$t('common.event_details')"
                    >
                      #{{ formatNumber(data.item.block_number) }}-{{
                        data.item.event_index
                      }}
                    </nuxt-link>
                </template>
                <template #cell(timestamp)="data">
					<font-awesome-icon icon="clock" />
                    {{ fromNow(data.item.timestamp) }}
                </template>
                <template #cell(section)="data">
                  <div class="timeline" variant="i-primary">
					<span class="timeline-item">{{ data.item.section }}</span>
					<span class="timeline-item">{{ data.item.method }}</span>
                  </div>
                </template>
                <template #cell(data)="data">
                  <p class="mb-0">
                    {{ data.item.data.substring(0, 32)
                    }}{{ data.item.data.length > 32 ? '...' : '' }}
                  </p>
                </template>
			</table-component>

		</section>
	</main>

  <!-- <div>
    <section>
      <b-container class="main py-5">
        <b-row class="mb-2">
          <b-col cols="12">
            <h1>
              {{ $t('pages.events.title') }}
              <small class="ml-1" style="font-size: 1rem">
                [{{ formatNumber(totalRows) }}]
                <font-awesome-icon
                  icon="sync"
                  class="reload text-primary2"
                  @click="reloadQueries()"
                />
              </small>
            </h1>
          </b-col>
        </b-row>
        <div class="last-events">
          Filter
          <b-row style="margin-bottom: 1rem">
            <b-col cols="12">
              <b-input-group size="xl" class="mb-2">
                <b-input-group-prepend is-text>
                  <font-awesome-icon icon="search" />
                </b-input-group-prepend>
                <b-form-input
                  id="filterInput"
                  v-model="filter"
                  type="search"
                  :placeholder="$t('pages.events.search_placeholder')"
                />
              </b-input-group>
            </b-col>
          </b-row>
          <b-row style="margin-bottom: 1rem">
            <b-col cols="4">
              <p class="mb-0">
                <small><strong>runtime</strong></small>
              </p>
              <b-form-select
                v-model="selectedRuntimeVersion"
                :options="runtimeSpecVersionOptions"
                @change="selectedPalletName = null"
              ></b-form-select>
            </b-col>
            <b-col cols="4">
              <p class="mb-0">
                <small><strong>pallet</strong></small>
              </p>
              <b-form-select
                v-model="selectedPalletName"
                :options="palletNameOptions"
                @change="selectedPalletEvent = null"
              ></b-form-select>
            </b-col>
            <b-col cols="4">
              <p class="mb-0">
                <small><strong>event</strong></small>
              </p>
              <b-form-select
                v-model="selectedPalletEvent"
                :options="palletEventOptions"
              ></b-form-select>
            </b-col>
          </b-row>
          <div v-if="$apollo.loading" class="text-center py-4">
            <Loading />
          </div>
          <template v-else>
            <div class="table-responsive">
              <b-table striped hover :fields="fields" :items="events">
                <template #cell(block_number)="data">
                  <p class="mb-0">
                    <nuxt-link
                      v-b-tooltip.hover
                      :to="
                        localePath(
                          `/event/${data.item.block_number}/${data.item.event_index}`
                        )
                      "
                      :title="$t('common.event_details')"
                    >
                      #{{ formatNumber(data.item.block_number) }}-{{
                        data.item.event_index
                      }}
                    </nuxt-link>
                  </p>
                </template>
                <template #cell(timestamp)="data">
                  <p class="mb-0">
                    {{ fromNow(data.item.timestamp) }}
                  </p>
                </template>
                <template #cell(section)="data">
                  <p class="mb-0">
                    {{ data.item.section }} ➡
                    {{ data.item.method }}
                  </p>
                </template>
                <template #cell(data)="data">
                  <p class="mb-0">
                    {{ data.item.data.substring(0, 32)
                    }}{{ data.item.data.length > 32 ? '...' : '' }}
                  </p>
                </template>
              </b-table>
            </div>
            pagination
            <div class="row">
              <div class="col-6">
                desktop
                <div class="d-none d-sm-none d-md-none d-lg-block d-xl-block">
                  <b-button-group>
                    <b-button
                      v-for="(option, index) in paginationOptions"
                      :key="index"
                      variant="outline-primary2"
                      :class="{ 'selected-per-page': perPage === option }"
                      @click="setPageSize(option)"
                    >
                      {{ option }}
                    </b-button>
                  </b-button-group>
                </div>
                mobile
                <div class="d-block d-sm-block d-md-block d-lg-none d-xl-none">
                  <b-dropdown
                    class="m-md-2"
                    text="Page size"
                    variant="outline-primary2"
                  >
                    <b-dropdown-item
                      v-for="(option, index) in paginationOptions"
                      :key="index"
                      @click="setPageSize(option)"
                    >
                      {{ option }}
                    </b-dropdown-item>
                  </b-dropdown>
                </div>
              </div>
              <div class="col-6">
                <b-pagination
                  v-model="currentPage"
                  :total-rows="totalRows"
                  :per-page="perPage"
                  aria-controls="my-table"
                  variant="dark"
                  align="right"
                ></b-pagination>
              </div>
            </div>
          </template>
        </div>
      </b-container>
    </section>
  </div> -->
</template>

<script>
import { gql } from 'graphql-tag'
import commonMixin from '@/mixins/commonMixin.js'
import Loading from '@/components/Loading.vue'
import { config, paginationOptions } from '@/frontend.config.js'
import HeaderComponent from '@/components/more/headers/HeaderComponent.vue'
import TableComponent from '@/components/more/TableComponent.vue'
import SearchSection from '@/components/more/headers/SearchSection.vue'
import DropdownMenu from '@/components/more/DropdownMenu.vue';
import InputControl from '@/components/more/InputControl.vue'

export default {
  	layout: 'AuthLayout',
  components: {
    Loading,
	HeaderComponent,
	TableComponent,
	SearchSection,
	DropdownMenu,
	InputControl
  },
  mixins: [commonMixin],
  data() {
    return {
		options:
		{
			variant: 'i-fourth',
		},
      config,
      filter: '',
      events: [],
      paginationOptions,
      perPage: localStorage.paginationOptions
        ? parseInt(localStorage.paginationOptions)
        : 10,
      currentPage: 1,
      totalRows: 1,
      fields: [
        {
          key: 'block_number',
          label: 'Event',
          sortable: false,
		  variant: 'i-fourth',
		  class: 'pkd-separate py-3'
        },
        {
          key: 'timestamp',
          label: 'Age',
          sortable: false,
        },
        {
          key: 'event_index',
          label: 'Index',
          sortable: false,
        },
        {
          key: 'section',
          label: 'Event',
          sortable: false,
		  class:'text-left',
        },
        {
          key: 'data',
          label: 'Data',
          sortable: false,
		  class:'text-left',
        },
      ],
      runtimeVersions: [],
      palletsAndEvents: [],
      selectedRuntimeVersion: null,
      selectedPalletName: null,
      selectedPalletEvent: null,
    }
  },
  head() {
    return {
      title: this.$t('pages.events.head_title', {
        networkName: config.name,
      }),
      meta: [
        {
          hid: 'description',
          name: 'description',
          content: this.$t('pages.events.head_content', {
            networkName: config.name,
          }),
        },
      ],
    }
  },
  computed: {
	pagination()
	{
		return {
			variant: 'i-primary',
			pages:
			{
				current: this.currentPage,
				rows: this.totalRows,
				perPage: this.perPage,
			},
			perPage:
			{
				num: this.perPage,
				click: (option) => this.setPageSize(option),
				options: [10, 20, 50, 100],
			}
		}
	},
    runtimeSpecVersionOptions() {
      const runtimeSpecVersionOptions = this.runtimeVersions.map(
        (specVersion) => ({
          value: specVersion.spec_version,
          text: specVersion.spec_version,
        })
      )
      return runtimeSpecVersionOptions
    },
    palletNameOptions() {
      const palletNames = this.palletsAndEvents
        .filter(({ events }) => events.length !== 0)
        .map(({ name }) => name)
        .sort()
        .map((palletName) => ({
          value: this.uncapitalize(palletName),
          text: palletName,
        }))
      // console.log('modules:', palletNames)
      return [{ value: null, text: 'All' }].concat(palletNames)
    },
    palletEventOptions() {
      const vm = this
      let palletEvents = []
      if (this.selectedPalletName) {
        const selectedPallet = this.palletsAndEvents.find(
          ({ name }) => name === vm.capitalize(vm.selectedPalletName)
        )
        palletEvents = selectedPallet.events.sort().map((moduleEvent) => ({
          value: moduleEvent,
          text: moduleEvent,
        }))
      }
      // console.log('events:', palletEvents)
      return [{ value: null, text: 'All' }].concat(palletEvents)
    },
  },
  methods: {
    setPageSize(num) {
      localStorage.paginationOptions = num
      this.perPage = parseInt(num)
    },
    reloadQueries() {
      this.$apollo.queries.event.refetch()
      this.$apollo.queries.total.refetch()
      this.$apollo.queries.event_aggregate.refetch()
      this.$apollo.queries.spec_version.refetch()
      this.$apollo.queries.runtime.refetch()
    },
  },
  apollo: {
    event: {
      query: gql`
        query events(
          $blockNumber: bigint
          $section: String
          $method: String
          $perPage: Int!
          $offset: Int!
        ) {
          event(
            limit: $perPage
            offset: $offset
            where: {
              block_number: { _eq: $blockNumber }
              section: { _eq: $section }
              method: { _eq: $method }
            }
            order_by: { block_number: desc, event_index: desc }
          ) {
            block_number
            event_index
            data
            method
            phase
            section
            timestamp
          }
        }
      `,
      variables() {
        return {
          blockNumber: this.filter ? parseInt(this.filter) : undefined,
          section: this.selectedPalletName
            ? this.selectedPalletName
            : undefined,
          method: this.selectedPalletEvent
            ? this.selectedPalletEvent
            : undefined,
          perPage: this.perPage,
          offset: (this.currentPage - 1) * this.perPage,
        }
      },
      result({ data }) {
        this.events = data.event
      },
    },
    total: {
      query: gql`
        query total {
          total(where: { name: { _eq: "events" } }, limit: 1) {
            count
          }
        }
      `,
      variables() {
        // not needed in query, but we want the query to be
        // realoded if some variable change its value
        return {
          blockNumber: this.filter ? parseInt(this.filter) : undefined,
          section: this.selectedPalletName
            ? this.selectedPalletName
            : undefined,
          method: this.selectedPalletEvent
            ? this.selectedPalletEvent
            : undefined,
        }
      },
      result({ data }) {
        if (
          this.filter === '' &&
          this.selectedPalletName === null &&
          this.selectedPalletEvent === null
        ) {
          this.totalRows = data.total[0].count
        }
      },
    },
    event_aggregate: {
      query: gql`
        query events($blockNumber: bigint, $section: String, $method: String) {
          event_aggregate(
            where: {
              block_number: { _eq: $blockNumber }
              section: { _eq: $section }
              method: { _eq: $method }
            }
          ) {
            aggregate {
              count
            }
          }
        }
      `,
      variables() {
        return {
          blockNumber: this.filter ? parseInt(this.filter) : undefined,
          section: this.selectedPalletName
            ? this.selectedPalletName
            : undefined,
          method: this.selectedPalletEvent
            ? this.selectedPalletEvent
            : undefined,
        }
      },
      result({ data }) {
        if (
          this.filter !== '' ||
          this.selectedPalletName !== null ||
          this.selectedPalletEvent !== null
        ) {
          this.totalRows = data.event_aggregate.aggregate.count
        }
      },
    },
    spec_version: {
      query: gql`
        query runtime {
          spec_version: runtime(order_by: { block_number: desc }) {
            spec_version
          }
        }
      `,
      result({ data }) {
        this.runtimeVersions = data.spec_version
        this.selectedRuntimeVersion = data.spec_version[0].spec_version
        // console.log('runtime specs:', this.runtimeVersions)
      },
    },
    runtime: {
      query: gql`
        query runtime($specVersion: Int!) {
          runtime(where: { spec_version: { _eq: $specVersion } }, limit: 1) {
            metadata_version
            metadata
          }
        }
      `,
      skip() {
        return this.runtimeVersions.length === 0
      },
      variables() {
        return {
          specVersion: this.selectedRuntimeVersion,
        }
      },
      result({ data }) {
        // get pallets and events from runtime metadata
        const metadataVersion = data.runtime[0].metadata_version
        this.metadata = data.runtime[0].metadata[metadataVersion]
        const palletsAndEvents = []
        if (metadataVersion !== 'v14') {
          this.metadata.modules.forEach((module) => {
            const palletAndEvents = {
              name: module.name,
              events:
                module.events !== null
                  ? module.events.map((event) => event.name)
                  : [],
            }
            palletsAndEvents.push(palletAndEvents)
          })
        } else {
          this.metadata.pallets.forEach((pallet) => {
            const eventsId = pallet.events?.type || null
            const events = []
            const palletAndEvents = {
              name: pallet.name,
              eventsId,
              events,
            }
            if (eventsId) {
              this.metadata.lookup.types
                .filter(
                  ({ id, type }) =>
                    type.path.includes('Event') && id === eventsId
                )
                .forEach(({ type }) => {
                  type.def.variant.variants.forEach((variant) => {
                    palletAndEvents.events.push(variant.name.toString())
                  })
                })
            }
            palletsAndEvents.push(palletAndEvents)
          })
        }
        this.palletsAndEvents = palletsAndEvents
      },
    },
  },
}
</script>
