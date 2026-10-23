


const specialties = [
  { name: "Neurologia", icon: "⌘", description: "Cuidado com a saúde do sistema nervoso." },
  { name: "Endocrinologia", icon: "✧", description: "Equilíbrio hormonal e metabolismo." },
  { name: "Neurocirurgia", icon: "◎", description: "Avaliação e tratamento neurocirúrgico." },
  { name: "Traumatologia", icon: "✚", description: "Cuidado com ossos, músculos e articulações." },
  { name: "Cirurgia Vascular", icon: "♡", description: "Saúde das veias e artérias." },
  { name: "Cirurgia Geral", icon: "✦", description: "Avaliação e tratamento cirúrgico." },
  { name: "Dermatologia", icon: "❋", description: "Cuidados com a pele, cabelos e unhas." },
  { name: "Clínico Geral", icon: "＋", description: "Acompanhamento integral da saúde." }
];

const doctors = [
  { name: "Tatiane Pinto", specialty: "Neurologia" },
  { name: "Carolina Moreira", specialty: "Neurologia" },

  { name: "Monica Poffo", specialty: "Endocrinologia" },
  { name: "Daniela Zambrano", specialty: "Endocrinologia" },

  { name: "Foster", specialty: "Neurocirurgia" },
  { name: "Dalsin", specialty: "Neurocirurgia" },
  { name: "Francisco Braga", specialty: "Neurocirurgia" },

  { name: "Marini", specialty: "Traumatologia" },
  { name: "Dallacqua", specialty: "Traumatologia" },
  { name: "Murilo", specialty: "Traumatologia" },
  { name: "Rocha", specialty: "Traumatologia" },

  { name: "Aline", specialty: "Cirurgia Vascular" },
  { name: "Ricardo Nogueira", specialty: "Cirurgia Vascular" },
  { name: "Camilla", specialty: "Cirurgia Vascular" },

  { name: "Gustavo Martins", specialty: "Cirurgia Geral" },
  { name: "Debora Risoto", specialty: "Cirurgia Geral" },
  { name: "Kamila Souza", specialty: "Cirurgia Geral" },

  { name: "Leticia Duppont", specialty: "Dermatologia" },
  { name: "Eduardo Mertens", specialty: "Dermatologia" },

  { name: "Alejandro", specialty: "Clínico Geral" },
  { name: "Henrique Corrêa", specialty: "Clínico Geral" }
];

const specialtyGrid = document.querySelector("#specialty-grid");
const doctorGrid = document.querySelector("#doctor-grid");
const specialtyFilter = document.querySelector("#specialty-filter");
const doctorSearch = document.querySelector("#doctor-search");
const appointmentSpecialty = document.querySelector("#appointment-specialty");
const appointmentDoctor = document.querySelector("#appointment-doctor");
const emptyState = document.querySelector("#empty-state");

function createInitials(name) {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map(part => part.charAt(0).toLocaleUpperCase("pt-BR"))
    .join("");
}

function renderSpecialties() {
  specialtyGrid.innerHTML = specialties.map((specialty, index) => `
    <a class="specialty-card" href="#medicos"
       data-specialty-link="${specialty.name}">
      <span class="specialty-icon" aria-hidden="true">${specialty.icon}</span>
      <span class="specialty-arrow" aria-hidden="true">↗</span>
      <h3>${specialty.name}</h3>
      <p>${specialty.description}</p>
    </a>
  `).join("");

  specialties.forEach(specialty => {
    const option = document.createElement("option");
    option.value = specialty.name;
    option.textContent = specialty.name;
    specialtyFilter.appendChild(option);

    const appointmentOption = document.createElement("option");
    appointmentOption.value = specialty.name;
    appointmentOption.textContent = specialty.name;
    appointmentSpecialty.appendChild(appointmentOption);
  });

  specialtyGrid.querySelectorAll("[data-specialty-link]").forEach(link => {
    link.addEventListener("click", () => {
      const specialty = link.dataset.specialtyLink;
      specialtyFilter.value = specialty;
      renderDoctors();
    });
  });
}

