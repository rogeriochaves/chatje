document.addEventListener("DOMContentLoaded", function() {
  const link = document.querySelector("a[href*=fb-workchat-sso]");
  if (link) {
    link.href = link.href.replace("fb-workchat-sso:/", "http://localhost:2428");
  }

  if (
    document.body.children.length == 0 &&
    !document.location.href.match("localhost")
  ) {
    const url = encodeURIComponent(document.location.href);
    document.location = `http://localhost:2428/sign-in-on-browser?url=${url}`;
  }
});
