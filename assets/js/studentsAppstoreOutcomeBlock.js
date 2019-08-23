<!--  아래는 수정 금지  -->

Vue.component('student-outcome-appstore', {
  props: ['data'],
  template: '\
  <div>\
  <div class="row article" v-for="value in studentsOutcomes">\
    <div class="row">\
      <div class="col-md-2 col-xs-12 centered"  style=" border-style: solid; border-color: coral;">\
        <img class="appIcon" :src="value.appIcon">\
      </div>\
      <div class="col-md-10 col-xs-12"  style=" border-style: solid; border-color: coral;">\
        <div style="border-style: solid; border-color: coral;">\
          <h3 class="appTitle margin-none">{{value.appTitle}}</h3>\
        </div>\
        <div>\
          <p class="appComment">{{value.appComment}}</p>\
        </div>\
        <div>\
          <h4>{{value.students}}</h4>\
        </div>\
        <div>\
          <a :href="value.appStoreAddress" target="_blank">\
            <img src="assets/img/app-store.png" style="padding: 5px 0.5px; height: 48px;">\
          </a>\
        </div>\
        <div>\
          <a :href="value.website" target="_blank" style="margin-right: 20px;">\
            개발자 웹사이트 <img src="assets/img/report-appstore/01/arrow.svg" style="height: 12px;">\
          </a>\
          <a v-bind:src="value.youTubeAddress" target="_blank">\
            발표 영상 <img src="assets/img/report-appstore/01/arrow.svg" style="height: 12px;">\
          </a>\
        </div>\
      </div>\
    </div>\
    <hr />\
    <div style="border-style: solid; border-color: coral;">\
      <h4 class="appTitle margin-none"> iPhone 스크린샷 </h4>\
      <div class="row">\
        <div class="col-md-3 col-xs-12">\
          <img class="screenImage" :src="value.appScreen01" style="padding-bottom: 10px;">\
        </div>\
        <div class="col-md-3 col-xs-12">\
          <img class="screenImage" :src="value.appScreen02" style="padding-bottom: 10px;">\
        </div>\
        <div class="col-md-3 col-xs-12">\
          <img class="screenImage" :src="value.appScreen03" style="padding-bottom: 10px;">\
        </div>\
        <div class="col-md-3 col-xs-12">\
          <img class="screenImage" :src="value.appScreen04" style="padding-bottom: 10px;">\
        </div>\
      </div>\
    </div>\
    <hr />\
    <div style="border-style: solid; border-color: coral;">\
      <h4 class="appTitle margin-none"> 관련링크 </h4>\
      <a v-show="value.cardNewsAddress != null" :href="value.cardNewsAddress" target="_blank">\
      <img :src="value.cardNewsImage" style="width: 200px; height: 200px">\
      </a>\
    </div>\
  </div>\
  <hr />\
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
