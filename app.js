const state = {
  activeSection: "dashboard",
  selectedFile: null,
  notificationReady: false,
  requestId: null
};

const VALID_DEMO_HASH = "0x81b4c92f6d77fa890e4d4a9c";
const VALID_DEMO_CREDENTIAL = "UPAZ-MA-2026-004821";

const sectionTitles = {
  dashboard: "Buenos días, Javier",
  wallet: "Mi Wallet Académica",
  request: "Servicios de Registro",
  verify: "Verificación Pública",
  qr: "Escáner de Credenciales"
};

const credentialData = {
  master: {
    seal: "M",
    title: "Master of Arts in International Peace Studies",
    subtitle: "University for Peace · 18 June 2026",
    id: "UPAZ-MA-2026-004821",
    date: "18 junio 2026",
    hash: "0x81b4c92f6d77fa890e4d...4a9c",
    alt: false
  },

  certificate: {
    seal: "C",
    title: "Certificate in Human Rights & Peace Education",
    subtitle: "University for Peace · 03 December 2025",
    id: "UPAZ-CERT-2025-001774",
    date: "03 diciembre 2025",
    hash: "0x4fd2a183961bc44cfdd1...bc11",
    alt: true
  }
};

/* =====================================
   NAVEGACIÓN
===================================== */

function switchSection(id) {
  const section = document.getElementById(id);

  if (!section) return;

  document
    .querySelectorAll(".page-section")
    .forEach((el) => el.classList.remove("active"));

  document
    .querySelectorAll(".nav-item")
    .forEach((el) => el.classList.remove("active"));

  section.classList.add("active");

  document
    .querySelector(`.nav-item[data-section="${id}"]`)
    ?.classList.add("active");

  document.getElementById("pageTitle").textContent =
    sectionTitles[id] || "UPAZ Chain";

  state.activeSection = id;

  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });

  if (window.innerWidth <= 920) {
    document
      .getElementById("sidebar")
      .classList.remove("open");
  }
}

document
  .querySelectorAll(".nav-item")
  .forEach((btn) => {
    btn.addEventListener("click", () => {
      switchSection(btn.dataset.section);
    });
  });

document
  .querySelectorAll("[data-jump]")
  .forEach((btn) => {
    btn.addEventListener("click", () => {
      closeCredentialModal();
      switchSection(btn.dataset.jump);
    });
  });

document
  .getElementById("mobileMenu")
  .addEventListener("click", () => {
    document
      .getElementById("sidebar")
      .classList.toggle("open");
  });

document.addEventListener("click", (event) => {
  const sidebar =
    document.getElementById("sidebar");

  const menu =
    document.getElementById("mobileMenu");

  const notificationWrap =
    document.querySelector(".notification-wrap");

  if (
    window.innerWidth <= 920 &&
    sidebar.classList.contains("open") &&
    !sidebar.contains(event.target) &&
    !menu.contains(event.target)
  ) {
    sidebar.classList.remove("open");
  }

  if (
    notificationWrap &&
    !notificationWrap.contains(event.target)
  ) {
    document
      .getElementById("notificationPanel")
      ?.classList.add("hidden");
  }
});

/* =====================================
   MODAL DE CREDENCIAL DE WALLET
===================================== */

function openCredentialModal(type) {
  const data =
    credentialData[type] ||
    credentialData.master;

  const modal =
    document.getElementById(
      "credentialModal"
    );

  const seal =
    document.getElementById(
      "modalSeal"
    );

  seal.textContent =
    data.seal;

  seal.classList.toggle(
    "alt",
    data.alt
  );

  document.getElementById(
    "modalTitle"
  ).textContent = data.title;

  document.getElementById(
    "modalSubtitle"
  ).textContent = data.subtitle;

  document.getElementById(
    "modalId"
  ).textContent = data.id;

  document.getElementById(
    "modalDate"
  ).textContent = data.date;

  document.getElementById(
    "modalHash"
  ).textContent = data.hash;

  modal.classList.remove(
    "hidden"
  );

  document.body.style.overflow =
    "hidden";
}

function closeCredentialModal() {
  document
    .getElementById(
      "credentialModal"
    )
    .classList.add("hidden");

  document.body.style.overflow =
    "";
}

