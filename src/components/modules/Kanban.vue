<template>
  <div id="app-container">
    <q-card>
      <q-card-title class="bg-primary text-white text-center">
        <h5 class="no-margin" >Kanban Board</h5>
      </q-card-title>
      <q-card-main>
        <div class="row">
          <div class="col-xs-12 col-sm-12 col-md-6 col-lg-4 bg-red margin-top">
            <h5 class="text-center">RED</h5>
            <div class="row">
              <q-card class="bg-grey-2 col" >
                <q-card-main>
                  <q-list highlight inset-separator>
                    <q-item v-for="part in redParts" v-bind:key="part">
                      <q-item-side left :stamp="part.partCod.toString()" />
                      <q-item-main :label="part.partDesc" label-lines="1" />
                      <q-item-side right :stamp="`Qtd: ${part.partQtd}`" />
                    </q-item>
                  </q-list>
                </q-card-main>
              </q-card>
            </div>
          </div>
          <div class="col-xs-12 col-sm-12 col-md-6 col-lg-4 bg-yellow margin-top">
            <h5 class="text-center">YELLOW</h5>
            <div class="row">
              <q-card class="bg-grey-2 col">
                <q-card-main>
                  <q-list highlight inset-separator>
                    <q-item v-for="part in yellowParts" v-bind:key="part">
                      <q-item-side left :stamp="part.partCod.toString()" />
                      <q-item-main :label="part.partDesc" label-lines="1" />
                      <q-item-side right :stamp="`Qtd: ${part.partQtd}`" />
                    </q-item>
                  </q-list>
                </q-card-main>
              </q-card>
            </div>
          </div>
          <div class="col-xs-12 col-sm-12 col-md-6 col-lg-4 bg-green margin-top">
            <h5 class="text-center" >GREEN</h5>
            <div class="row">
              <q-card  class="bg-grey-2 col" >
                <q-card-main>
                  <q-list highlight inset-separator>
                    <q-item v-for="part in greenParts" v-bind:key="part">
                      <q-item-side left :stamp="part.partCod.toString()" />
                      <q-item-main :label="part.partDesc" label-lines="1" />
                      <q-item-side :stamp="`Qtd: ${part.partQtd}`" />
                    </q-item>
                  </q-list>
                </q-card-main>
              </q-card>
            </div>            
          </div>
        </div>
      </q-card-main>
    </q-card>
  </div>
</template>

<script>

import {
  QCard,
  QCardTitle,
  QCardMain,
  QList,
  QItem,
  QItemSide,
  QItemMain
} from 'quasar'

export default {
  name: 'kanban',
  components: {
    QCard,
    QCardTitle,
    QCardMain,
    QList,
    QItem,
    QItemSide,
    QItemMain
  },
  data () {
    return {
      greenParts: [
        { partCod: 2003040, partDesc: 'Wheel Spring', partQtd: 300 },
        { partCod: 2003042, partDesc: 'Engine', partQtd: 300 },
        { partCod: 2003041, partDesc: 'Gas Tank', partQtd: 350 },
        { partCod: 2003043, partDesc: 'Seat', partQtd: 350 }
      ],
      yellowParts: [
        { partCod: 2003042, partDesc: 'Oil 40w5', partQtd: 100 },
        { partCod: 2003041, partDesc: 'Exhausts', partQtd: 150 },
        { partCod: 2003043, partDesc: 'HeadLight', partQtd: 250 },
        { partCod: 2003040, partDesc: 'Brakes', partQtd: 200 }
      ],
      redParts: [
        { partCod: 2003042, partDesc: 'Chain Guard X', partQtd: 10 },
        { partCod: 2003042, partDesc: 'Chain Guard Y', partQtd: 10 },
        { partCod: 2003041, partDesc: 'Tires', partQtd: 15 },
        { partCod: 2003040, partDesc: 'Horn X', partQtd: 20 },
        { partCod: 2003043, partDesc: 'Mirror Left', partQtd: 25 },
        { partCod: 2003043, partDesc: 'Mirror Right', partQtd: 25 },
        { partCod: 2003040, partDesc: 'Horn y', partQtd: 50 },
        { partCod: 2003041, partDesc: 'Tires', partQtd: 50 }
      ]
    }
  }
}
</script>

<style>
#app-container {
  padding: 0.25em;
}

.margin-top{
  margin-top: 1em;
}
</style>
