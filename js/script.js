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

    //determine the question type
    var question_type = questions_array[picked_question_id].question_type;

    if (question_type != "truefalse"){
      //pick the corresponding correct answers for this question
      var question_correct_answers = questions_array[picked_question_id].correct_answer;
      //pick all the possible answers for this question
      var question_possible_answers = questions_array[picked_question_id].possible_answers;
    }

    //Show Question to the user
    $("#question").append(questions_array[picked_question_id].title);

    //depending on the type of the question show the corresponding possible answers
    if (question_type == "mutiplechoice-single"){
      console.log(question_type);
      for (var i = 0; i < question_possible_answers.length; i++){

        console.log(question_possible_answers[i].caption);
        $("#possible_answers").append(

          "<span id= " + question_possible_answers[i].a_id + ">" +
          '<input type="radio" name="radio_group" value="' +
          question_possible_answers[i].a_id +  '">' + " " + question_possible_answers[i].caption +
          "</span>" + "</br>");

      }

    }

    console.log(question_correct_answers + " Correct answers");
    console.log(question_possible_answers);



  }


});
