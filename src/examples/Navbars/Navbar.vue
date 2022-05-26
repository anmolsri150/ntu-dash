<template>
  <nav
    v-bind="$attrs"
    id="navbarBlur"
    class="shadow-none navbar navbar-main navbar-expand-lg border-radius-xl"
    data-scroll="true"
  >
    <div class="px-3 py-1 container-fluid">
      <div
        id="navbar"
        class="mt-2 collapse navbar-collapse mt-sm-0 me-md-0 me-sm-4 justify-content-end"
        :class="$store.state.isRTL ? 'px-0' : 'me-sm-4'"
      >
        <ul class="navbar-nav justify-content-end">
          <li class="nav-item d-flex align-items-center">
            <Datepicker v-model="dateRange" :min-date="minDate" :enable-time-picker="false" :start-date="minDate" :max-date="maxDate" :format="format" clearable range multiCalendars multiCalendarsSolo />
          </li>
          <li style="width: 300px;" class="nav-item d-flex align-items-center">
            <Multiselect
                style="margin-left: 1rem;"
                v-model="sel"
                :options="getDataKeys"
                mode="multiple"
                searchable
                placeholder="Select Datasets"
                max="5"
            />
          </li>
          <li class="nav-item d-flex align-items-center">
            <vsud-button style="margin-left: 1rem;" color="secondary" size="sm" @click="toggleMode">{{mode.toUpperCase()}}</vsud-button>
          </li>
          <li class="nav-item d-xl-none ps-3 d-flex align-items-center">
            <a
              id="iconNavbarSidenav"
              class="p-0 nav-link text-body"
              @click="toggleSidebar"
            >
              <div class="sidenav-toggler-inner">
                <i class="sidenav-toggler-line"></i>
                <i class="sidenav-toggler-line"></i>
                <i class="sidenav-toggler-line"></i>
              </div>
            </a>
          </li>
        </ul>
      </div>
    </div>
  </nav>
</template>
<script>
import Datepicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css'
import {mapMutations, mapActions, mapState, mapGetters} from "vuex";
import VsudButton from "@/components/VsudButton.vue";
import Multiselect from '@vueform/multiselect';
export default {
  name: "NavbarComponent",
  components: {
    VsudButton,
    Multiselect,
    Datepicker,
  },
  props: {
    minNav: {
      type: Function,
      default: () => { }
    },
    textWhite: {
      type: String,
      default: ""
    },
  },
  data() {
    return {
      showMenu: false,
      sel: null,
      dateRange: null,
    };
  },
  computed: {
    currentRouteName() {
      return this.$route.name;
    },
    ...mapState(['minDate', 'maxDate', 'mode', 'startDate', 'endDate', 'selected']),
    ...mapGetters(['getDataKeys'])
  },
  mounted() {
    this.sel = this.selected;
    if (this.startDate) {
      this.dateRange = [this.startDate.toDate()]
    }
  },
  watch: {
    sel(newVal) {
      this.changeSelected(newVal);
    },
    dateRange(newVal) {
      this.updateDates(newVal);
    }
  },
  created() {
    this.minNav;
  },
  updated() {
    const navbar = document.getElementById("navbarBlur");
    window.addEventListener("scroll", () => {
      if (window.scrollY > 10 && this.$store.state.isNavFixed) {
        navbar.classList.add("blur");
        navbar.classList.add("position-sticky");
        navbar.classList.add("shadow-blur");
      } else {
        navbar.classList.remove("blur");
        navbar.classList.remove("position-sticky");
        navbar.classList.remove("shadow-blur");
      }
    });
  },
  methods: {
    ...mapMutations(["navbarMinimize", "toggleConfigurator", "changeSelected", "toggleMode", "updateDates"]),
    ...mapActions(["toggleSidebarColor"]),
    format(date) {
      const res = [];
      let day = date[0].getDate();
      let month = date[0].getMonth() + 1;
      let year = date[0].getFullYear();
      res.push(`${year}-${month}-${day}`);
      day = date[1].getDate();
      month = date[1].getMonth() + 1;
      year = date[1].getFullYear();
      res.push(`${year}-${month}-${day}`);
      return res;
    },
    toggleSidebar() {
      this.toggleSidebarColor("bg-white");
      this.navbarMinimize();
    },
  },
};
</script>
<style src="@vueform/multiselect/themes/default.css"></style>