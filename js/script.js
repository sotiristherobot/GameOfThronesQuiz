$( document ).ready(function() {

  /* Ajax call to get the data from the webserver */
  $.getJSON( "https://proto.io/en/jobs/candidate-questions/quiz.json",
    function( data ) {
  	   //callback function to ensure that ajax has finished doing it's work
      showQuestion(data);

  });

  


});
