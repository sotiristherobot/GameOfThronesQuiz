$( document ).ready(function() {

  /* Ajax call to get the data from the webserver */
  $.getJSON( "https://proto.io/en/jobs/candidate-questions/quiz.json",
    function( data ) {
      //callback function to ensure that ajax has finished doing it's work
      init(data);
      showQuestion(data);
  });

  function init(data){
    console.log(data);
    $("#title").append(data.title);
    $("#description").append(data.description);

  }

  //show a question
  function showQuestion(data){




  }


});
