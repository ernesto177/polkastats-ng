<template>
	<table-component :items="events" :fields="fields" :options="options">
		<template #cell(block_number)="data">
            <nuxt-link
              :to="
                localePath(
                  `/event/${data.item.block_number}/${data.item.event_index}`
                )
              "
            >
              #{{ formatNumber(data.item.block_number) }}-{{
                data.item.event_index
              }}
            </nuxt-link>
        </template>
        <template #cell(section)="data">
			<div class="timeline" variant="i-primary">
				<span class="timeline-item">{{ data.item.section }}</span>
				<span class="timeline-item">{{ data.item.method }}</span>
			</div>
        </template>
	</table-component>
</template>

<script>
import { gql } from 'graphql-tag'
import commonMixin from '@/mixins/commonMixin.js'
import TableComponent from '@/components/more/TableComponent.vue'

export default {
	components: { TableComponent },
  mixins: [commonMixin],
  computed:
  {
	options()
	{
		return {
				title: this.$t('components.last_events.title'),
				tooltip: this.$t('components.last_events.events_details'),
				link: this.localePath('/events'),
				variant: 'i-secondary',
			}
	},
	fields()
	{
		return [
			{
				key: 'block_number',
				label: this.$t('components.last_events.id'),
				sortable: false,
				class: 'pkd-marked'
			},
			{
				key: 'section',
				label: this.$t('components.last_events.event'),
				sortable: false,
				class: 'expanded'
			}
		]
	}
  },
  data() {
    return {
      events: [],
    }
  },
  apollo: {
    $subscribe: {
      event: {
        query: gql`
          subscription events {
            event(order_by: { block_number: desc }, limit: 10) {
              block_number
              event_index
              section
              method
            }
          }
        `,
        result({ data }) {
          this.events = data.event
        },
      },
    },
  },
}
</script>
