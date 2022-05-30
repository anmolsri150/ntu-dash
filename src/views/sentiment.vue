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
        <template v-for="x in getExcelData"  v-if="getExcelData.length" :key="x">
          <h1>Positive Sentiment Aggregation for a Particular date</h1>
          <div id="polarityPositive"></div>
          <h1>Negative Sentiment Aggregation for a Particular date</h1>
          <div id="polarityNegative"></div>
        </template>

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
import Plotly from "plotly.js-dist";
export default {
  name: "DashboardDefault",
  components: {
    Card,
  },

  data() {
    return {
      val: {},
      trace: [],
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
    polarities (){
      if(this.getFormattedData &&  this.getFormattedData.datasets && this.getFormattedData.datasets.length>0){
        let datasetsP = [];
        let datasetsN = [];
        let datasets=[];
        this.getFormattedData.datasets.forEach((item)=>{
          datasetsP.push(
              {
                y:item.data.map((obj)=>obj.sentiment.positive),
                x:this.getFormattedData.keys ,
                mode: 'lines',
                name: item.label + 'positive',
                connectgaps: true
              });
          datasetsN.push(
              {
                y:item.data.map((obj)=>obj.sentiment.negative),
                x:this.getFormattedData.keys ,
                mode: 'lines',
                name: item.label + 'negative',
                connectgaps: true
              })
        });
        datasets.push(datasetsP);
        datasets.push(datasetsN);
        return datasets;
      }
      return [];
    },


  },
  watch : {
    polarities(obj){
      let layout = {
        title:'Adding Names to Line and Scatter Plot',
        xaxis: {
          autorange: true,
          range: ['2020-01-01', '2021-04-01'],
          rangeslider: {range: ['2020-01-01', '2021-04-01']},
          type: 'date'
        },
        yaxis: {
          autorange: true,
          range: [-1,1],
          type: 'linear',
          line: {
            color:'#ff2351',
            dash: 'solid',
            width: 4,
          }
        }
      };

      Plotly.update('polarityPositive', obj[0], layout);
      Plotly.update('polarityNegative', obj[1], layout);

    }
  },
  mounted() {
    let layout = {
      xaxis: {
        autorange: true,
        range: ['2020-01-01', '2021-04-01'],
        rangeslider: {range: ['2020-01-01', '2021-04-01']},
        type: 'date'
      },
      yaxis: {
        autorange: true,
        range: [-1,1],
        type: 'linear',
        line: {
          color:'rgba(115,115,115,1)',
          dash: 'solid',
          width: 4,
        }
      }
    };
    Plotly.newPlot('polarityPositive', this.polarities[0], layout);
    Plotly.newPlot('polarityNegative', this.polarities[1], layout);
  },
  methods:{
  }

};
</script>
<style scoped>
h1{
  font-size: 1.8rem;
}
</style>
