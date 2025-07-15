// DOM Elements
const leadForm = document.getElementById("leadForm")
const submitBtn = document.querySelector(".form-submit")

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
      const sectionTop = section.offsetTop - 100
      const sectionId = section.getAttribute("id")
      const navLink = document.querySelector(`.nav-link[data-section="${sectionId}"]`)

      if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
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
  updateActiveNav() // Initial call

  // Clients carousel infinite scroll
  const carousel = document.getElementById("produtosCarousel")
  if (carousel) {
    // Clone items for infinite scroll
    const items = carousel.innerHTML
    carousel.innerHTML = items + items
  }

  // Smooth scroll for navigation links
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault()
      const target = document.querySelector(this.getAttribute("href"))
      if (target) {
        const offsetTop = target.offsetTop - 80
        window.scrollTo({
          top: offsetTop,
          behavior: "smooth",
        })
      }
    })
  })

  // Intersection Observer for animations
  const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px",
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("animate-fade-in-up")
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
      const missingFields = requiredFields.filter((field) => !data[field] || data[field].trim() === "")

      if (missingFields.length > 0) {
        showNotification("Por favor, preencha todos os campos obrigatórios.", "error")
        return
      }

      // Validate email
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(data.email)) {
        showNotification("Por favor, insira um e-mail válido.", "error")
        return
      }

      // Show loading state
      submitBtn.classList.add("loading")
      submitBtn.disabled = true
      const originalText = submitBtn.innerHTML
      submitBtn.innerHTML = "<span>Enviando...</span>"

      try {
        // Simulate API call
        await simulateFormSubmission(data)

        // Success
        showNotification("Solicitação enviada com sucesso! Entraremos em contato em até 2 horas.", "success")
        leadForm.reset()

        // Track conversion
        trackConversion("lead_form_submission", data)
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
      let value = e.target.value.replace(/\D/g, "")

      if (value.length <= 11) {
        if (value.length <= 2) {
          value = value.replace(/(\d{0,2})/, "($1")
        } else if (value.length <= 7) {
          value = value.replace(/(\d{2})(\d{0,5})/, "($1) $2")
        } else {
          value = value.replace(/(\d{2})(\d{5})(\d{0,4})/, "($1) $2-$3")
        }
      }

      e.target.value = value
    })
  }
})

// Utility functions
function scrollToForm() {
  document.getElementById("contact").scrollIntoView({
    behavior: "smooth",
    block: "start",
  })
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
  const existingNotifications = document.querySelectorAll(".notification")
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
            <button class="notification-close" onclick="this.parentElement.parentElement.remove()">×</button>
        </div>
    `

  // Add styles
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
    `

  const style = document.createElement("style")
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
    `

  document.head.appendChild(style)
  document.body.appendChild(notification)

  // Auto remove after 5 seconds
  setTimeout(() => {
    if (notification.parentElement) {
      notification.remove()
    }
  }, 5000)
}

function trackConversion(eventName, data) {
  // Google Analytics 4
  const gtag = window.gtag
  if (typeof gtag !== "undefined") {
    gtag("event", eventName, {
      custom_parameter: data.especialidade,
      value: 150,
      currency: "BRL",
    })
  }

  // Facebook Pixel
  const fbq = window.fbq
  if (typeof fbq !== "undefined") {
    fbq("track", "Lead", {
      content_category: data.especialidade,
      value: 150,
      currency: "BRL",
    })
  }

  // Console log for debugging
  console.log("🎯 Conversion tracked:", eventName, data)
}

// Performance monitoring
window.addEventListener("load", () => {
  const loadTime = performance.timing.loadEventEnd - performance.timing.navigationStart
  console.log(`⚡ Page loaded in ${loadTime}ms`)

  // Track performance
  const gtag = window.gtag
  if (typeof gtag !== "undefined") {
    gtag("event", "page_load_time", {
      value: Math.round(loadTime / 1000),
    })
  }
})

console.log("🦷 Clínica Dr. Polli website loaded successfully! 🦷")