document
  .querySelectorAll(
    "[data-open-credential]"
  )
  .forEach((element) => {
    element.addEventListener(
      "click",
      () => {
        openCredentialModal(
          element.dataset.openCredential
        );
      }
    );
  });

document
  .getElementById(
    "closeCredentialModal"
  )
  .addEventListener(
    "click",
    closeCredentialModal
  );

document
  .getElementById(
    "credentialModal"
  )
  .addEventListener(
    "click",
    (event) => {
      if (
        event.target.id ===
        "credentialModal"
      ) {
        closeCredentialModal();
      }
    }
  );

/* =====================================
   CERTIFICADO FICTICIO
===================================== */

function openTestCertificateModal() {
  document
    .getElementById(
      "notificationPanel"
    )
    ?.classList.add("hidden");

  document
    .getElementById(
      "testCertificateModal"
    )
    .classList.remove("hidden");

  document.body.style.overflow =
    "hidden";

  markNotificationAsRead();
}

function closeTestCertificateModal() {
  document
    .getElementById(
      "testCertificateModal"
    )
    .classList.add("hidden");

  document.body.style.overflow =
    "";
}

document
  .getElementById(
    "closeTestCertificateModal"
  )
  .addEventListener(
    "click",
    closeTestCertificateModal
  );

document
  .getElementById(
    "closeTestCertificateAction"
  )
  .addEventListener(
    "click",
    closeTestCertificateModal
  );

document
  .getElementById(
    "testCertificateModal"
  )
  .addEventListener(
    "click",
    (event) => {
      if (
        event.target.id ===
        "testCertificateModal"
      ) {
        closeTestCertificateModal();
      }
    }
  );

document
  .getElementById(
    "copyTestHash"
  )
  .addEventListener(
    "click",
    () => {
      navigator.clipboard?.writeText(
        "0xd3a09f24c7e6418b55f0a1129e7c2026"
      );

      showToast(
        "Hash de prueba copiado",
        "Este hash pertenece únicamente al certificado ficticio de la demo."
      );
    }
  );

document.addEventListener(
  "keydown",
  (event) => {
    if (
      event.key === "Escape"
    ) {
      closeCredentialModal();
      closeTestCertificateModal();
    }
  }
);

/* =====================================
   TOASTS
===================================== */

let toastTimer;

function showToast(
  title,
  message
) {
  const toast =
    document.getElementById(
      "toast"
    );

  document.getElementById(
    "toastTitle"
  ).textContent = title;

  document.getElementById(
    "toastMessage"
  ).textContent = message;

  toast.classList.add("show");

  clearTimeout(
    toastTimer
  );

  toastTimer =
    setTimeout(() => {
      toast.classList.remove(
        "show"
      );
    }, 3200);
}

/* =====================================
   NOTIFICACIONES
===================================== */

const notificationBtn =
  document.getElementById(
    "notificationBtn"
  );

const notificationPanel =
  document.getElementById(
    "notificationPanel"
  );

const notificationDot =
  document.getElementById(
    "notificationDot"
  );

const notificationCount =
  document.getElementById(
    "notificationCount"
  );

const notificationEmpty =
  document.getElementById(
    "notificationEmpty"
  );

const requestNotification =
  document.getElementById(
    "requestNotification"
  );

notificationBtn.addEventListener(
  "click",
  (event) => {
    event.stopPropagation();

    notificationPanel.classList.toggle(
      "hidden"
    );
  }
);

requestNotification.addEventListener(
  "click",
  openTestCertificateModal
);

function publishRequestNotification(
  requestId
) {
  state.notificationReady =
    true;

  document.getElementById(
    "notificationRequestId"
  ).textContent = requestId;

  notificationEmpty.classList.add(
    "hidden"
  );

  requestNotification.classList.remove(
    "hidden"
  );

  notificationDot.classList.remove(
    "hidden"
  );

  notificationCount.classList.remove(
    "hidden"
  );

  const status =
    document.getElementById(
      "requestStatus"
    );

  status.classList.add(
    "ready"
  );

  document.getElementById(
    "requestStatusText"
  ).textContent =
    "Respuesta recibida. El certificado de prueba ya está disponible en Notificaciones.";

  document.getElementById(
    "requestStatusPill"
  ).textContent =
    "Listo";

  showToast(
    "Nueva notificación",
    "Registro Académico respondió tu solicitud. Abre la campana para ver el certificado ficticio."
  );
}

