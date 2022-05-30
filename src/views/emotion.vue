<template>
  <div class="py-4 container-fluid">
    <div class="row">
      <div class="col-xl-3 col-sm-6 mb-xl-0 mb-4">
        <card
          :title="stats.money.title"
          :value="stats.money.value"
          :percentage="stats.money.percentage"
          :icon-class="stats.money.iconClass"
          :icon-background="stats.iconBackground"
          direction-reverse
        ></card>
      </div>
      <div class="col-xl-3 col-sm-6 mb-xl-0 mb-4">
        <card
          :title="stats.users.title"
          :value="stats.users.value"
          :percentage="stats.users.percentage"
          :icon-class="stats.users.iconClass"
          :icon-background="stats.iconBackground"
          direction-reverse
        ></card>
      </div>
      <div class="col-xl-3 col-sm-6 mb-xl-0 mb-4">
        <card
          :title="stats.clients.title"
          :value="stats.clients.value"
          :percentage="stats.clients.percentage"
          :icon-class="stats.clients.iconClass"
          :icon-background="stats.iconBackground"
          :percentage-color="stats.clients.percentageColor"
          direction-reverse
        ></card>
      </div>
      <div class="col-xl-3 col-sm-6 mb-xl-0">
        <card
          :title="stats.sales.title"
          :value="stats.sales.value"
          :percentage="stats.sales.percentage"
          :icon-class="stats.sales.iconClass"
          :icon-background="stats.iconBackground"
          direction-reverse
        ></card>
      </div>
    </div>
    <div class="row">
      <div class="col-lg-12">
        <!-- line chart -->
        <div class="card z-index-2">
          <WordCloud
              :data="data"
              nameKey="name"
              valueKey="value"
              :color="['#1f77b4']"
              :show-tooltip="true"
              :word-click="wordClickHandler">
          </WordCloud>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import Card from "@/examples/Cards/Card.vue";
import US from "../assets/img/icons/flags/US.png";
import DE from "../assets/img/icons/flags/DE.png";
import GB from "../assets/img/icons/flags/GB.png";
import BR from "../assets/img/icons/flags/BR.png";
import {mapGetters} from "vuex";
import WordCloud from '@/views/components/WordCloud.vue';

export default {
  name: "DashboardDefault",
  components: {
    Card,
    WordCloud,
  },
  data() {
    return {
      stats: {
        iconBackground: "bg-gradient-success",
        money: {
          title: "Today's Money",
          value: "$53,000",
          percentage: "+55%",
          iconClass: "ni ni-money-coins",
        },
        users: {
          title: "Today's Users",
          value: "2,300",
          percentage: "+3%",
          iconClass: "ni ni-world",
        },
        clients: {
          title: "New Clients",
          value: "+3,462",
          percentage: "-2%",
          iconClass: "ni ni-paper-diploma",
          percentageColor: "text-danger",
        },
        sales: {
          title: "Sales",
          value: "$103,430",
          percentage: "+5%",
          iconClass: "ni ni-cart",
        },
      },
      sales: {
        us: {
          country: "United States",
          sales: 2500,
          value: "$230,900",
          bounce: "29.9%",
          flag: US,
        },
        germany: {
          country: "Germany",
          sales: "3.900",
          value: "$440,000",
          bounce: "40.22%",
          flag: DE,
        },
        britain: {
          country: "Great Britain",
          sales: "1.400",
          value: "$190,700",
          bounce: "23.44%",
          flag: GB,
        },
        brasil: {
          country: "Brasil",
          sales: "562",
          value: "$143,960",
          bounce: "32.14%",
          flag: BR,
        },
      },
    };
  },
  computed:{
    ...mapGetters(['getExcelData','getFormattedData']),
    data (){
      if(this.getFormattedData &&  this.getFormattedData.datasets && this.getFormattedData.datasets.length>0){
        let datasets = [];
        this.getFormattedData.datasets.forEach((item)=> {
          // let dataset = [];
          let mp = {};
          item.data.forEach(it => {
            Object.keys(it.emotions).forEach(em => {
              if (em in mp) {
                mp[em] += it.emotions[em];
              } else {
                mp[em] = it.emotions[em];
              }
            })
          })
          Object.keys(mp).forEach(em => {
            datasets.push({
              name: em,
              value: mp[em]
            })
          });
          // datasets.push(dataset);
        });
        return datasets;
      }
      return [];
    }


  },
  watch : {
    // polarities(obj){
    //   let layout = {
    //     title:'Adding Names to Line and Scatter Plot'
    //   };
    //
    //   Plotly.update('polarity', obj, layout);
    //
    // }
  },
  methods: {
    wordClickHandler(name, value, vm) {
      console.log('wordClickHandler', name, value, vm);
    }
  },
};
</script>
