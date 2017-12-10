function updateName() {
  urUsername = nameInput.value();
  nameSumbitted = true;
  nameInput.remove();
  userReq.remove();
  //create msg input
  msgInput = createElement('textarea', '')
  msgInput.id('msgInput');
  //create msg send button
  sendButton = createButton('send');
  sendButton.mouseClicked(newText);
  sendButton.id('sendButton');
}
//enter key will trigger send
function keyPressed() {
  if (keyCode == ENTER && nameSumbitted == true) {
    newText();
    return false;
  }
}

//clear text/make new text area after sending text
function cleartext() {
  msgInput.remove();
  msgInput = createElement('textarea', '')
  msgInput.id('msgInput');
}
