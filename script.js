const teemaNappi = document.getElementById("teema-nappi");

teemaNappi.addEventListener("click", function() {
    document.body.classList.toggle("dark");

    if (document.body.classList.contains("dark")) {
        teemaNappi.textContent = "☀️";
    } else {
        teemaNappi.textContent = "🌙";
    }
});
const hampurilainen = document.getElementById("hampurilainen");
const navLinks = document.querySelector(".nav-links");

hampurilainen.addEventListener("click", function() {
    navLinks.classList.toggle("auki");
});

let nykyinenKieli = "fi";

async function lataaKieli(kieli) {
    const kieliVastaus = await fetch(`${kieli}.json`);
    const kieliTekstit = await kieliVastaus.json();
    return kieliTekstit;
}

async function vaihdaKieli() {
    nykyinenKieli = nykyinenKieli === "fi" ? "en" : "fi";

    const tekstit = await lataaKieli(nykyinenKieli);

    document.querySelectorAll("[data-i18n]").forEach(elementti => {
        const avain = elementti.getAttribute("data-i18n");
        const osat = avain.split(".");
        const teksti = tekstit[osat[0]][osat[1]];
        elementti.textContent = teksti;
    });
    
    document.querySelectorAll("[data-i18n-placeholder]").forEach(elementti => {
        const avain = elementti.getAttribute("data-i18n-placeholder");
        const osat = avain.split(".");
        const teksti = tekstit[osat[0]][osat[1]];
        elementti.setAttribute("placeholder", teksti);
    });

    document.getElementById("kieli-nappi").textContent =
        nykyinenKieli === "fi" ? "FI | EN" : "EN | FI";
}

document.getElementById("kieli-nappi").addEventListener("click", vaihdaKieli);

const osiot = document.querySelectorAll("section");
const navLinkit = document.querySelectorAll(".nav-links a");

const tarkkailijat = new IntersectionObserver((merkinnät) => {
    merkinnät.forEach(merkintä => {
        if (merkintä.isIntersecting) {
            navLinkit.forEach(linkki => linkki.classList.remove("aktiivinen"));
            const aktiivinen = document.querySelector(`.nav-links a[href="#${merkintä.target.id}"]`);
            if (aktiivinen) aktiivinen.classList.add("aktiivinen");
        }
    });
}, { threshold: 0.3, rootMargin: "0px 0px -30% 0px" });

osiot.forEach(osio => tarkkailijat.observe(osio));
async function alustaKieli() {
    const tekstit = await lataaKieli("fi");

    document.querySelectorAll("[data-i18n]").forEach(elementti => {
        const avain = elementti.getAttribute("data-i18n");
        const osat = avain.split(".");
        const teksti = tekstit[osat[0]][osat[1]];
        elementti.textContent = teksti;
    });

    document.querySelectorAll("[data-i18n-placeholder]").forEach(elementti => {
        const avain = elementti.getAttribute("data-i18n-placeholder");
        const osat = avain.split(".");
        const teksti = tekstit[osat[0]][osat[1]];
        elementti.setAttribute("placeholder", teksti);
    });
}

alustaKieli();