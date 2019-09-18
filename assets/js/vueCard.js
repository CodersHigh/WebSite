<!--  아래는 수정 금지  -->

Vue.component('student-card', {
  template: '\
  <div id="background-grey" style="padding-top: 40px;padding-bottom: 60px;">\
  <div class="container">\
    <div class="row">\
      <div class="col-md-4 col-xm-12" v-for="value in studentsOutcomes">\
        <div class="card hover12 hover01" style="margin-right: 10px;margin-left: 10px;">\
          <a :href="value.website"><figure><img class="card-img-top" :src="value.appScreen" style="cursor:pointer;"></figure></a>\
          <div class="card-body">\
            <h4 class="appTitle margin-none">{{value.appTitle}}</h4>\
            <p class="appComment" style=" color: #949494">{{value.appComment1}}</br>{{value.appComment2}}</p>\
            <p class="card-text">{{value.students}}</p>\
            <a :href="value.website" class="btn btn-primary">자세히 보기</a>\
          </div>\
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
    this.studentsOutcomes = cardnews;
  }
})


window.onload = function() {
    new Vue({
      el: '#root'
    })
}
