<template>
  <div id="app-container">
    <q-card>
      <q-card-title class="bg-primary text-white text-center">
        <h5 class="no-margin"> Pareto Data</h5>
      </q-card-title>
      <q-card-main>
        <h6 class="pad-h6">Enter the Following information:</h6>
        <div class="row">
          <div class="col-xm-8 col-sm-8 col-md-8 col-lg-8">
            <q-input class="margin-min" v-model="problem" type="text" ref="inputone" float-label="Description of your problem"/>
          </div>
          <div class="col-xm-4 col-sm-4 col-md-4 col-lg-4">
            <div class="wid-qtd">
              <q-input class="margin-min" v-model.number="qtd" type="number" float-label="Quantity" />
            </div>
          </div>
        </div>
        <br>
        <div class="button-obc">
          <q-btn color="primary" class="round padding-btn" @click="addProblem">Add Item</q-btn>
          <q-btn color="primary" class="round padding-btn" @click="cleanData" v-show="showChart">Reset Data</q-btn>
        </div>
      </q-card-main>
    </q-card>
    <q-card v-show="showChart">
      <q-card-title class="card-title bg-primary text-white text-center">
        <h5 class="no-margin">Chart</h5>
      </q-card-title>
      <q-card-main>
        <q-card-separator class="separator-pad" />
        <div id="chart" class="graph"></div>
        <div class="row table-header uppercase">
          <div class="col-lg-8 col-md-8 col-sm-8 col-xs-8 text-center">
            <p class="no-margin text-bold">Problem Description</p>
          </div>
          <div class="col-lg-4 col-md-4 col-sm-2 col-xs-2 text-center">
            <p class="no-margin text-bold">Quantity</p>
          </div>
        </div>
        <q-list striped-odd no-border>
          <q-item v-for="item in paretoAr" :key="item.paretoAr">
            <q-item-main class="item-content row no-margin capitalize">
              <div class="col-lg-8 col-md-8 col-sm-8 col-xs-8 text-center">
                {{ item.problem }}
              </div>
              <div class="col-lg-4 col-md-4 col-sm-2 col-xs-2 text-center">
                {{ item.qtd }}
              </div>
            </q-item-main>
          </q-item>
        </q-list>
      </q-card-main>
    </q-card>
  </div>
</template>

<script>

import c3 from 'c3'
import _ from 'lodash'

import {
  Toast,
  QCard,
  QCardTitle,
  QCardMain,
  QCardSeparator,
  QInput,
  QBtn,
  QList,
  QItem,
  QItemMain
} from 'quasar'

export default {
  name: 'pareto',
  components: {
    Toast,
    QCard,
    QCardTitle,
    QCardMain,
    QCardSeparator,
    QInput,
    QBtn,
    QList,
    QItem,
    QItemMain
  },
  data () {
    return {
      problem: '',
      qtd: null,
      paretoAr: [],
      paretoArChart: [],
      showChart: false
    }
  },
  mounted () {
    this.paretoAr = [
      { problem: 'Problem 1', qtd: 50 },
      { problem: 'Problem 2', qtd: 450 },
      { problem: 'Problem 3', qtd: 150 },
      { problem: 'Problem 4', qtd: 300 },
      { problem: 'Problem 5', qtd: 100 },
      { problem: 'Problem 6', qtd: 75 },
      { problem: 'Problem 7', qtd: 600 }
    ]
    this.paretoAr = this.paretoAr.sort(this.compare)
    this.paretoArChart = this.paretoCalculation(this.paretoAr)
    this.chartData()
    this.showChart = true
  },
  methods: {
    cleanData () {
      this.paretoAr = []
      this.paretoArray = []
      this.showChart = false
    },
    addProblem () {
      if (this.problem === '' || this.qtd === null) {
        return Toast.create('Missing fields to complete!')
      }
      this.showChart = true
      let data = this.paretoAr
      let index = data.map(function (d) { return d['problem'] }).indexOf(this.problem)
      if (index === -1) {
        let newPareto = {
          problem: this.problem,
          qtd: this.qtd
        }
        this.paretoAr.push(newPareto)
        this.paretoAr = this.paretoAr.sort(this.compare)
        this.paretoArChart = this.paretoCalculation(this.paretoAr)
        this.chartData()
        this.problem = null
        this.qtd = null
        this.$refs.inputone.focus()
      }
      else {
        Toast.create('Data already registered, go to the next one!')
      }
    },
    compare (a, b) {
      if (a.qtd > b.qtd) {
        return -1
      }
      if (a.qtd < b.qtd) {
        return 1
      }
      return 0
    },
    chartData () {
      setTimeout(() => {
        return c3.generate({
          data: {
            bindto: '#chart',
            x: 'x',
            columns: [
              this.paretoArChart.finalPatternX,
              this.paretoArChart.finalPatternQtd,
              this.paretoArChart.finalPatternAcc
            ],
            type: 'bar',
            types: {
              '% Accumalated': 'spline'
            },
            axes: {
              '% Accumalated': 'y2'
            }
          },
          axis: {
            x: {
              type: 'category'
            },
            y2: {
              show: true,
              min: 10,
              max: 100
            }
          },
          grid: {
            y: {
              lines: [
                {value: 80, text: '80% of Problems', axis: 'y2'}
              ]
            }
          }
        })
      }, 50)
    },
    paretoCalculation (paretoAr) {
      const paretoArray = paretoAr.sort(this.compare)
      const patternX = [
        ['x']
      ]
      const patternQtd = [
        ['Quantity']
      ]
      const patternAcc = [
        ['% Accumalated']
      ]
      const patternXFinal = paretoArray.map(item => item.problem)
      const patternQtdFinal = paretoArray.map(item => item.qtd)
      const totalPercent = patternQtdFinal.reduce((acc, curr) => acc + curr)
      const itemPercent = patternQtdFinal.map(item => Math.round((item / totalPercent) * 100))
      const patternAccAlmost = itemPercent.reduce(function (r, c, i) { r.push((r[i - 1] || 0) + c); return r }, [])
      const finalPatternAcc = _.flattenDeep(patternAcc.concat(patternAccAlmost))
      const finalPatternX = _.flattenDeep(patternX.concat(patternXFinal))
      const finalPatternQtd = _.flattenDeep(patternQtd.concat(patternQtdFinal))
      return {
        finalPatternX,
        finalPatternQtd,
        finalPatternAcc
      }
    }
  }
}
</script>

<style>

@import url("../../../node_modules/c3/c3.css");

#app-container {
  padding: 0.20em;
}

.table-header {
  padding-top: 1%;
}

.wid-qtd {
  width: 10em;
  margin-left: 2em;
}

.separator-pad {
  margin: 1%;
}

.pad-h6 {
  padding-top: 1%;
  margin-bottom: 0;
}

.margin-min {
  margin: 1em;
}

@media screen and (max-width: 575px){
  .wid-qtd {
    margin-left: 0;
  }

  .table-header {
    padding-top: 2%;
  }

  .separator-pad {
    margin-bottom: 5%;
  }
}

</style>
