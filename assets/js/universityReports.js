<!--  아래는 수정 금지  -->

Vue.component('university-reports', {
  props: ['university'],
  template: '\
  <div>\
    <div class="container centered" style="margin-bottom: 80px;">\
      <div class="col-md-4 col-xs-12" style="margin-bottom: 100px;" v-for="value in studentsOutcomes">\
        <div class="card" style="margin-right: 50px;margin-left: 50px;">\
          <img class="card-img-top" :src="value.appScreen">\
          <div class="card-body">\
            <h4 class="appTitle margin-none">{{value.appTitle}}</h4>\
            <p class="appComment" style=" color: #949494">{{value.appComment}}</p>\
            <p class="card-text">{{value.students}}</p>\
            <a :href="value.website" target="_blank" class="btn btn-primary">자세히 보기</a>\
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
