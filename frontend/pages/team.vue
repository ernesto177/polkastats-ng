<template>

	<main>
		<header-component>
			<search-section title="Team" />
		</header-component>
		<section class="section" color="i-third-2">

			<header class="header-block mb-4">
				<h1 class="h5">Team</h1>
				<h2 class="h4">Team ColmenaLabs</h2>
				<p class="col-lg-6 mt-3 mx-auto">
					Team ColmenaLabs has a vast expertise in blockchain technologies,
					conducting Ethereum meetups since earlier 2016. ColmenaLabs is also one
					of the most active blockchain communities of Spain. Our previous
					blockchain experience has facilitated our landing in the Proof of Stake
					era, where we are participating on many projects.
				</p>
			</header>

			<b-row class="justify-content-center" style="gap: 1em;">
				<div
					v-for="member in members"
					:key="member.name"
					class="team-member text-right"
					:style="{ backgroundImage: 'url(' + member.picture + ')' }"
				>
					<b-badge variant="i-fourthB" class="text-uppercase font-weight-normal">{{ member.name }}</b-badge>
					<footer class="text-center text-i-fifth p-3 bg-i-fourthB">
						<h1 class="mb-2">{{ member.name }}</h1>
						<p>{{ member.description }}</p>
					</footer>
				</div>
			</b-row>

		</section>
	</main>


  <!-- <b-container class="pt-4">
    <b-row class="center pt-4">
      <b-card title="Team ColmenaLabs">
        Team ColmenaLabs has a vast expertise in blockchain technologies,
        conducting Ethereum meetups since earlier 2016. ColmenaLabs is also one
        of the most active blockchain communities of Spain. Our previous
        blockchain experience has facilitated our landing in the Proof of Stake
        era, where we are participating on many projects.
      </b-card>
    </b-row>
    <b-row class="pt-4">
      <b-card-group deck>
        <b-col
          v-for="member in members"
          :key="member.name"
          sm="12"
          md="6"
          lg="3"
          class="member mb-3 pb-3"
        >
          <b-card
            :title="member.name"
            :img-src="member.picture"
            img-alt="Image"
            img-top
            class="h-100"
          >
            {{ member.description }}
          </b-card>
        </b-col>
      </b-card-group>
    </b-row>
  </b-container> -->
</template>

<script>
import HeaderComponent from '@/components/more/headers/HeaderComponent.vue'
import SearchSection from '@/components/more/headers/SearchSection.vue'

export default {
	layout: 'AuthLayout',
	components: {
		HeaderComponent,
		SearchSection
	},
  data() {
    return {
      members: [
        {
          name: 'Mario',
          picture: '/img/team/Mario.jpg',
          description:
            'Founder & dev lead, full stack developer / Susbtrate lover',
        },
        {
          name: 'Fredy',
          picture: '/img/team/Fredy.jpg',
          description:
            'DragonStake founder, inflexible product owner and sysadmin guru',
        },
        {
          name: 'Wimel',
          picture: '/img/team/Wimel.png',
          description: 'DelegaNetworks founder, i18n and Colony DAO master',
        },
        {
          name: 'Scriptonita',
          picture: '/img/team/Scriptonita.jpg',
          description: 'Frontend developer & javascript/vue/react ninja',
        },
        {
          name: 'Diego',
          picture: '/img/team/Diego.jpg',
          description: 'Black belt javascript/vue developer and docker master',
        },
        {
          name: 'Ana',
          picture: '/img/team/Ana.jpg',
          description:
            'Full stack blockchain developer and beloved pr reviewer',
        },
      ],
    }
  },
  head() {
    return {
      title: this.$t('pages.team.head_title'),
      meta: [
        {
          hid: 'description',
          name: 'description',
          content: this.$t('pages.team.head_content'),
        },
      ],
    }
  },
}
</script>

<style scoped>
.center {
  justify-content: center;
}
.member {
  margin: 0;
  padding: 0;
}

@media (max-width: 991px) {
  .member {
    padding-bottom: 1.5rem;
  }
}

@media (max-width: 575px) {
  .member {
    padding: 1rem;
  }
}
</style>
