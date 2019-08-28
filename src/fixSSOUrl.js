document.addEventListener("DOMContentLoaded", function() {
  const link = document.querySelector("a[href*=fb-workchat-sso]");
  if (link) {
    link.href = link.href.replace("fb-workchat-sso:/", "http://localhost:2428");
  }
});