function markNotificationAsRead() {
  notificationDot.classList.add(
    "hidden"
  );

  notificationCount.classList.add(
    "hidden"
  );
}

/* =====================================
   ACCIONES DE WALLET
===================================== */

document
  .getElementById(
    "shareWalletBtn"
  )
  .addEventListener(
    "click",
    () => {
      navigator.clipboard?.writeText(
        "https://verify.upeace.demo/wallet/UPZ-2025-04821"
      );

      showToast(
        "Enlace generado",
        "Se copió un enlace temporal de demostración."
      );
    }
  );

document
  .getElementById(
    "copyCredentialLink"
  )
  .addEventListener(
    "click",
    () => {
      navigator.clipboard?.writeText(
        "https://verify.upeace.demo/c/UPAZ-MA-2026-004821"
      );

      showToast(
        "Enlace copiado",
        "La credencial ya puede compartirse de forma segura."
      );
    }
  );

/* =====================================
   SOLICITUD DE CERTIFICADO
===================================== */

document
  .querySelectorAll(
    ".choice-card"
  )
  .forEach((card) => {
    card.addEventListener(
      "click",
      () => {
        document
          .querySelectorAll(
            ".choice-card"
          )
          .forEach((item) => {
            item.classList.remove(
              "selected"
            );
          });

        card.classList.add(
          "selected"
        );

        card.querySelector(
          "input"
        ).checked = true;
      }
    );
  });

document
  .getElementById(
    "certificateForm"
  )
  .addEventListener(
    "submit",
    (event) => {
      event.preventDefault();

      const type =
        document.getElementById(
          "certificateType"
        ).value;

      const requestId =
        `SOL-2026-${String(
          Math.floor(
            19000 +
            Math.random() * 900
          )
        ).padStart(
          5,
          "0"
        )}`;

      state.requestId =
        requestId;

      document
        .querySelectorAll(
          ".progress-step"
        )
        .forEach(
          (step) =>
            step.classList.add(
              "active"
            )
        );

      document
        .getElementById(
          "requestStatus"
        )
        .classList.remove(
          "hidden",
          "ready"
        );

      document.getElementById(
        "requestStatusId"
      ).textContent =
        requestId;

      document.getElementById(
        "requestStatusText"
      ).textContent =
        "Procesando respuesta de Registro Académico…";

      document.getElementById(
        "requestStatusPill"
      ).textContent =
        "En proceso";

      showToast(
        "Solicitud enviada",
        `${type} quedó registrada con el ID ${requestId}.`
      );

      setTimeout(
        () =>
          publishRequestNotification(
            requestId
          ),
        1700
      );
    }
  );

/* =====================================
   TABS DE VERIFICACIÓN
===================================== */

document
  .querySelectorAll(
    ".verify-tab"
  )
  .forEach((tab) => {
    tab.addEventListener(
      "click",
      () => {
        document
          .querySelectorAll(
            ".verify-tab"
          )
          .forEach(
            (item) => {
              item.classList.remove(
                "active"
              );
            }
          );

        document
          .querySelectorAll(
            ".verify-pane"
          )
          .forEach(
            (pane) => {
              pane.classList.remove(
                "active"
              );
            }
          );

        tab.classList.add(
          "active"
        );

        document
          .getElementById(
            `verify-${tab.dataset.verifyTab}`
          )
          .classList.add(
            "active"
          );
      }
    );
  });

/* =====================================
   SUBIR PDF
===================================== */

const pdfInput =
  document.getElementById(
    "pdfInput"
  );

const dropzone =
  document.getElementById(
    "dropzone"
  );

const selectedFile =
  document.getElementById(
    "selectedFile"
  );

const selectedFileName =
  document.getElementById(
    "selectedFileName"
  );

function handleFile(file) {
  if (!file) return;

  if (
    !file.name
      .toLowerCase()
      .endsWith(".pdf")
  ) {
    showToast(
      "Archivo no compatible",
      "Selecciona un archivo PDF para continuar."
    );

    return;
  }

  state.selectedFile =
    file;

  selectedFileName.textContent =
    file.name;

  selectedFile.classList.remove(
    "hidden"
  );

  showToast(
    "Documento cargado",
    "El archivo está listo para la simulación de verificación."
  );
}

pdfInput.addEventListener(
  "change",
  (event) => {
    handleFile(
      event.target.files[0]
    );
  }
);

