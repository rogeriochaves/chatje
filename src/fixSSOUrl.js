document.addEventListener("DOMContentLoaded", function() {
  const link = document.querySelector("a[href*=fb-workchat-sso]");
  link.href = link.href.replace("fb-workchat-sso:/", "http://localhost:8080");
});
