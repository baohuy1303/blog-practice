
const fileInput = $("#input-file")[0]
const submitBtn = $("#submit-btn")[0]
const warningFile = $("#warning-file")
submitBtn.disabled = true;


fileInput.addEventListener("input", ()=>{
  if(fileInput.files.length > 0){
    submitBtn.disabled = false;
    warningFile.hide()
    console.log("Yes")
  }
  else{
    submitBtn.disabled = true;
    warningFile.show()
    console.log("No")
  }
})



$("img").each(function(){
  var $this = $(this);
  var currentIMG = this;
  console.log($this.attr('src') + ' ' + currentIMG.naturalWidth + ' ' +currentIMG.naturalHeight)
  if(!$this.hasClass("vertical") && !$this.hasClass("horizontal")){
      if (currentIMG.naturalWidth < currentIMG.naturalHeight) {
        $this.addClass("vertical");
    }else{
        $this.addClass("horizontal");
    }
  }

});

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
            alert('Analyzed post ' + id);
        },
        error: function(error) {
            console.error('Error sending', error);
        }
    });
  }
