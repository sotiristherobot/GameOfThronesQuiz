$( document ).ready(function() {

  //global variables
  var questions_array = [];
  //keep track of which questions have been asked already
  var already_picked_questions = [];
  var question_correct_answers = [];
  var user_score = 0;
  var picked_question_id;

  /* Ajax call to get the data from the webserver */
  $.getJSON( "https://proto.io/en/jobs/candidate-questions/quiz.json",
    function( data ) {
      //callback function to ensure that ajax has finished doing it's work
      init(data);
      showQuestion(data);
  });

  function compareArrays(arr1, arr2) {
    return $(arr1).not(arr2).length == 0 && $(arr2).not(arr1).length == 0
  };


  //update score
  function updateScore(points){


      user_score += questions_array[picked_question_id].points;
      // console.log("Score " + user_score);

  }

  function init(data){
    $("#title").append(data.title);
    $("#description").append(data.description);
    $("#success_message").hide();
    $("#fail_message").hide();
    questions_array = data.questions;


  }

  //pick and return a random id for question from the pool
  function pickQuestion(){

    var random_question_id =  Math.floor((Math.random() * questions_array.length));

    return random_question_id;

  }

  //show a question
  function showQuestion(){

    picked_question_id = pickQuestion();
    // console.log(questions_array);
    //wipe out everything
    $("#question").empty();
    $("#possible_answers").empty();
    question_correct_answers = [];


    //check if the picked question has already been asked
    while (jQuery.inArray(picked_question_id.toString(), already_picked_questions) > -1){
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

      // console.log(questions_array[picked_question_id]);

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

    // console.log(user_answers + " user answers");
    //console.log(question_correct_answers + " correct answers");
    var temp = [];
    var temp2 = [];
    

    if (typeof(question_correct_answers) == "number"){

      temp.push(question_correct_answers.toString());

    }
    else{
      for (var i = 0; i < question_correct_answers.length; i ++)
        temp.push(question_correct_answers[i]);

    }

    if (typeof(user_answers) == "number")
      temp2.push(user_answers.toString());
    console.log("user ansers" + user_answers);
    console.log("temp " + temp );
    if (compareArrays(user_answers, temp)){
      $("#success_message").show();
      $("#success_message").delay(3000).fadeOut("slow");
      return true;

    }

    else {

      $("#fail_message").show();
      // alert(typeof(question_correct_answers));
      for (var j=0; j < temp.length; j++){
        alert(temp[j]);
        $('#' + temp[j]).css("background-color", "yellow");

      }

      $("#fail_message").delay(3000).fadeOut("slow");

      return false;
    }

  }

  function isFinished(){

    var test = [];
    for (var i = 0; i < questions_array.length; i++){

      test.push(questions_array[i].q_id.toString());

    }
    // console.log(test);
    // console.log(already_picked_questions);
      if (already_picked_questions.toString() == test)
        return true;


      return false;

  }

  //event handler
  $( "#submitbtn" ).unbind().click(function() {

    var question_type = questions_array[picked_question_id].question_type;

    var user_answers = [];

    if (question_type == "mutiplechoice-single"){

      user_answers.push($('input[name=radio_group]:checked', '#possible_answers').val());

      //update score if question is answered correctly
      if (validateAnswer(user_answers))
        updateScore();



    }
    else if (question_type== "mutiplechoice-multiple") {

      user_answers = $("#possible_answers input:checkbox:checked").map(function(){
        return $(this).val();
      }).get();
      //update score if question is answered correctly
      if (validateAnswer(user_answers))
        updateScore();

    }

    else if(question_type == "truefalse"){

      user_answers = [];

      if ($('input[name=radio_group]:checked', '#possible_answers').val() == 1){
        user_answers.push("false");

      }
      else{

        user_answers.push("true");
      }


      if (validateAnswer(user_answers))
        updateScore();

    }

    if (!isFinished())
    setTimeout(function(){
      showQuestion();
    }, 3000);

    else{

      alert("Score is " + user_score);

    }

});






  }


});
