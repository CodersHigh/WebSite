<!--  아래는 수정 금지  -->

Vue.component('student-outcome-appstore', {
  props: ['data'],
  template: '\
  <div>\
  <div  class="row article" v-for="value in studentsOutcomes" style="margin-bottom: 0px;margin-top: 100px;">\
    <div class="row" style="margin-bottom: 40px;margin-left: 0px;margin-right: 0px;">\
      <div class="col-md-2 col-xs-12 centered" style="padding-right: 0px;padding-left: 0px;" >\
        <img class="appIcon" :src="value.appIcon" style="padding-left: 15px;">\
      </div>\
      <div class="col-md-10 col-xs-12"  >\
        <div>\
          <h4 class="appTitle margin-none" style="margin-bottom: 30px;">{{value.appTitle}}</h4>\
        </div>\
        <div>\
          <p class="appComment">{{value.appComment}}</p>\
        </div>\
        <div>\
          <h5 style="color: #333;"><img src="assets/img/multiple-users-silhouette.png">  {{value.students}}</h5>\
        </div>\
        <div style="margin-top: 40px;">\
        <div class="row">\
          <div class="col-md-3 col-xs-12">\
            <a :href="value.appStoreAddress" target="_blank">\
              <img src="assets/img/app-store.png" style="padding: 5px 0.5px; height: 48px;">\
            </a>\
          </div>\
          <div class="col-md-9 col-xs-12 text-right">\
            <a :href="value.reportAddress" target="_blank" style="margin-right: 20px; font-size: 14px;">\
            {{value.reportTitle}} <img src="assets/img/report-appstore/01/arrow.svg" style="height: 12px;"></a>\
            <a :href="value.website" target="_blank" style="margin-right: 20px;font-size: 14px;">\
              개발자 웹사이트 <img src="assets/img/report-appstore/01/arrow.svg" style="height: 12px;">\
            </a>\
            <a :href="value.youTubeAddress" target="_blank" style="margin-right: 20px;font-size: 14px;">\
              발표 영상 <img src="assets/img/report-appstore/01/arrow.svg" style="height: 12px;">\
            </a>\
            <a v-show="value.cardNewsAddress != null"  :href="value.cardNewsAddress" target="_blank" style="font-size: 14px;">\
              관련 링크 <img src="assets/img/report-appstore/01/arrow.svg" style="height: 12px;">\
            </a>\
          </div>\
        </div>\
        </div>\
      </div>\
    </div>\
    <div class="row article" style="padding-left: 15px;padding-right: 15px;">\
      <div class="col-md-12 col-xs-12">\
        <h4 class="appTitle margin-none"> iPhone 스크린샷 </h4>\
      </div>\
      <div class="row centered">\
        <div class="col-md-3 col-xs-12">\
          <img class="screenImage shadow" :src="value.appScreen01">\
        </div>\
        <div class="col-md-9 col-sm-12">\
          <div class="col-md-4 col-xs-12">\
            <img class="sideScreenImage shadow" :src="value.appScreen02">\
          </div>\
          <div class="col-md-4 col-xs-12">\
            <img class="sideScreenImage shadow" :src="value.appScreen03">\
          </div>\
          <div class="col-md-4 col-xs-12">\
            <img class="sideScreenImage shadow" :src="value.appScreen04">\
          </div>\
        </div>\
      </div>\
    </div>\
    <hr style="margin-top: 100px;border-top-width: 3px;margin-bottom: 0px;" />\
  </div>\
  </div>\
  ',
  data() {
        return {
              studentsOutcomes: []
            }
      },
  mounted() {
    this.studentsOutcomes = universityData[this.data];
  }
})

window.onload = function() {
    new Vue({
      el: '#root'
    })
}
