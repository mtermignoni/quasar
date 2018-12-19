<template>
  <div id="app-container">
    <q-card>
      <q-card-title class="bg-primary text-white text-center">
        <h5 class="no-margin">OEE - Overall Equipment Effectiveness</h5>
      </q-card-title>
      <q-card-main>
        <div class="row">
          <div class="col-xs-12 col-sm-12 col-md-6 col-lg-4">
            <h5 class="" >Avaliable Rate</h5>
            <div class="row">
              <q-input type="number" float-label="Total Avaliable Time" class="margin-min" v-model.number="avaliableTime" :min="0" />
            </div>            
            <div class="row">
               <div class="width-1of2">
                <q-input type="number" v-model.number="plannedTime" class="margin-min" float-label="Brakes, 5S, Meetings" :min="0" />
              </div>
            </div>
            <div class="row">
               <div class="width-1of2">
                <q-input type="number" v-model.number="downTime" class="margin-min" :min="0" float-label="Changeovers, Breakdowns, lack of components"/>
              </div>
            </div>
          </div>
          <div class="col-xs-12 col-sm-12 col-md-6 col-lg-4">
            <h5>Performance Rate</h5>
            <div class="row">
               <div class="width-1of2">
                <q-input type="number" class="margin-min" v-model.number="processCycleTime"  :min="0" float-label="Process Cycle Time"/>
              </div>
            </div>
            <div class="row">
              <div class="width-1of2">
                <q-input type="number" class="margin-min" v-model.number="totalProduced" :min="0" float-label="Total Produced Parts" />
              </div>
            </div>
          </div>
          <div class="col-xs-12 col-sm-12 col-md-6 col-lg-4">
            <h5>Quality Rate</h5>
            <div class="row">
              <div class="width-1of2">
                <q-input type="number" v-model.number="defectiveParts" class="margin-min" ::min="0" float-label="Number of Defective Parts"/>
              </div>
            </div>
          </div>
        </div>
      </q-card-main>
    </q-card>
    <q-btn color="primary" class="btn-center" v-show="!buttonReset" @click="calculateOee">Calculate OEE</q-btn>
    <q-btn color="primary" class="btn-center" v-show="buttonReset" @click="resetCalc">Reset Calculation</q-btn>
    <q-card v-show="showResult">
        <q-card-title class="bg-primary text-white text-center">
          <h5 class="no-margin" >OEE - Result</h5>
        </q-card-title>
        <q-card-main>
          <div id="chart" class="pad-top"></div>
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
  QCardSeparator,
  QInput,
  QBtn
} from 'quasar'

import C3 from 'c3'

export default {
  components: {
    Toast,
    QCard,
    QCardTitle,
    QCardMain,
    QCardSeparator,
    QInput,
    QBtn
  },
  data () {
    return {
      avaliableTime: 560,
      plannedTime: 40,
      downTime: 30,
      processCycleTime: 55,
      totalProduced: 8,
      defectiveParts: 2,
      showResult: false,
      buttonReset: false
    }
  },
  methods: {
    calculateOee () {
      if (this.avaliableTime === '' || this.plannedTime === '' || this.downTime === '' || this.processCycleTime === '' || this.totalProduced === '' || this.defectiveParts === '') {
        return Toast.create('Please, insert data in ALL the fields!')
      }
      let scheduled = this.avaliableTime - this.plannedTime
      let avaliableRate = (scheduled - this.downTime) / scheduled
      let actualUptime = scheduled - this.downTime
      let performanceRate = this.totalProduced / (actualUptime / this.processCycleTime)
      let qualityRate = this.defectiveParts / this.totalProduced
      let oee = (avaliableRate * performanceRate * (1 - qualityRate)) * 100
      setTimeout(() => {
        C3.generate({
          data: {
            columns: [
              ['OEE', oee]
            ],
            type: 'gauge'
          },
          color: {
            pattern: ['#FF0000', '#F97600', '#F6C600', '#60B044'], // the three color levels for the percentage values.
            threshold: {
              values: [30, 60, 90, 100]
            }
          }
        })
      }, 50)
      this.buttonReset = true
      this.showResult = true
      // setTimeout(() => {
      //   this.$refs.results.focus()
      // }, 100)
    },
    resetCalc () {
      this.avaliableTime = ''
      this.plannedTime = ''
      this.downTime = ''
      this.processCycleTime = ''
      this.totalProduced = ''
      this.defectiveParts = ''
      this.buttonReset = false
      this.showResult = false
    }
  },
  updated () {
    let elem = this.$el
    elem.scrollTop = elem.clientHeight
  },
  created () {
    this.calculateOee() // Just here to demonstrate how it works, remove in prod and set initial data to null
  }
}
</script>

<style>

@import url("../../../node_modules/c3/c3.css");

h5 {
  padding-bottom: 0;
  margin-bottom: 0;
}

#app-container {
  padding: 0.25em;
}

.btn-center {
  margin: 0.5em;
}

.pad-top {
  margin-top: 0.5em;
}

.margin-min {
  margin: 1em;
}

</style>
