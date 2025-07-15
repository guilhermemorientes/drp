// DOM Elements
const leadForm = document.getElementById("leadForm")
const submitBtn = document.querySelector(".form-submit")
const notificationContainer = document.createElement("div") // Create a container for notifications
notificationContainer.id = "notification-container"
document.body.appendChild(notificationContainer)

// Smooth scrolling and animations
document.addEventListener("DOMContentLoaded", () => {
  const nav = document.querySelector(".nav")
  const navToggle = document.getElementById("navToggle")
  const navMenu = document.getElementById("navMenu")
  const navLinks = document.querySelectorAll(".nav-link")

  // Mobile menu toggle
  navToggle.addEventListener("click", () => {
    navToggle.classList.toggle("active")
    navMenu.classList.toggle("active")
  })

  // Close mobile menu when clicking on links
  navLinks.forEach((link) => {
    link.addEventListener("click", () => {
      navToggle.classList.remove("active")
      navMenu.classList.remove("active")
    })
  })

  // Navigation scroll effect and active states
  const sections = document.querySelectorAll("section[id]")

  function updateActiveNav() {
    const scrollY = window.pageYOffset

    sections.forEach((section) => {
      const sectionHeight = section.offsetHeight
      const sectionTop = section.offsetTop - 100 // Adjust offset for fixed header
      const sectionId = section.getAttribute("id")
      const navLink = document.querySelector(`.nav-link[data-section="${sectionId}"]`)

      if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
        navLinks.forEach((link) => link.classList.remove("active"))
        if (navLink) navLink.classList.add("active")
      }
    })

    // Navigation background effect
    if (scrollY > 50) {
      nav.classList.add("scrolled")
    } else {
      nav.classList.remove("scrolled")
    }
  }

  window.addEventListener("scroll", updateActiveNav)
  updateActiveNav() // Initial call to set active state and nav background

  // Clients carousel infinite scroll
  const carouselTrack = document.getElementById("produtosCarousel")
  if (carouselTrack) {
    // Clone items for infinite scroll
    const items = Array.from(carouselTrack.children)
    items.forEach((item) => {
      carouselTrack.appendChild(item.cloneNode(true))
    })
  }

  // Smooth scroll for navigation links
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault()
      const targetId = this.getAttribute("href")
      const target = document.querySelector(targetId)
      if (target) {
        const offsetTop = target.offsetTop - 80 // Adjust for fixed header height
        window.scrollTo({
          top: offsetTop,
          behavior: "smooth",
        })
      }
    })
  })

  // Intersection Observer for animations (if you want to add a class like 'animate-fade-in-up')
  // This part was in the original JS but no corresponding CSS for 'animate-fade-in-up' was provided.
  // If you want animations, you'll need to add the CSS for them.
  // For now, I'll keep the observer logic but comment out the class addition.
  const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px",
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible") // Use a simple class for visibility
        // entry.target.classList.add("animate-fade-in-up"); // Uncomment if you add this CSS animation
      } else {
        entry.target.classList.remove("is-visible") // Remove if not intersecting
      }
    })
  }, observerOptions)

  // Observe elements for animation
  const animateElements = document.querySelectorAll(
    ".especialidade-item, .equipe-card, .resultados-item, .contact-feature",
  )

  animateElements.forEach((el) => {
    observer.observe(el)
  })

  // Form handling
  if (leadForm) {
    leadForm.addEventListener("submit", async (e) => {
      e.preventDefault()

      // Get form data
      const formData = new FormData(leadForm)
      const data = Object.fromEntries(formData)

      // Validate required fields
      const requiredFields = ["nome", "email", "telefone", "convenio", "especialidade"]
      const missingFields = requiredFields.filter((field) => !data[field] || String(data[field]).trim() === "")

      if (missingFields.length > 0) {
        showNotification("Por favor, preencha todos os campos obrigatórios.", "error")
        return
      }

      // Validate email
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(String(data.email))) {
        showNotification("Por favor, insira um e-mail válido.", "error")
        return
      }

      // Show loading state
      submitBtn.disabled = true
      const originalText = submitBtn.innerHTML
      submitBtn.innerHTML = `
        <span class="spinner"></span>
        <span>Enviando...</span>
      `
      submitBtn.classList.add("loading")

      try {
        // Simulate API call
        await simulateFormSubmission(data)

        // Success
        showNotification("Solicitação enviada com sucesso! Entraremos em contato em até 2 horas.", "success")
        leadForm.reset()
      } catch (error) {
        console.error("Erro ao enviar formulário:", error)
        showNotification("Erro ao enviar formulário. Tente novamente ou entre em contato pelo WhatsApp.", "error")
      } finally {
        // Reset button state
        submitBtn.classList.remove("loading")
        submitBtn.disabled = false
        submitBtn.innerHTML = originalText
      }
    })
  }

  // Phone number formatting
  const phoneInput = document.getElementById("telefone")
  if (phoneInput) {
    phoneInput.addEventListener("input", (e) => {
      let value = e.target.value.replace(/\D/g, "") // Remove non-digits

      if (value.length <= 11) {
        if (value.length <= 2) {
          value = value.replace(/(\d{0,2})/, "($1")
        } else if (value.length <= 7) {
          value = value.replace(/(\d{2})(\d{0,5})/, "($1) $2")
        } else {
          value = value.replace(/(\d{2})(\d{5})(\d{0,4})/, "($1) $2-$3")
        }
      } else {
        value = value.substring(0, 11).replace(/(\d{2})(\d{5})(\d{0,4})/, "($1) $2-$3") // Limit to 11 digits
      }

      e.target.value = value
    })
  }
})

