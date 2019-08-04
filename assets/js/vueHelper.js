<!--  아래는 수정 금지  -->

Vue.component('student-outcome', {
  props: ['university'],
  template: '\
  <div id="background">\
    <div class="container" v-for="value in studentsOutcomes">\
      <div class="row article">\
        <div class="col-md-3 col-xs-6 spacing">\
          <img class="img-fluid" :src="value.appScreen">\
        </div>\
        <div class="col-md-3 col-xs-6 spacing">\
          <div class=" bottom-space">\
            <h3 class="appTitle margin-none">{{value.appTitle}}</h3>\
            <p class="appComment">{{value.appComment}}</p>\
            <h4>{{value.students}}</h4>\
          </div>\
        </div>\
        <div class="col-md-6 col-xs-12 spacing video-title">\
           <h4 class="margin-none">발표 영상</h4><br />\
           <iframe width="560" height="315" v-bind:src="value.youTubeAddress" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>\
           <div>\
             <a v-show="value.appStoreAddress != null" :href="value.appStoreAddress" target="_blank">\
               <img src="../assets/img/app-store.png" class="" style="padding: 5px 0.5px; height: 48px;" />\
             </a>\
             <a v-show="value.website != null" :href="value.website" target="_blank">\
               <img src="../assets/img/websitelink.png" class="gotoapp" style="padding: 7px 22px;"/>\
             </a>\
           </div>\
         </div>\
      </div>\
    </div>\
  </div>\
  ',
  data() {
        return {
              studentsOutcomes: []
            }
      },
  mounted() {
    this.studentsOutcomes = universityData[this.university];
  }
})


window.onload = function() {
    new Vue({
      el: '#root'
    })
}
