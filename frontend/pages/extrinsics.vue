<template>

	<main>

		<header-component>
			<search-section 
				:title="$t('pages.extrinsics.title')" 
				:placeholder="$t('pages.blocks.search_placeholder')"
				:results="formatNumber(totalRows)"
				label="Search"
				v-model="filter"
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
							@input="selectedPalletExtrinsic = null"
						/>
					</b-col>
					<b-col md="4" sm="6">
						<input-control
							kind="select"
							variant="i-fourth"
							label="Extrinsic"
							v-model="selectedPalletExtrinsic"
							:options="palletExtrinsicsOptions"
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
			<table-component v-else :items="extrinsics" :fields="fields" :options="options" :pagination="pagination" @paginate="currentPage = $event" class="text-center">
				<template #cell(block_number)="data">
                    <nuxt-link
                      v-b-tooltip.hover
                      :to="
                        localePath(
                          `/extrinsic/${data.item.block_number}/${data.item.extrinsic_index}`
                        )
                      "
                      :title="$t('common.extrinsic_details')"
                    >
                      {{ data.item.block_number }}-{{
                        data.item.extrinsic_index
                      }}
                    </nuxt-link>
                </template>
                <template #cell(hash)="data">
                  {{ shortHash(data.item.hash) }}
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
                <template #cell(success)="data">
                    <font-awesome-icon
                      v-if="data.item.success"
                      icon="check"
                      class="text-i-success"
                    />
                    <font-awesome-icon
                      v-else
                      icon="times"
                      class="text-i-danger"
                    />
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
              {{ $t('pages.extrinsics.title') }}
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
        <div class="last-extrinsics">
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
                  :placeholder="$t('pages.blocks.search_placeholder')"
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
                @change="selectedPalletExtrinsic = null"
              ></b-form-select>
            </b-col>
            <b-col cols="4">
              <p class="mb-0">
                <small><strong>extrinsic</strong></small>
              </p>
              <b-form-select
                v-model="selectedPalletExtrinsic"
                :options="palletExtrinsicsOptions"
              ></b-form-select>
            </b-col>
          </b-row>
          <div v-if="$apollo.loading" class="text-center py-4">
            <Loading />
          </div>
          <template v-else>
            <div class="table-responsive">
              <b-table striped hover :fields="fields" :items="extrinsics">
                <template #cell(block_number)="data">
                  <p class="mb-0">
                    <nuxt-link
                      v-b-tooltip.hover
                      :to="
                        localePath(
                          `/extrinsic/${data.item.block_number}/${data.item.extrinsic_index}`
                        )
                      "
                      :title="$t('common.extrinsic_details')"
                    >
                      {{ data.item.block_number }}-{{
                        data.item.extrinsic_index
                      }}
                    </nuxt-link>
                  </p>
                </template>
                <template #cell(hash)="data">
                  <p class="mb-0">{{ shortHash(data.item.hash) }}</p>
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
                <template #cell(success)="data">
                  <p class="mb-0">
                    <font-awesome-icon
                      v-if="data.item.success"
                      icon="check"
                      class="text-success"
                    />
                    <font-awesome-icon
                      v-else
                      icon="times"
                      class="text-danger"
                    />
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
      filter: '',
      extrinsics: [],
      paginationOptions,
      perPage: localStorage.paginationOptions
        ? parseInt(localStorage.paginationOptions)
        : 10,
      currentPage: 1,
      totalRows: 1,
      fields: [
        {
          key: 'block_number',
          label: this.$t('pages.extrinsics.id'),
          sortable: false,
		  variant: 'i-fourth',
		  class: 'pkd-separate py-3'
        },
        {
          key: 'timestamp',
          label: this.$t('pages.extrinsics.timestamp'),
          sortable: false,
        },
        {
          key: 'hash',
          label: this.$t('pages.extrinsics.hash'),
          sortable: false,
        },
        {
          key: 'section',
          label: this.$t('pages.extrinsics.extrinsic'),
          sortable: false,
		  class: 'text-left'
        },
        {
          key: 'success',
          label: this.$t('pages.extrinsics.success'),
          sortable: false,
        },
      ],
      runtimeVersions: [],
      palletsAndExtrinsics: [],
      selectedRuntimeVersion: null,
      selectedPalletName: null,
      selectedPalletExtrinsic: null,
    }
  },
  head() {
    return {
      title: this.$t('pages.extrinsics.head_title', {
        networkName: config.name,
      }),
      meta: [
        {
          hid: 'description',
          name: 'description',
          content: this.$t('pages.extrinsics.head_content', {
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
      const palletNames = this.palletsAndExtrinsics
        .filter(({ calls }) => calls.length !== 0)
        .map(({ name }) => name)
        .sort()
        .map((palletName) => ({
          value: this.uncapitalize(palletName),
          text: palletName,
        }))
      // console.log('modules:', palletNames)
      return [{ value: null, text: 'All' }].concat(palletNames)
    },
    palletExtrinsicsOptions() {
      const vm = this
      let palletExtrinsics = []
      if (this.selectedPalletName) {
        const selectedPallet = this.palletsAndExtrinsics.find(
          ({ name }) => name === vm.capitalize(vm.selectedPalletName)
        )
        palletExtrinsics = selectedPallet.calls
          .sort()
          .map((moduleExtrinsic) => ({
            value: this.snakeToCamel(moduleExtrinsic),
            text: this.snakeToCamel(moduleExtrinsic),
          }))
      }
      // console.log('extrinsics:', palletExtrinsics)
      return [{ value: null, text: 'All' }].concat(palletExtrinsics)
    },
  },
  methods: {
    setPageSize(num) {
      localStorage.paginationOptions = num
      this.perPage = parseInt(num)
    },
    reloadQueries() {
      this.$apollo.queries.extrinsic.refetch()
      this.$apollo.queries.total.refetch()
      this.$apollo.queries.extrinsic_aggregate.refetch()
      this.$apollo.queries.spec_version.refetch()
      this.$apollo.queries.runtime.refetch()
    },
  },
  apollo: {
    extrinsic: {
      query: gql`
        query extrinsics(
          $blockNumber: bigint
          $section: String
          $method: String
          $perPage: Int!
          $offset: Int!
        ) {
          extrinsic(
            limit: $perPage
            offset: $offset
            where: {
              block_number: { _eq: $blockNumber }
              section: { _eq: $section }
              method: { _eq: $method }
            }
            order_by: { block_number: desc, extrinsic_index: desc }
          ) {
            block_number
            extrinsic_index
            is_signed
            signer
            section
            method
            hash
            success
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
          method: this.selectedPalletExtrinsic
            ? this.selectedPalletExtrinsic
            : undefined,
          perPage: this.perPage,
          offset: (this.currentPage - 1) * this.perPage,
        }
      },
      result({ data }) {
        this.extrinsics = data.extrinsic
        if (this.filter) {
          this.totalRows = this.extrinsics.length
        }
      },
    },
    total: {
      query: gql`
        query total {
          total(where: { name: { _eq: "extrinsics" } }, limit: 1) {
            count
          }
        }
      `,
      variables() {
        return {
          blockNumber: this.filter ? parseInt(this.filter) : undefined,
          section: this.selectedPalletName
            ? this.selectedPalletName
            : undefined,
          method: this.selectedPalletExtrinsic
            ? this.selectedPalletExtrinsic
            : undefined,
        }
      },
      result({ data }) {
        if (
          this.filter === '' &&
          this.selectedPalletName === null &&
          this.selectedPalletExtrinsic === null
        ) {
          this.totalRows = data.total[0].count
        }
      },
    },
    extrinsic_aggregate: {
      query: gql`
        query extrinsics(
          $blockNumber: bigint
          $section: String
          $method: String
        ) {
          extrinsic_aggregate(
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
          method: this.selectedPalletExtrinsic
            ? this.selectedPalletExtrinsic
            : undefined,
        }
      },
      result({ data }) {
        if (
          this.filter !== '' ||
          this.selectedPalletName !== null ||
          this.selectedPalletExtrinsic !== null
        ) {
          this.totalRows = data.extrinsic_aggregate.aggregate.count
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
        // get pallets and extrinsics from runtime metadata
        const metadataVersion = data.runtime[0].metadata_version
        this.metadata = data.runtime[0].metadata[metadataVersion]
        const palletsAndExtrinsics = []
        if (metadataVersion !== 'v14') {
          this.metadata.modules.forEach((module) => {
            const palletAndExtrinsics = {
              name: module.name,
              calls:
                module.calls !== null
                  ? module.calls.map((call) => call.name)
                  : [],
            }
            palletsAndExtrinsics.push(palletAndExtrinsics)
          })
        } else {
          this.metadata.pallets.forEach((pallet) => {
            const callsId = pallet.calls?.type || null
            const calls = []
            const palletAndExtrinsics = {
              name: pallet.name,
              callsId,
              calls,
            }
            if (callsId) {
              this.metadata.lookup.types
                .filter(
                  ({ id, type }) => type.path.includes('Call') && id === callsId
                )
                .forEach(({ type }) => {
                  type.def.variant.variants.forEach((variant) => {
                    palletAndExtrinsics.calls.push(variant.name.toString())
                  })
                })
            }
            palletsAndExtrinsics.push(palletAndExtrinsics)
          })
        }
        // console.log(
        //   'palletsAndExtrinsics:',
        //   JSON.stringify(palletsAndExtrinsics, null, 2)
        // )
        this.palletsAndExtrinsics = palletsAndExtrinsics
      },
    },
  },
}
</script>

<style>
.last-blocks .identicon {
  display: inline-block;
  margin: 0 0.2rem 0 0;
  cursor: copy;
}
</style>