// Utility functions
function scrollToForm() {
  const contactSection = document.getElementById("contact")
  if (contactSection) {
    const offsetTop = contactSection.offsetTop - 80 // Adjust for fixed header
    window.scrollTo({
      top: offsetTop,
      behavior: "smooth",
    })
  }
}

function openWhatsApp() {
  const phone = "5511941472405"
  const message = "Olá! Vi o site da Clínica Dr. Polli e gostaria de agendar uma consulta."
  const url = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`
  window.open(url, "_blank")
}

async function simulateFormSubmission(data) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      // Simulate 95% success rate
      if (Math.random() > 0.05) {
        resolve(data)
      } else {
        reject(new Error("Simulation error"))
      }
    }, 2000)
  })
}

function showNotification(message, type = "info") {
  // Remove existing notifications
  const existingNotifications = notificationContainer.querySelectorAll(".notification")
  existingNotifications.forEach((notification) => notification.remove())

  // Create notification
  const notification = document.createElement("div")
  notification.className = `notification notification-${type}`
  notification.innerHTML = `
        <div class="notification-content">
            <span class="notification-icon">
                ${type === "success" ? "✅" : type === "error" ? "❌" : "ℹ️"}
            </span>
            <span class="notification-message">${message}</span>
            <button class="notification-close" aria-label="Fechar notificação">×</button>
        </div>
    `

  // Add styles (inline for simplicity, or move to CSS if preferred)
  notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 2rem;
        z-index: 10000;
        max-width: 400px;
        background: ${type === "success" ? "#00A894" : type === "error" ? "#EF4444" : "#3B82F6"};
        color: white;
        padding: 1rem;
        border-radius: 12px;
        box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
        animation: slideInRight 0.3s ease-out;
        font-weight: 500;
        opacity: 0; /* Start hidden for animation */
        transform: translateX(100%); /* Start off-screen for animation */
    `

  // Append to container and trigger animation
  notificationContainer.appendChild(notification)
  setTimeout(() => {
    notification.style.opacity = "1"
    notification.style.transform = "translateX(0)"
  }, 10) // Small delay to ensure CSS transition applies

  // Add close button functionality
  notification.querySelector(".notification-close").addEventListener("click", () => {
    notification.style.opacity = "0"
    notification.style.transform = "translateX(100%)"
    notification.addEventListener("transitionend", () => notification.remove())
  })

  // Auto remove after 5 seconds
  setTimeout(() => {
    if (notification.parentElement) {
      notification.style.opacity = "0"
      notification.style.transform = "translateX(100%)"
      notification.addEventListener("transitionend", () => notification.remove())
    }
  }, 5000)

  // Add animation keyframes if not already present
  if (!document.getElementById("notification-keyframes")) {
    const style = document.createElement("style")
    style.id = "notification-keyframes"
    style.textContent = `
        @keyframes slideInRight {
            from {
                transform: translateX(100%);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
        .notification-content {
            display: flex;
            align-items: center;
            gap: 0.75rem;
        }
        .notification-close {
            background: none;
            border: none;
            color: white;
            font-size: 1.25rem;
            cursor: pointer;
            margin-left: auto;
            opacity: 0.8;
            transition: opacity 0.2s;
        }
        .notification-close:hover {
            opacity: 1;
        }
        .form-submit.loading .spinner {
          border: 2px solid rgba(255, 255, 255, 0.3);
          border-top: 2px solid #fff;
          border-radius: 50%;
          width: 16px;
          height: 16px;
          animation: spin 1s linear infinite;
          display: inline-block;
          margin-right: 8px;
        }
        .form-submit.loading span:not(.spinner) {
          opacity: 0.8;
        }
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
    `
    document.head.appendChild(style)
  }
}
