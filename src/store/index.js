import { createStore } from "vuex";
import VuexPersistence from 'vuex-persist'
import dayjs from "dayjs";
const vuexLocal = new VuexPersistence({
  storage: window.localStorage
})
export default createStore({
  state: {
    hideConfigButton: false,
    isPinned: true,
    showConfig: false,
    isTransparent: "",
    isRTL: false,
    mcolor: "",
    isNavFixed: false,
    isAbsolute: false,
    showNavs: true,
    showSidenav: true,
    showNavbar: true,
    showFooter: true,
    showMain: true,
    excelData: {},
    fileName: "",
    minDate: null,
    maxDate: null,
    startDate: null,
    endDate: null,
    mode: "day", // day, month
    selected: null,
  },
  mutations: {
    updateDates(state, payload) {
      if (payload) {
        const dateFormat = state.mode === "day" ? "YYYY-MM-DD" : "YYYY-MM";
        state.startDate = dayjs(dayjs(payload[0]).format(dateFormat));
        state.endDate = dayjs(dayjs(payload[1]).format(dateFormat));
        state.endDate = state.endDate.add(1, 'days');
      } else {
        state.startDate = null;
        state.endDate = null;
      }
    },
    toggleMode(state) {
      if (state.mode === "day") state.mode = "month";
      else state.mode = "day";
    },
    changeSelected(state, payload) {
      state.selected = payload;
      // if (payload === undefined || payload === null) state.selected = [];
      // else state.selected = payload;
    },
    addExcelData(state, payload) {
      state.excelData[payload.name] = payload;
      if (Object.keys(state.excelData).length === 1) {
        state.minDate = payload.minDate;
        state.maxDate = payload.maxDate;
      } else {
        if (payload.minDate.isBefore(state.minDate)) state.minDate = payload.minDate;
        if (payload.maxDate.isAfter(state.maxDate)) state.maxDate = payload.maxDate;
      }
    },
    removeExcelData(state, payload) {
      delete state.excelData[payload];
      if (state.selected) {
        const index = state.selected.indexOf(payload);
        if (index > -1) {
          state.selected.splice(index, 1);
        }
      }
      if (Object.keys(state.excelData).length === 0) {
        state.minDate = null;
        state.maxDate = null;
      } else {
        let minDate = state.excelData[Object.keys(state.excelData)[0]].minDate;
        let maxDate = state.excelData[Object.keys(state.excelData)[0]].maxDate;
        Object.keys(state.excelData).forEach(dat => {
          if (state.excelData[dat].minDate.isBefore(minDate)) minDate = state.excelData[dat].minDate;
          if (state.excelData[dat].maxDate.isAfter(maxDate)) maxDate = state.excelData[dat].maxDate;
        })
        state.minDate = minDate;
        state.maxDate = maxDate;
      }
    },
    toggleExcelData(state, payload) {
      state.excelData[payload].status = !state.excelData[payload].status;
      if (state.selected) {
        const index = state.selected.indexOf(payload);
        if (index > -1) {
          state.selected.splice(index, 1);
        }
      }
      const keys = Object.keys(state.excelData).filter(key => state.excelData[key].status);
      if (keys.length === 0) {
        state.minDate = null;
        state.maxDate = null;
      } else {
        let minDate = state.excelData[keys[0]].minDate;
        let maxDate = state.excelData[keys[0]].maxDate;
        keys.forEach(dat => {
          if (state.excelData[dat].minDate.isBefore(minDate)) minDate = state.excelData[dat].minDate;
          if (state.excelData[dat].maxDate.isAfter(maxDate)) maxDate = state.excelData[dat].maxDate;
        })
        state.minDate = minDate;
        state.maxDate = maxDate;
      }
    },
    setFileName(state, payload) {
      state.fileName = payload;
    },
    toggleConfigurator(state) {
      state.showConfig = !state.showConfig;
    },
    navbarMinimize(state) {
      const sidenav_show = document.querySelector(".g-sidenav-show");
      const sidenav = document.getElementById("sidenav-main");

      if (sidenav_show.classList.contains("g-sidenav-pinned")) {
        sidenav_show.classList.remove("g-sidenav-pinned");
        setTimeout(function () {
          sidenav.classList.remove("bg-white");
        }, 100);
        sidenav.classList.remove("bg-transparent");
        state.isPinned = true;
      } else {
        sidenav_show.classList.add("g-sidenav-pinned");
        sidenav.classList.add("bg-white");
        sidenav.classList.remove("bg-transparent");
        state.isPinned = false;
      }
    },
    sidebarType(state, payload) {
      state.isTransparent = payload;
    },
    navbarFixed(state) {
      if (state.isNavFixed === false) {
        state.isNavFixed = true;
      } else {
        state.isNavFixed = false;
      }
    },
  },
  actions: {
    toggleSidebarColor({ commit }, payload) {
      commit("sidebarType", payload);
    },
  },
  getters: {
    getExcelData(state) {
      return Object.values(state.excelData);
    },
    getDataMode(state) {
      return state.mode;
    },
    getExcelDataSingle(state, payload) {
      return state.excelData[payload];
    },
    getFormattedData(state) {
      let keys = Object.keys(state.excelData).filter(key => state.excelData[key].status);
      if (keys.length === 0) return [];
      if (state.selected && state.selected.length > 0) {
        keys = state.selected;
      }
      const dateFormat = state.mode === "day" ? "YYYY-MM-DD" : "YYYY-MM";
      const result = {
        keys: [],
        datasets: [],
      };
      let start = state.minDate;
      if (state.startDate && state.startDate.isBefore(start)) {
        start = state.startDate;
      }
      let end = state.maxDate;
      if (state.endDate && state.endDate.isAfter(end)) {
        end = state.endDate;
      }

      const now = end.toDate();
      for (let d = start.toDate(); d <= now; d.setDate(d.getDate() + 1)) {
        result.keys.push(dayjs(new Date(d)).format(dateFormat));
      }

      keys.forEach(data => {
        const dateMap = {};
        state.excelData[data].data.forEach(row => {
          const key = dayjs(row.Date).format(dateFormat);
          if (key in dateMap) {
            dateMap[key].push(row);
          } else {
            dateMap[key] = [row];
          }
        });
        const res = [];
        let flag = true;
        if (state.startDate || state.endDate) {
          if (state.startDate && state.endDate && state.startDate.isAfter(state.endDate)) flag = false;
          if (flag) {
            const keys = Object.keys(dateMap);
            if (state.startDate) {
              keys.forEach(key => {
                if (dayjs(key, dateFormat).isBefore(state.startDate)) {
                  delete dateMap[key];
                }
              })
            }
            if (state.endDate) {
              keys.forEach(key => {
                if (dayjs(key, dateFormat).isAfter(state.endDate)) {
                  delete dateMap[key];
                }
              })
            }
          }
        }

        // merge data
        Object.keys(dateMap).forEach(key => {
          let positive = 0;
          let negative = 0;
          const concept = {};
          const emotions = {};
          let polaritySum = 0;

          dateMap[key].forEach(row => {
            if (row.Sentiment === "POSITIVE") {
              positive++;
            } else {
              negative++;
            }
            if (row.Concept && row.Concept.length > 0) {
              row.Concept.forEach(c => {
                if (c in concept) {
                  concept[c]++;
                } else {
                  concept[c] = 1;
                }
              })
            }
            if (row.Emotions && row.Emotions.length > 0) {
              row.Emotions.forEach(c => {
                if (c in emotions) {
                  emotions[c]++;
                } else {
                  emotions[c] = 1;
                }
              })
            }
            if (row.Polarity) {
              polaritySum += row.Polarity;
            }
          });
          polaritySum = polaritySum / dateMap[key].length;
          positive = positive / dateMap[key].length;
          negative = negative / dateMap[key].length;
          dateMap[key] = {
            date: key,
            sentiment: {
              positive,
              negative,
            },
            concept,
            emotions,
            polarity: polaritySum
          };
          // res.push(dateMap[key]);
        });
        // generate data for dates

        result.keys.forEach(k => {
          if (k in dateMap) res.push(dateMap[k]);
          else res.push({
            date: k,
            sentiment: {
              positive: 0,
              negative: 0,
            },
            concept: [],
            emotions: [],
            polarity: 0.0
          })
        })

        result.datasets.push({
          label: data,
          data: res,
        });
      });
      return result;
    },
    getFileName(state) {
      return state.fileName;
    },
    getDataKeys(state) {
      return Object.keys(state.excelData);
    }
  },
});
