async function loadComponent(id, file) {
  const response = await fetch(file);
  const html = await response.text();
  const container = document.getElementById(id);

  container.innerHTML = html;

  const scripts = Array.from(container.querySelectorAll("script"));

  scripts.forEach((oldScript) => {
    const newScript = document.createElement("script");

    if (oldScript.src) {
      newScript.src = oldScript.src;
    } else {
      newScript.textContent = oldScript.textContent;
    }

    newScript.async = false;
    oldScript.replaceWith(newScript);
  });
}

// Header
loadComponent("header", "./components/header/header.html");

// Navbar
loadComponent("navbar", "./components/navbar/navbar.html");

// Sidebar
loadComponent("sidebar", "./components/sidebar/sidebar.html").then(() => {
  const script = document.createElement("script");

  script.src = "./components/sidebar/sidebar.js";

  document.body.appendChild(script);
});

// Recent View - GLOBAL
loadComponent("recent-view", "./components/recent-view/recentView.html").then(
  () => {
    const script = document.createElement("script");

    script.src = "./components/recent-view/recentView.js";

    document.body.appendChild(script);
  },
);

// Footer
loadComponent("footer", "./components/footer/footer.html");

// Load Page
async function loadPage(file) {
  const response = await fetch(file);
  const html = await response.text();

  document.getElementById("page-content").innerHTML = html;

  const scriptFile = file.replace(".html", ".js");

  const script = document.createElement("script");

  script.type = "module";
  script.src = scriptFile + "?time=" + Date.now();

  document.body.appendChild(script);
}

// Navbar click
document.getElementById("navbar").addEventListener("click", function (event) {
  const link = event.target.closest("[data-page]");

  if (!link) {
    return;
  }

  event.preventDefault();

  const page = link.getAttribute("data-page");

  loadPage(page);
});

// Load Home
loadPage("./page/home/home.html");
