$( document ).ready(function() {

  //global variables
  var questions_array = [];
  //keep track of which questions have been asked already
  var already_picked_questions = [];
  var question_correct_answers = [];
  var user_score = 0;
  var picked_question_id;
  var calculate_score;

  /* Ajax call to get the data from the webserver */
  $.getJSON( "https://proto.io/en/jobs/candidate-questions/quiz.json",
    function( data ) {
      //callback function to ensure that ajax has finished doing it's work
      init(data);
      showQuestion(data);
  });

  $.getJSON( "https://proto.io/en/jobs/candidate-questions/result.json",
    function( result ) {
      //callback function to ensure that ajax has finished doing it's work
      resultData(result);
  });
  //result data
  function resultData(result_data){

    calculate_score = result_data;
    console.log(calculate_score);
  }
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
    while(_.contains(already_picked_questions,picked_question_id.toString()))
    {
        //console.log("Duplicate detected");
        picked_question_id = pickQuestion();
    }

    if (picked_question_id == 0){

      var tmp_picked_question = 15;
      already_picked_questions.push(tmp_picked_question.toString());
    }
    else
      already_picked_questions.push(picked_question_id.toString());

    //determine the question type
    var question_type = questions_array[picked_question_id].question_type;

    //append the image
    $('#image').empty().append('<img src=' + questions_array[picked_question_id].img + ' id="imgsize" ' + '>');



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

  function validateAnswer(user_answers, typeofquestion){

    console.log(user_answers + " user answers");
    console.log(question_correct_answers + " correct answers");
    var temp = [];
    var temp2 = [];
  //  console.log(typeof(question_correct_answers));
    if (typeof(question_correct_answers) == "number"){
      console.log("number");
      temp.push(question_correct_answers.toString());
    }
    else if (typeofquestion=="truefalse"){
        console.log(user_answers);
      if (question_correct_answers == "true"){
        temp.push("0");}
      else if (question_correct_answers == "false")
        temp.push("1");

      console.log("temp " + temp);
    }
    else{
      for (var i = 0; i < question_correct_answers.length; i++)
        temp.push(question_correct_answers[i].toString());

    }

    if (typeofquestion=="mutiplechoice-single"){

      temp2.push(user_answers.toString());
    }
    else if (typeofquestion=="truefalse"){
        console.log(user_answers);
        if (user_answers == "true")
          temp2.push("0");
        else if (user_answers == "false")
          temp2.push("1");

          console.log("temp2 " + temp2);
      }
    else{
      for (var j = 0; j < user_answers.length; j++)
        temp2.push(user_answers[j].toString());
    }

    //console.log(user_answers);
    //console.log(temp );

    // alert(typeof(temp));
    // alert(typeof(temp2));
    // alert(_.isEqual(temp,temp2));

    if ((_.difference(temp,temp2)).length == 0){
      console.log(temp + " " + temp2);
      $("#success_message").show();
      $("#success_message").delay(3000).fadeOut("slow");
      return true;
    }

    else {

      $("#fail_message").show();
      // alert(typeof(question_correct_answers));
      for (var j=0; j < temp.length; j++){
        // alert(temp[j]);
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
    // console.log("test " + test );
    // console.log("already picked " + already_picked_questions);

    var kokos = _.difference(test, already_picked_questions);


    if (kokos.length == 0){
        alert("We finish");
        return true;
      }

      return false;

  }

  //event handler
  $( "#submitbtn" ).unbind().click(function() {

    var question_type = questions_array[picked_question_id].question_type;

    var user_answers = [];

    if (question_type == "mutiplechoice-single"){

      user_answers.push($('input[name=radio_group]:checked', '#possible_answers').val());

      //update score if question is answered correctly
      if (validateAnswer(user_answers, "mutiplechoice-single"))
        updateScore();



    }
    else if (question_type== "mutiplechoice-multiple") {

      user_answers = $("#possible_answers input:checkbox:checked").map(function(){
        return $(this).val();
      }).get();
      //update score if question is answered correctly
      if (validateAnswer(user_answers, "mutiplechoice-multiple"))
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


      if (validateAnswer(user_answers, "truefalse"))
        updateScore();

    }

    if (!isFinished())
    setTimeout(function(){
      showQuestion();
    }, 3000);

    else{

      $("#question").empty();
      $("#possible_answers").empty();

      //display results according to score
      if (user_score >= calculate_score.results[0].minpoints && user_score <= calculate_score.results[0].maxpoints)
        $("#possible_answers").append($("<h3>").text(calculate_score.results[0].title));

      else if (user_score >= calculate_score.results[1].minpoints && user_score <= calculate_score.results[1].maxpoints)
        $("#possible_answers").append($("<h3>").text(calculate_score.results[1].title));

      else if (user_score >= calculate_score.results[2].minpoints && user_score <= calculate_score.results[2].maxpoints)
          c$("#possible_answers").append($("<h3>").text(calculate_score.results[2].title));
    else if (user_score >= calculate_score.results[3].minpoints && user_score <= calculate_score.results[3].maxpoints)
            $("#possible_answers").append($("<h3>").text(calculate_score.results[3].title));

  }

});






  }


});
