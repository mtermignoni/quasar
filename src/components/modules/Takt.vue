<template>
  <div id="app-container">
    <q-card>
      <q-card-title class="card-title bg-primary text-white text-center no-margin">
        <h5 class="no-margin">TAKT TIME</h5>
      </q-card-title> 
      <q-card-main class="card-wid">
        <br>
        <q-input class="margin-min" type="number" v-model="demand" autofocus float-label="Your Demand Here" ref="focus"/>
        <br>
        <q-input class="margin-min" float-label="Avaliable Time do Produce (min)" type="number" v-model="avaliableTime" />
        <br><br>
        <q-btn color="primary" v-show="!showReset" @click="calculateTakt">Calculate</q-btn>
        <q-btn color="primary" v-show="showReset" @click="resetParams">Reset Calculation</q-btn>
        <br><br>
        <q-input v-show="result != 0" class="margin-min" id="size-result" readonly v-model="result" />
      </q-card-main>
    </q-card>
  </div>  
</template>

<script>
import {
  Toast,
  QCard,
  QCardTitle,
  QCardMain,
  QInput,
  QBtn
} from 'quasar'

export default {
  name: 'takt',
  components: {
    Toast,
    QCard,
    QCardTitle,
    QCardMain,
    QInput,
    QBtn
  },
  data () {
    return {
      demand: 8,
      avaliableTime: 560,
      result: 0,
      showReset: false
    }
  },
  methods: {
    calculateTakt () {
      if (this.demand === '' || this.avaliableTime === '') {
        return Toast.create('Please, insert some data!')
      }
      let takt = Math.floor(this.avaliableTime / this.demand)
      this.result = `Your takt time is ${takt} minutes`
      this.showReset = true
    },
    resetParams () {
      this.demand = ''
      this.avaliableTime = ''
      this.result = 0
      this.showReset = false
      this.$refs.focus.focus()
    }
  },
  created () {
    this.calculateTakt() // just here for demo, remove in production
  }
}
</script>

<style>

#app-container {
  padding: 0.20em;
}

.size-result {
  font-size: 20px;
}

.card-wid {
  width: 50%;
  margin: 0 auto;
}

.margin-min {
  margin: 1em;
}

@media screen and (max-width: 425px){
  .card-wid {
    width: 100%;
    margin: 0 auto;
  }
}

</style>
