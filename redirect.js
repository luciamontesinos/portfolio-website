// redirect.js
// This makes GitHub Pages serve index.html for any 404 route in a React SPA
(function() {
  var path = window.location.pathname;
  var search = window.location.search;
  var hash = window.location.hash;
  
  // Save the path so React Router can handle it after redirect
  sessionStorage.setItem('redirect', path + search + hash);
  
  // Redirect to home page
  window.location.replace('/');
})();
