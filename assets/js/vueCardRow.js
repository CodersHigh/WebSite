<!--  아래는 수정 금지  -->

Vue.component('student-cards', {
  props: ['university'],
  template: '\
  <div>\
  
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
