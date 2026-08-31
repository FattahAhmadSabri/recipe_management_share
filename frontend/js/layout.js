async function loadComponent(id, file) {

  const response = await fetch(file);

  const html = await response.text();

  document.getElementById(id).innerHTML = html;

}


// Header
loadComponent(
  "header",
  "./components/header/header.html"
);


// Navbar
loadComponent(
  "navbar",
  "./components/navbar/navbar.html"
);


// Sidebar
loadComponent(
  "sidebar",
  "./components/sidebar/sidebar.html"
);


// Footer
loadComponent(
  "footer",
  "./components/footer/footer.html"
);


// Load Page
async function loadPage(file) {

  const response = await fetch(file);

  const html = await response.text();

  document.getElementById("page-content").innerHTML = html;


  // Load page JavaScript
  const scriptFile = file.replace(".html", ".js");

  const script = document.createElement("script");

  script.src = scriptFile;

  document.body.appendChild(script);

}


// Navbar click
document
  .getElementById("navbar")
  .addEventListener("click", function (event) {

    const link = event.target.closest("[data-page]");

    if (!link) {
      return;
    }

    event.preventDefault();

    const page = link.getAttribute("data-page");

    loadPage(page);

  });


// Load Home initially
loadPage("./page/home/home.html");