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

document.addEventListener("click", function(tapahtuma) {
    if (!navLinks.contains(tapahtuma.target) && !hampurilainen.contains(tapahtuma.target)) {
        navLinks.classList.remove("auki");
    }
});

let nykyinenKieli = "fi";
let nykyisetTekstit = {};

async function lataaKieli(kieli) {
    const kieliVastaus = await fetch(`${kieli}.json`);
    const kieliTekstit = await kieliVastaus.json();
    return kieliTekstit;
}

async function vaihdaKieli() {
    nykyinenKieli = nykyinenKieli === "fi" ? "en" : "fi";

    const tekstit = await lataaKieli(nykyinenKieli);
    nykyisetTekstit = tekstit;

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
if (window.innerWidth <= 768) {
    const mobiiliTarkkailijat = new IntersectionObserver((merkinnät) => {
        merkinnät.forEach(merkintä => {
            if (merkintä.isIntersecting) {
                navLinkit.forEach(linkki => linkki.classList.remove("aktiivinen"));
                const aktiivinen = document.querySelector(`.nav-links a[href="#${merkintä.target.id}"]`);
                if (aktiivinen) aktiivinen.classList.add("aktiivinen");
            }
        });
    }, { threshold: 0.05, rootMargin: "-10% 0px 0px -10% 0px" });

    osiot.forEach(osio => mobiiliTarkkailijat.observe(osio));
}

osiot.forEach(osio => tarkkailijat.observe(osio));
async function alustaKieli() {
    const tekstit = await lataaKieli("fi");
    nykyisetTekstit = tekstit;

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

emailjs.init({
    publicKey: "A4cQYxw-ilG_-05g-",
});

const lomake = document.getElementById("yhteydenotto-lomake");

lomake.addEventListener("submit", function(tapahtuma) {
    tapahtuma.preventDefault();

    emailjs.sendForm("service_yk01gjo", "template_zp0ds87", lomake)
        .then(function() {
            alert(nykyisetTekstit.yhteydenotto.onnistui);
            lomake.reset();
        })
        .catch(function(virhe) {
            alert(nykyisetTekstit.yhteydenotto.virhe);
        });
});