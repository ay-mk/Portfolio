// Fonction de défilement fluide vers une section spécifique
function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        section.scrollIntoView({ behavior: 'smooth' });
    } else {
        console.error(`Section avec l'ID '${sectionId}' non trouvée.`);
    }
}

// Fonction pour changer la couleur de la flèche lors du clic
function changeArrowColorOnClick(arrowElement) {
    arrowElement.style.color = '#d229d8'; // Change la couleur de la flèche au violet
}

// Animation de typewriter pour le texte
const textElement = document.getElementById('animated-text');
const text = "Alternant BTS SIO option SISR...";
let index = 0;
let isDeleting = false;

function typeWriter() {
    if (index < text.length && !isDeleting) {
        textElement.textContent += text.charAt(index);
        index++;
        setTimeout(typeWriter, 50); // Vitesse de l'écriture
    } else if (index === text.length && !isDeleting) {
        setTimeout(() => {
            isDeleting = true;
            setTimeout(deleteText, 1000); // Attend 1 seconde avant de commencer à effacer
        }, 1000); // Délai avant de commencer l'effacement
    }
}

function deleteText() {
    if (index > 0 && isDeleting) {
        textElement.textContent = text.substring(0, index - 1);
        index--;
        setTimeout(deleteText, 25); // Vitesse de l'effacement
    } else if (index === 0 && isDeleting) {
        isDeleting = false;
        setTimeout(typeWriter, 500); // Redémarre l'animation après 0.5 seconde
    }
}

// Initialisation de l'animation de typewriter après le chargement de la page
window.onload = typeWriter;

// Effet d'opacité lors du défilement
window.addEventListener("scroll", function () {
    const scrollY = window.scrollY;
    const viewportHeight = window.innerHeight;
    const overlay = document.querySelector(".overlay");

    if (overlay) {
        const opacity = Math.min(scrollY / viewportHeight, 1);
        overlay.style.opacity = opacity;
    } else {
        console.error("Élément avec la classe 'overlay' non trouvé.");
    }
});

// Sélection de la flèche
const arrow = document.querySelector('.arrow');

// Vérification de l'existence de la flèche
if (arrow) {
    // Au survol de la souris
    arrow.addEventListener('mouseover', function () {
        arrow.style.color = '#d229d8'; // Change la couleur de la flèche en violet lors du survol
    });

    // Lors du retrait de la souris
    arrow.addEventListener('mouseout', function () {
        if (!arrow.classList.contains('clicked')) { // Si la flèche n'a pas été cliquée
            arrow.style.color = '#ffffff'; // Retour à la couleur blanche
        }
    });

    // Au clic de la flèche
    arrow.addEventListener('click', function () {
        scrollToSection('A propos'); // Défilement vers la section
        changeArrowColorOnClick(arrow); // Change la couleur au violet

        // Marque la flèche comme "cliquée" en ajoutant une classe
        arrow.classList.add('clicked');

        // Remet la couleur de la flèche à blanche après 1 seconde
        setTimeout(() => {
            arrow.style.color = '#ffffff'; // Retour à la couleur blanche après 1 seconde
            arrow.classList.remove('clicked'); // Enlève la classe "cliquée"
        }, 1000);
    });
} else {
    console.error("Élément avec la classe 'arrow' non trouvé.");
}

// Gestion du glissement horizontal pour les conteneurs
const containers = document.querySelectorAll('.card-container1');

containers.forEach((container) => {
    let isDragging = false;
    let startX;
    let scrollStart;
    let lastX;
    let velocity = 0;
    let momentumID;

    // Lorsqu'on clique avec la souris
    container.addEventListener('mousedown', (e) => {
        isDragging = true;
        container.classList.add('active');
        startX = e.pageX - container.offsetLeft;
        scrollStart = container.scrollLeft;
        lastX = e.pageX;
        velocity = 0;
        cancelMomentumTracking();
        e.preventDefault();
    });

    // Lorsqu'on déplace la souris
    container.addEventListener('mousemove', (e) => {
        if (!isDragging) return;

        const x = e.pageX - container.offsetLeft;
        const distance = x - startX;

        velocity = x - lastX;

        container.scrollLeft = scrollStart - distance;

        lastX = x;
    });

    // Lorsqu'on relâche le clic
    container.addEventListener('mouseup', () => {
        if (!isDragging) return;
        isDragging = false;
        container.classList.remove('active');
        startMomentumTracking();
    });

    // Si la souris quitte le conteneur
    container.addEventListener('mouseleave', () => {
        if (isDragging) {
            isDragging = false;
            container.classList.remove('active');
            startMomentumTracking();
        }
    });

    // Fonction pour démarrer l'inertie
    function startMomentumTracking() {
        cancelMomentumTracking();
        momentumID = requestAnimationFrame(momentumLoop);
    }

    // Fonction pour arrêter l'inertie
    function cancelMomentumTracking() {
        cancelAnimationFrame(momentumID);
    }

    // Boucle d'inertie pour un effet de fluidité après le glissement
    function momentumLoop() {
        if (Math.abs(velocity) > 0.5) {
            container.scrollLeft -= velocity;
            velocity *= 0.95;
            momentumID = requestAnimationFrame(momentumLoop);
        }
    }
});
