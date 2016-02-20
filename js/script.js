$( document ).ready(function() {

  //global variables
  var questions_array = [];
  //keep track of which questions have been asked already
  var already_picked_questions = [];
  var question_correct_answers = [];

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
      question_correct_answers = questions_array[picked_question_id].correct_answer;
      //pick all the possible answers for this question
      var question_possible_answers = questions_array[picked_question_id].possible_answers;
    }

    else{

        var question_correct_answers = questions_array[picked_question_id].correct_answer.toString();
        var question_possible_answers = [];
        question_possible_answers.push("true");
        question_possible_answers.push("false");

    }

    //Show Question to the user
    $("#question").append(questions_array[picked_question_id].title);

    //depending on the type of the question show the corresponding possible answers
    if (question_type == "mutiplechoice-single"){

      for (var i = 0; i < question_possible_answers.length; i++){

        $("#possible_answers").append(

          "<span id= " + question_possible_answers[i].a_id + ">" +
          '<input type="radio" name="radio_group" value="' +
          question_possible_answers[i].a_id +  '">' + " " + question_possible_answers[i].caption +
          "</span>" + "</br>");

      }

    }
    else if (question_type == "mutiplechoice-multiple"){

      for (var i = 0; i < question_possible_answers.length; i++){

          $("#possible_answers").append(

            "<span id= " + question_possible_answers[i].a_id + ">" +
            '<input type="checkbox" name="check_group" value="' +
            question_possible_answers[i].a_id +  '">' + " " + question_possible_answers[i].caption +
            "</span>" + "</br>");

      }


    }
    else if (question_type =="truefalse"){

      console.log(questions_array[picked_question_id]);

      $("#possible_answers").append(

        "<span id= " + "0" + ">" +
        '<input type="radio" name="radio_group" value="' +
        "0" +  '">' + " " + "True" +
        "</span>" + "</br>");

        $("#possible_answers").append(
          "<span id= " + "1" + ">" +
          '<input type="radio" name="radio_group" value="' +
          "1" +  '">' + " " + "False" +
          "</span>" + "</br>");



    }

  function validateAnswer(user_answers){

    for (var i = 0; i < user_answers.length; i ++){

      if (jQuery.inArray(user_answers[i].toString(), question_correct_answers.toString()) == -1) {

        console.log("Not found");

        return false;
      }

    }
    console.log("found");
    return true;

  }

  //event handler

  $( "#submitbtn" ).click(function() {

    //pick user's answers
    //alert($('input[name=radio_group]:checked', '#possible_answers').val());
    var user_answers = [];
    user_answers.push($('input[name=radio_group]:checked', '#possible_answers').val());

    validateAnswer(user_answers);


});






  }


});