[
  "dragenter",
  "dragover"
].forEach(
  (eventName) => {
    dropzone.addEventListener(
      eventName,
      (event) => {
        event.preventDefault();

        dropzone.classList.add(
          "dragover"
        );
      }
    );
  }
);

[
  "dragleave",
  "drop"
].forEach(
  (eventName) => {
    dropzone.addEventListener(
      eventName,
      (event) => {
        event.preventDefault();

        dropzone.classList.remove(
          "dragover"
        );
      }
    );
  }
);

dropzone.addEventListener(
  "drop",
  (event) => {
    handleFile(
      event.dataTransfer.files[0]
    );
  }
);

/* =====================================
   RESULTADOS DE VERIFICACIÓN
===================================== */

function hideVerificationResults() {
  document
    .getElementById(
      "verifyResult"
    )
    .classList.add(
      "hidden"
    );

  document
    .getElementById(
      "verifyInvalidResult"
    )
    .classList.add(
      "hidden"
    );
}

function simulateVerificationSuccess(
  source = "documento"
) {
  hideVerificationResults();

  showToast(
    "Consultando red simulada",
    `Buscando ${source} en UPAZ Academic Testnet...`
  );

  setTimeout(() => {
    const result =
      document.getElementById(
        "verifyResult"
      );

    result.classList.remove(
      "hidden"
    );

    result.scrollIntoView({
      behavior: "smooth",
      block: "center"
    });
  }, 900);
}

function simulateVerificationFailure({
  title,
  message,
  value
}) {
  hideVerificationResults();

  showToast(
    "Consultando red simulada",
    "Comparando la entrada contra los registros académicos..."
  );

  setTimeout(() => {
    document.getElementById(
      "invalidResultTitle"
    ).textContent =
      title;

    document.getElementById(
      "invalidResultMessage"
    ).textContent =
      message;

    document.getElementById(
      "invalidInputValue"
    ).textContent =
      value ||
      "No disponible";

    const result =
      document.getElementById(
        "verifyInvalidResult"
      );

    result.classList.remove(
      "hidden"
    );

    result.scrollIntoView({
      behavior: "smooth",
      block: "center"
    });
  }, 900);
}

/* =====================================
   VALIDACIÓN DE PDF
===================================== */

function isDemoValidPdf(file) {
  const name =
    file.name.toLowerCase();

  return [
    "upeace",
    "upaz",
    "titulo",
    "certificado"
  ].some(
    (word) =>
      name.includes(word)
  );
}

document
  .getElementById(
    "verifyPdfBtn"
  )
  .addEventListener(
    "click",
    () => {
      if (
        !state.selectedFile
      ) {
        showToast(
          "Selecciona un PDF",
          "Primero carga un documento para continuar."
        );

        return;
      }

      if (
        isDemoValidPdf(
          state.selectedFile
        )
      ) {
        simulateVerificationSuccess(
          "la huella digital del PDF"
        );
      } else {
        simulateVerificationFailure({
          title:
            "Documento no reconocido o modificado",

          message:
            "La huella calculada para este PDF no coincide con ningún documento registrado por UPAZ en la red académica simulada.",

          value:
            `PDF: ${state.selectedFile.name}`
        });
      }
    }
  );

/* =====================================
   VALIDACIÓN DE HASH
===================================== */

document
  .getElementById(
    "verifyHashBtn"
  )
  .addEventListener(
    "click",
    () => {
      const input =
        document.getElementById(
          "hashInput"
        );

      const value =
        input.value.trim();

      if (!value) {
        showToast(
          "Ingresa un hash",
          "Pega un hash para realizar la búsqueda."
        );

        return;
      }

      if (
        value.toLowerCase() ===
        VALID_DEMO_HASH.toLowerCase()
      ) {
        simulateVerificationSuccess(
          "el hash"
        );
      } else {
        simulateVerificationFailure({
          title:
            "Hash no encontrado",

          message:
            "No existe una transacción o credencial asociada con el hash ingresado en UPAZ Academic Testnet.",

          value
        });
      }
    }
  );

/* =====================================
   VALIDACIÓN DE ID DE CREDENCIAL
===================================== */

