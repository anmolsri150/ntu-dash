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
      <div class="mb-4 col-lg-5 mb-lg-0">
        <div class="card z-index-2">
          <div class="p-3 card-body">
            <!-- chart -->
            <active-users-chart />
          </div>
        </div>
      </div>
      <div class="col-lg-7">
        <!-- line chart -->
        <div class="card z-index-2">
          <gradient-line-chart />
        </div>
      </div>
    </div>
    <div class="row">
      <div class="col-lg-12">
          <template v-for="x in getExcelData"  v-if="getExcelData.length" :key="x">
            {{x.data.length}}
            <div id="polarity"></div>
          </template>
      </div>
    </div>
  </div>
</template>
<script>
import Card from "@/examples/Cards/Card.vue";
import ActiveUsersChart from "@/examples/Charts/ActiveUsersChart.vue";
import GradientLineChart from "@/examples/Charts/GradientLineChart.vue";
import OrdersCard from "./components/OrdersCard.vue";
import ProjectsCard from "./components/ProjectsCard.vue";
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
    ActiveUsersChart,
    GradientLineChart,
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
        let datasets = [];
        this.getFormattedData.datasets.forEach((item)=>{
          datasets.push(
          {
            y:item.data.map((obj)=>obj.polarity),
            x:this.getFormattedData.keys ,
            mode: 'lines+markers',
            name: item.label
        })
        });
        return datasets;
      }
      return [];
   }


  },
  watch : {
    polarities(obj){
      let layout = {
        title:'Adding Names to Line and Scatter Plot'
      };

      Plotly.update('polarity', obj, layout);

    }
  },
  mounted() {
    // console.log(this.getExcelData[0].data[0].Polarity)
    // // console.log(this.polarities)
    // // for(const item in this.getFormattedData){
    // //   var tempTrace= {
    // //     x:[1,2,3,4],
    // //     y:[1,2,3,4],
    // //     mode: 'lines+markers',
    // //     name: item.data.name
    // //   }
    // //   this.trace.append(tempTrace);
    // // }
    // var trace1 = {
    //   x: [1, 2, 3, 4],
    //   y: [10, 15, 13, 17],
    //   mode: 'lines+markers',
    //   name: 'Scatter'
    // };
    //
    // var trace2 = {
    //   x: [2, 3, 4, 5],
    //   y: [16, 5, 11, 9],
    //   mode: 'lines',
    //   name: 'Lines'
    // };
    //
    // const trace3 = {
    //   x: [1, 2, 3, 4],
    //   y: [12, 9, 15, 12],
    //   mode: 'lines+markers',
    //   name: 'Scatter + Lines'
    // };
    //
    // var data = polar;

    var layout = {
      title:'Adding Names to Line and Scatter Plot'
    };

    Plotly.newPlot('polarity', this.polarities, layout);
  },
  methods:{
  }

};
</script>
<style>
  #polarity{

  }

</style>
