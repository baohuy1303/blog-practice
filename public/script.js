

$('#clear').click(function () {
    console.log("ok")
    $('#text-form textarea').val('')
  });

  var textEditArea = $('.text-edit')
  textEditArea.hide()

  function textEdit(id){
    let currentTextArea = textEditArea.eq(id);
    let postText = $('.card-text').eq(id);
    let currentBTN = $('.edit-btn').eq(id);
    let title = $('.card-title').eq(id);

    if(postText.text() != ""){
      currentTextArea.css({
          width: postText.outerWidth(),
          height: 'auto',
          height: currentTextArea.scrollHeight + 'px'
        });
    }

    currentTextArea.toggle();
    postText.toggle();
    
    if(currentBTN.hasClass("func1")){
        currentBTN.val("Submit");
        currentTextArea.val(postText.text());
        currentBTN.removeClass("func1").addClass("func2");
      }
    else if(currentBTN.hasClass("func2")){
        currentBTN.val("Edit");
        console.log(currentTextArea.val());
        postText.text(currentTextArea.val());
        currentBTN.removeClass("func2").addClass("func1");

        $.ajax({
          url: '/update',
          type: 'POST',
          contentType: 'application/json',
          data: JSON.stringify({
            id: id , title: title, content: postText.text()
          }),
          success: function(response) {
              console.log('Array updated:', response);
              alert('Array updated!');
          },
          error: function(error) {
              console.error('Error updating array:', error);
          }
      });
    }
  }

  function analyzePost(id){
    let postText = $('.card-text').eq(id);
    let title = $('.card-title').eq(id);

    $.ajax({
        url: '/analyze',
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify({
          id: id , title: title, content: postText.text()
        }),
        success: function(response) {
            $(".analysis").eq(id).text(response.analysis);
            alert('Sent Data!');
        },
        error: function(error) {
            console.error('Error sending', error);
        }
    });
  }