document
  .getElementById(
    "verifyCredentialBtn"
  )
  .addEventListener(
    "click",
    () => {
      const input =
        document.getElementById(
          "credentialInput"
        );

      const value =
        input.value.trim();

      if (!value) {
        showToast(
          "Ingresa un ID",
          "Escribe el identificador de la credencial para continuar."
        );

        return;
      }

      if (
        value.toUpperCase() ===
        VALID_DEMO_CREDENTIAL
      ) {
        simulateVerificationSuccess(
          "la credencial"
        );
      } else {
        simulateVerificationFailure({
          title:
            "ID de credencial inexistente",

          message:
            "El identificador ingresado no coincide con ninguna credencial académica disponible en la red simulada.",

          value
        });
      }
    }
  );

/* =====================================
   COPIAR DATOS BLOCKCHAIN
===================================== */

document
  .querySelectorAll(
    "[data-copy]"
  )
  .forEach(
    (button) => {
      button.addEventListener(
        "click",
        () => {
          navigator.clipboard?.writeText(
            button.dataset.copy
          );

          showToast(
            "Dato copiado",
            "El valor fue enviado al portapapeles."
          );
        }
      );
    }
  );

/* =====================================
   QR VISUAL
   NO ES UN QR REAL
===================================== */

function generatePseudoQr(
  element,
  size,
  density = 0.46
) {
  if (!element) return;

  element.innerHTML = "";

  element.style.gridTemplateColumns =
    `repeat(${size}, 1fr)`;

  element.style.gridTemplateRows =
    `repeat(${size}, 1fr)`;

  const deterministic = (
    row,
    col
  ) => {
    const seed =
      (
        row * 17 +
        col * 31 +
        row *
        col *
        7 +
        11
      ) % 100;

    return (
      seed / 100 <
      density
    );
  };

  for (
    let row = 0;
    row < size;
    row++
  ) {
    for (
      let col = 0;
      col < size;
      col++
    ) {
      const cell =
        document.createElement(
          "i"
        );

      if (
        deterministic(
          row,
          col
        )
      ) {
        cell.classList.add(
          "on"
        );
      }

      element.appendChild(
        cell
      );
    }
  }
}

generatePseudoQr(
  document.getElementById(
    "previewQr"
  ),
  9,
  0.44
);

generatePseudoQr(
  document.getElementById(
    "mainQr"
  ),
  21,
  0.43
);

generatePseudoQr(
  document.getElementById(
    "testCertificateQr"
  ),
  9,
  0.44
);

/* =====================================
   ESCANEO QR
===================================== */

document
  .getElementById(
    "scanQrBtn"
  )
  .addEventListener(
    "click",
    () => {
      showToast(
        "QR detectado",
        "Leyendo identificador y consultando la red simulada..."
      );

      setTimeout(() => {
        document
          .getElementById(
            "scanEmpty"
          )
          .classList.add(
            "hidden"
          );

        document
          .getElementById(
            "scanData"
          )
          .classList.remove(
            "hidden"
          );
      }, 900);
    }
  );

/* =====================================
   FILTROS WALLET
===================================== */

document
  .querySelectorAll(
    ".filter-chip"
  )
  .forEach(
    (chip) => {
      chip.addEventListener(
        "click",
        () => {
          document
            .querySelectorAll(
              ".filter-chip"
            )
            .forEach(
              (item) => {
                item.classList.remove(
                  "active"
                );
              }
            );

          chip.classList.add(
            "active"
          );

          showToast(
            "Filtro actualizado",
            `Mostrando: ${chip.textContent}.`
          );
        }
      );
    }
  );

/* =====================================
   ANIMACIONES DE ENTRADA
===================================== */

const observer =
  new IntersectionObserver(
    (entries) => {
      entries.forEach(
        (entry) => {
          if (
            entry.isIntersecting
          ) {
            entry.target.animate(
              [
                {
                  opacity: 0,
                  transform:
                    "translateY(10px)"
                },
                {
                  opacity: 1,
                  transform:
                    "translateY(0)"
                }
              ],
              {
                duration: 420,
                easing: "ease-out",
                fill: "both"
              }
            );

            observer.unobserve(
              entry.target
            );
          }
        }
      );
    },
    {
      threshold: 0.12
    }
  );

document
  .querySelectorAll(
    ".panel, .metric-card, .wallet-card"
  )
  .forEach(
    (element) => {
      observer.observe(
        element
      );
    }
  );