function renderDoctors() {
  const searchTerm = doctorSearch.value
    .trim()
    .toLocaleLowerCase("pt-BR");

  const selectedSpecialty = specialtyFilter.value;

  const filteredDoctors = doctors.filter(doctor => {
    const matchesSearch =
      doctor.name.toLocaleLowerCase("pt-BR").includes(searchTerm) ||
      doctor.specialty.toLocaleLowerCase("pt-BR").includes(searchTerm);

    const matchesSpecialty =
      !selectedSpecialty || doctor.specialty === selectedSpecialty;

    return matchesSearch && matchesSpecialty;
  });

  doctorGrid.innerHTML = filteredDoctors.map(doctor => `
    <article class="doctor-card">
      <div class="doctor-card-top">
        <div class="doctor-avatar" aria-hidden="true">
          ${createInitials(doctor.name)}
        </div>
        <div>
          <h3>${doctor.name}</h3>
          <p class="doctor-specialty">${doctor.specialty}</p>
        </div>
      </div>
      <div class="doctor-card-bottom">
        <small>Equipe médica MedVitta</small>
        <a class="doctor-book" href="#agendamento"
           data-doctor="${doctor.name}"
           data-doctor-specialty="${doctor.specialty}">
          Solicitar consulta ↗
        </a>
      </div>
    </article>
  `).join("");

  emptyState.hidden = filteredDoctors.length > 0;

  doctorGrid.querySelectorAll("[data-doctor]").forEach(link => {
    link.addEventListener("click", () => {
      appointmentSpecialty.value = link.dataset.doctorSpecialty;
      updateAppointmentDoctors();
      appointmentDoctor.value = link.dataset.doctor;
    });
  });
}

function updateAppointmentDoctors() {
  const selectedSpecialty = appointmentSpecialty.value;
  const previousDoctor = appointmentDoctor.value;

  const availableDoctors = doctors.filter(doctor =>
    !selectedSpecialty || doctor.specialty === selectedSpecialty
  );

  appointmentDoctor.innerHTML = "";

  const defaultOption = document.createElement("option");
  defaultOption.value = "";
  defaultOption.textContent = "Qualquer profissional";
  appointmentDoctor.appendChild(defaultOption);

  availableDoctors.forEach(doctor => {
    const option = document.createElement("option");
    option.value = doctor.name;
    option.textContent = `${doctor.name} · ${doctor.specialty}`;
    appointmentDoctor.appendChild(option);
  });

  if (availableDoctors.some(doctor => doctor.name === previousDoctor)) {
    appointmentDoctor.value = previousDoctor;
  }
}

specialtyFilter.addEventListener("change", renderDoctors);
doctorSearch.addEventListener("input", renderDoctors);
appointmentSpecialty.addEventListener("change", updateAppointmentDoctors);

const menuToggle = document.querySelector("#menu-toggle");
const mainNav = document.querySelector("#main-nav");

menuToggle.addEventListener("click", () => {
  const isOpen = mainNav.classList.toggle("open");
  menuToggle.setAttribute("aria-expanded", String(isOpen));
  menuToggle.setAttribute(
    "aria-label",
    isOpen ? "Fechar menu" : "Abrir menu"
  );
  menuToggle.textContent = isOpen ? "×" : "☰";
});

mainNav.querySelectorAll("a").forEach(link => {
  link.addEventListener("click", () => {
    mainNav.classList.remove("open");
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "Abrir menu");
    menuToggle.textContent = "☰";
  });
});

const appointmentForm = document.querySelector("#appointment-form");
const formMessage = document.querySelector("#form-message");

appointmentForm.addEventListener("submit", event => {
  event.preventDefault();

  if (!appointmentForm.reportValidity()) return;

  formMessage.textContent =
    "Formulário preenchido! Este site é demonstrativo e ainda não envia solicitações. Para receber agendamentos reais, será necessário conectar um serviço de atendimento.";
  formMessage.classList.add("visible");
});

document.querySelector("#current-year").textContent =
  new Date().getFullYear();

renderSpecialties();
renderDoctors();
updateAppointmentDoctors();

