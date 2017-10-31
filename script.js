// GLOBAL
var newsList = {
  currentPage: '',
  totalPages: 100000 // because total pages in API is not valid, 100000+ returns error
}
let list = document.querySelector('.app-list');

var pagination = {
  inputEl: document.querySelector('#post-pag'),
  init: function() {
    let self = this;
    let el = document.querySelector('.pagination');
    self.setCurrentPage();
    el.addEventListener('click', function(event){
      if (event.target.hasAttribute('type') && 
          event.target.getAttribute('type') == 'button') {
          self.moveTo(event.target.getAttribute('value'));
      }
    });
  },
  moveTo: function(direction){
    console.log(direction);
  },
  setCurrentPage: function(){
    this.inputEl.setAttribute('value', newsList.currentPage);
  }

}

pagination.init();

let refreshBtn = document.getElementById('refresh-btn');
refreshBtn.addEventListener('click', function(){
  this.setAttribute('disabled', 'disabled');
  this.textContent = 'Loading...';
  let randomPage = Math.floor(Math.random() * (newsList.totalPages - 1)) + 1;
  getData(randomPage);
});

window.onload = function() {
  getData(102000);
}

function getData(pageNum){
  var pageNum = pageNum || 1;
  var request = new XMLHttpRequest();
  request.open('GET', 'http://content.guardianapis.com/search?page='+ pageNum +'&api-key=test', true);
  request.onload = function() {
    if (request.status >= 200 && request.status < 400) {
      // Success!
      var data = JSON.parse(request.responseText);
      newsList.currentPage = data.response.currentPage; 
      fillList(data);
      refreshBtn.removeAttribute('disabled');
      refreshBtn.textContent = 'Refresh';
    } else {
      showErrorMessage();
    }
    pagination.setCurrentPage();
  }
  request.send();
  request.onerror = function() {
    showErrorMessage();
  };
}

function fillList(data) {
  removeErrorMessage();
  let arr = data.response.results;
  let listArr = '';

  arr.forEach(function(element) {
    let listItem = buildListItem(element);
    listArr += listItem.outerHTML;
  });

  list.innerHTML = listArr;

}

function buildListItem(element) {
  let newEl = document.createElement('li');
  newEl.innerHTML = "<h2>" + element.webTitle + "</h2>";

  return newEl;
}

function showErrorMessage() {
  list.innerHTML = '';
  let errorMessage = document.createElement('p');
  let referenceNode = list;
  errorMessage.classList.add('error');
  errorMessage.textContent = "Sorry, we coudn\'t find news for you. Please try again later." ;
  referenceNode.parentNode.insertBefore(errorMessage, referenceNode.nextSibling);
}

function removeErrorMessage() { 
  let a = document.querySelectorAll('.error');
  if (!a.length) return;
  a.forEach(function(el){
    el.remove();
  });
}