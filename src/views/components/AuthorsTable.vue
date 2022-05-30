<template>
  <div class="card mb-4">
    <div class="card-header pb-0">
      <div class="d-flex flex-row justify-content-between">
        <h6>Uploaded Files table</h6>
        <vsud-button :color="isFileUpload ? 'danger' : 'secondary'" size="sm" @click="isFileUpload = !isFileUpload">{{isFileUpload ? "Cancel" : "Add New"}}</vsud-button>
      </div>
    </div>

    <div v-if="!isFileUpload" class="card-body px-0 pt-2 pb-2">
      <div class="table-responsive p-0">
        <table class="table align-items-center mb-0">
          <thead>
            <tr>
              <th class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7">Name</th>
              <th
                class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 ps-2"
              >Date of Upload</th>
              <th
                  class="text-center text-uppercase text-secondary text-xxs font-weight-bolder opacity-7"
              >Num Entries</th>
              <th
                class="text-center text-uppercase text-secondary text-xxs font-weight-bolder opacity-7"
              >Status</th>
              <th class="text-secondary opacity-7"></th>
              <th class="text-secondary opacity-7"></th>
            </tr>
          </thead>
          <tbody>
          <template v-for="x in getExcelData" v-if="getExcelData.length" :key="x">
            <tr>
              <td>
                <div class="d-flex px-2 py-1">
                  <div>
                    <h6 class="mb-0 text-sm">{{ x.name }}</h6>
                  </div>
                </div>
              </td>
              <td>
                <span class="text-secondary text-xs font-weight-bold">{{ x.date }}</span>
              </td>
              <td class="align-middle text-center">
                <span class="text-secondary text-xs font-weight-bold">{{ x.count }}</span>
              </td>
              <td class="align-middle text-center text-sm">
                <vsud-badge :color="x.status ? 'success' : 'danger'" variant="gradient" size="sm">{{ x.status ? "Enabled" : "Disabled" }}</vsud-badge>
              </td>
              <td class="align-middle">
                <a
                    href="javascript:;"
                    class="text-secondary font-weight-bold text-xs"
                    @click="toggleExcelData(x.name)"
                >{{ x.status ? "Disable" : "Enable" }}</a>
              </td>
              <td class="align-middle">
                <a
                    href="javascript:;"
                    class="text-secondary font-weight-bold text-xs"
                    @click="removeExcelData(x.name)"
                >Remove</a>
              </td>
            </tr>
          </template>
          <div v-else class="p-4">
            Please add a file!
          </div>
          </tbody>
        </table>
      </div>
    </div>
    <div v-else class="card-body px-0 pt-4 pb-0">
      <file-selector v-model="files">
        <dropzone v-slot="{ hovered }">
          <div
              class="block w-full h-64 rounded-lg border-4 border-radius-xl border-dashed border-gray-400 transition-colors duration-150 d-flex flex-column space-y-4 justify-content-center items-center"
              :class="{ 'border-blue-200': hovered }"
              style="height: 200px;"
          >
            <dialog-button class="buttonn">
              <vsud-button size="sm">Add New</vsud-button></dialog-button
            >
          </div>
        </dropzone>
      </file-selector>
    </div>
  </div>
</template>

<script>
import VsudBadge from "@/components/VsudBadge.vue";
import VsudButton from "@/components/VsudButton.vue";
import { FileSelector, Dropzone, DialogButton } from "vue3-file-selector";
import img1 from "../../assets/img/team-2.jpg";
import img2 from "../../assets/img/team-3.jpg";
import img3 from "../../assets/img/team-4.jpg";
import img4 from "../../assets/img/team-3.jpg";
import img5 from "../../assets/img/team-2.jpg";
import img6 from "../../assets/img/team-4.jpg";
import * as XLSX from 'xlsx';
import dayjs from "dayjs";
import {mapGetters, mapMutations} from "vuex";

export default {
  name: "AuthorsTable",
  components: {
    FileSelector,
    Dropzone,
    DialogButton,
    VsudBadge,
    VsudButton
  },
  data() {
    return {
      img1,
      img2,
      img3,
      img4,
      img5,
      img6,
      files: [],
      isFileUpload: false,
    };
  },
  computed: {
    ...mapGetters(["getExcelData"])
  },
  methods: {
    ...mapMutations(["addExcelData", "removeExcelData", "toggleExcelData"]),
  },
  watch: {
    async files() {
      const vm = this;
      if (this.files.length === 0) return;
      const f = this.files[0];
      const reader = new FileReader();
      reader.onload = async function (e) {
        let data = e.target.result;
        /* reader.readAsArrayBuffer(file) -> data will be an ArrayBuffer */
        let workbook = XLSX.read(data);
        let sheet_name_list = workbook.SheetNames;
        if (sheet_name_list.length === 0) return;
        let sheet = XLSX.utils.sheet_to_json(workbook.Sheets[sheet_name_list[0]]);
        let res = [];
        // eslint-disable-next-line no-unused-vars
        let positive = 0;
        let minDate = null;
        let maxDate = null;
        sheet.forEach((row) => {
          if (row.Concept) {
            // eslint-disable-next-line no-inner-declarations
            function replaceAll(str, find, replace) {
              var escapedFind = find.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1");
              return str.replace(new RegExp(escapedFind, 'g'), replace);
            }

            row.Concept = replaceAll(row.Concept, "NOT", "");
            row.Concept = JSON.parse(row.Concept.replace(/'/g, '"'));
          }
          if (row.Emotions) {
            row.Emotions = row.Emotions.split(', ');
          }
          if (row.Sentiment && row.Sentiment === "POSITIVE") {
            positive++;
          }
          if (row.Date) {
            row.Date = dayjs(row.Date.slice(0, 10));
            if (!minDate) {
              minDate = row.Date;
              maxDate = row.Date;
            } else {
              if (row.Date.isBefore(minDate)) minDate = row.Date;
              if (row.Date.isAfter(maxDate)) maxDate = row.Date;
            }
            row.Date = row.Date.format('YYYY-MM-DD');
          }
          delete row.Text;
          res.push(row);
        })
        let storeObj = {
          name: f.name.split('.xlsx')[0],
          date: dayjs().format('YYYY-MM-DD'),
          minDate,
          maxDate,
          status: true,
          count: res.length,
          data: res,
        }
        vm.addExcelData(storeObj);
        vm.isFileUpload = false;
        vm.files = [];
      };
      await reader.readAsArrayBuffer(f);
    }
  }
};
</script>

<style>
  .buttonn {
    border: white!important;
    background: rgba(0,0,0,0)!important;
  }
</style>
