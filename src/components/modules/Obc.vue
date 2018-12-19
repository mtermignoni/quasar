<template>
  <div id="app-container">
    <q-card>
      <q-card-title class="bg-primary text-white text-center">
        <h5 class="no-margin" >OBC - Operator Balance Chart</h5>
      </q-card-title>
      <q-card-main>
        <h6>Enter the Following information:</h6>
        <div class="row">
          <div class="col-6">
            <q-input v-model.number="takt" class="margin-min" type="number" :min="0" float-label="Takt Time" />
          </div>
          <div class="col-6">
            <q-input v-model.number="cycle" class="margin-min" type="number" :min="0" :max="100" float-label="Cycle Time" />
          </div>
        </div>
        <br>
        <h6>Now let's dive into OBC:</h6>
        <div class="row">
          <div class="col-lg-3 col-md-3 col-sm-12 col-xs-12">
            <q-input class="margin-min" v-model="processId" type="text" float-label="Operator Nº or Process"/>
          </div>
          <div class="col-lg-6 col-md-6 col-sm-12 col-xs-12">
            <q-input v-model="processName" type="text" class="margin-min" float-label="Process Descrition" />
          </div>
          <div class="col-lg-3 col-md-3 col-sm-12 col-xs-12">
            <q-input v-model.number="lowRepCycle" type="number" :min="0" class="margin-min" float-label="Lowest Repeatable Cycle" />
          </div>
        </div>
        <br>
        <div class="button-obc">
          <q-btn color="primary" class="round padding-btn" @click="addOperator">Add Operator</q-btn>
          <q-btn color="primary" class="round padding-btn" @click="cleanData">Clean Data</q-btn>
        </div>
      </q-card-main>
    </q-card>
    <q-card v-show="show">
      <q-card-title class="card-title bg-primary text-white text-center">
        <h5 class="no-margin">Chart</h5>
      </q-card-title>
        <q-card-main>
          <q-card-separator class="separator-pad" />
            <div id="chart"></div>
          <div class="row uppercase text-bold table-header">
            <div class="col-lg-3 col-md-3 col-sm-6 col-xs-6 text-center">
              <p class="no-margin">#Process</p>
            </div>
            <div class="col-lg-6 col-md-6 col-sm-3 col-xs-3 text-center">
              <p class="no-margin">Desc</p>
            </div>
            <div class="col-lg-3 col-md-3 col-sm-3 col-xs-3 text-center">
              <p class="no-margin">Lowest Cycle</p>
            </div>
          </div>
          <q-list striped-odd no-border>
            <q-item v-for="item in obc" :key="item.obc">
              <q-item-main>
                <div class="item-content row no-margin">
                  <div class="col-lg-3 col-md-3 col-sm-6 col-xs-6 text-center">
                    {{ item.processId }}
                  </div>
                  <div class="col-lg-6 col-md-6 col-sm-3 col-xs-3 text-center">
                    {{ item.processName }}
                  </div>
                  <div class="col-lg-3 col-md-3 col-sm-3 col-xs-3 text-center">
                    {{ item.lowRepCycle }}
                  </div>
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
  name: 'obc',
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
      show: false,
      takt: 90,
      cycle: 80,
      processId: 'Paint',
      processName: 'Preparation',
      lowRepCycle: 65,
      obc: [
        { takt: 90, cycle: 80, processId: 'Cut / Bend', processName: 'Cut', lowRepCycle: 43 },
        { takt: 90, cycle: 80, processId: 'Cut / Bend', processName: 'Bend', lowRepCycle: 35 },
        { takt: 90, cycle: 80, processId: 'Mount', processName: 'Mount 1', lowRepCycle: 55 },
        { takt: 90, cycle: 80, processId: 'Mount', processName: 'Mount 2', lowRepCycle: 47 },
        { takt: 90, cycle: 80, processId: 'Weld', processName: 'Weld 1', lowRepCycle: 47 },
        { takt: 90, cycle: 80, processId: 'Weld', processName: 'Weld 2', lowRepCycle: 47 },
        { takt: 90, cycle: 80, processId: 'Inspection', processName: 'Inspection', lowRepCycle: 47 }
      ],
      chartData: []
    }
  },
  mounted () {
    this.chartData = this.obcCalculation(this.obc)
    this.chart()
    this.show = true
  },
  methods: {
    addOperator () {
      if (this.takt === null || this.cycle === null || this.processName === '' || this.processId === '' || this.lowRepCycle === null) {
        return Toast.create('Missing fields to complete!')
      }
      let newObc = {
        takt: this.takt,
        cycle: this.cycle,
        processName: this.processName,
        processId: this.processId,
        lowRepCycle: this.lowRepCycle
      }
      this.obc.push(newObc)
      this.chartData = this.obcCalculation(this.obc)
      this.chart()
      this.show = true
    },
    obcCalculation (obc) {
      const firstCol = [
        ['x']
      ]
      const secondCol = [
        ['# Process']
      ]
      const thirdCol = [
        ['Takt']
      ]
      const fourthCol = [
        ['Cycle']
      ]
      const processIdUniqArray = _.uniq(obc.map(proc => proc.processId))
      const finalFirstCol = _.flattenDeep(firstCol.concat(processIdUniqArray))

      const groups = []

      for (let i = 0; i < processIdUniqArray.length; i++) {
        const processByBox = obc
          .filter(proc => proc.processId === processIdUniqArray[i])
          .map(proc => proc.lowRepCycle)
          .reduce((acc, curr) => acc + curr)
        groups.push(processByBox)
      }
      const finalSecondCol = _.flattenDeep(secondCol.concat(groups))
      const almostFinalThirdCol = []
      const almostFinalFourthCol = []

      for (let i = 0; i < processIdUniqArray.length; i++) {
        const processByBox = obc
          .filter(proc => proc.processId === processIdUniqArray[i])
          .map(proc => proc.takt)
        almostFinalThirdCol.push(_.uniq(processByBox))
      }

      const finalThirdCol = thirdCol.concat(_.flattenDeep(almostFinalThirdCol))

      for (let i = 0; i < processIdUniqArray.length; i++) {
        const processByBox = obc
          .filter(proc => proc.processId === processIdUniqArray[i])
          .map(proc => proc.cycle)
        almostFinalFourthCol.push(_.uniq(processByBox))
      }

      const finalFourthCol = fourthCol.concat(_.flattenDeep(almostFinalFourthCol))

      return {
        finalFirstCol,
        finalSecondCol,
        finalThirdCol,
        finalFourthCol
      }
    },
    cleanData () {
      this.processId = ''
      this.processName = ''
      this.lowRepCycle = ''
      this.takt = null
      this.cycle = null
      this.obc = []
      this.chartData = []
      this.show = false
    },
    chart () {
      setTimeout(() => {
        c3.generate({
          data: {
            bindto: '#chart',
            x: 'x',
            columns: [
              this.chartData.finalFirstCol,
              this.chartData.finalSecondCol,
              this.chartData.finalThirdCol,
              this.chartData.finalFourthCol
            ],
            type: 'bar',
            types: {
              'Takt': 'line',
              'Cycle': 'line'
            },
            axes: {
              'takt': 'y2'
            }
          },
          axis: {
            x: {
              type: 'category'
            }
          }
        })
      }, 50)
    }
  }
}
</script>

<style>

@import url("../../../node_modules/c3/c3.css");

#app-container {
  padding: 0.25em;
}

.margin-min {
  margin: 1em;
}

.separator-pad {
  margin: 1%;
}

</style>