$( document ).ready(function() {

  //global variables
  var questions_array = [];
  //keep track of which questions have been asked already
  var already_picked_questions = [];

  /* Ajax call to get the data from the webserver */
  $.getJSON( "https://proto.io/en/jobs/candidate-questions/quiz.json",
    function( data ) {
      //callback function to ensure that ajax has finished doing it's work
      init(data);
      showQuestion(data);
  });

  function init(data){
    $("#title").append(data.title);
    $("#description").append(data.description);

    questions_array = data.questions;


  }

  //pick and return a random id for question from the pool
  function pickQuestion(){

    var random_question_id =  Math.floor((Math.random() * questions_array.length));

    return random_question_id;

  }


  //show a question
  function showQuestion(){

    var picked_question_id = pickQuestion();

    //check if the picked question has already been asked
    while (jQuery.inArray(picked_question_id, already_picked_questions) > -1){
        console.log("Duplicate detected");
        picked_question_id = pickQuestion();
    }
    already_picked_questions.push(picked_question_id.toString());

    console.log(already_picked_questions);



  }


});
