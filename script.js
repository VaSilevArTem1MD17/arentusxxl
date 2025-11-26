document.addEventListener("DOMContentLoaded", () => {
  const mobileMenuBtn = document.getElementById("mobileMenuBtn")
  const mobileDropdown = document.getElementById("mobileDropdown")

  mobileMenuBtn.addEventListener("click", (e) => {
    e.stopPropagation()
    mobileDropdown.classList.toggle("show")
  })

  document.addEventListener("click", () => {
    mobileDropdown.classList.remove("show")
  })

  mobileDropdown.addEventListener("click", (e) => {
    e.stopPropagation()
  })

  const feedbackForm = document.getElementById("feedbackForm")
  const formStatus = document.getElementById("formStatus")

  if (feedbackForm) {
    feedbackForm.addEventListener("submit", async (e) => {
      e.preventDefault()

      const submitBtn = feedbackForm.querySelector(".feedback-btn")
      submitBtn.disabled = true
      submitBtn.textContent = "Отправка..."

      const formData = {
        name: document.getElementById("name").value.trim(),
        email: document.getElementById("email").value.trim(),
        message: document.getElementById("message").value.trim(),
      }

      try {
        const response = await fetch("/api/feedback", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        })

        const data = await response.json()

        if (response.ok) {
          formStatus.textContent = "✓ Сообщение успешно отправлено! Спасибо за обратную связь."
          formStatus.className = "form-status success"
          feedbackForm.reset()

          setTimeout(() => {
            formStatus.className = "form-status"
          }, 5000)
        } else {
          throw new Error(data.error || "Ошибка отправки")
        }
      } catch (error) {
        console.error("Error:", error)
        formStatus.textContent = "✗ Ошибка отправки. Пожалуйста, попробуйте позже."
        formStatus.className = "form-status error"
      } finally {
        submitBtn.disabled = false
        submitBtn.textContent = "Отправить"
      }
    })
  }
})

document.addEventListener("DOMContentLoaded", () => {
  const scroller = document.querySelector(".scroller")
  const originalItems = document.querySelectorAll(".item:not(.clone)")
  const prevBtn = document.querySelector(".prev")
  const nextBtn = document.querySelector(".next")
  const container = document.querySelector(".scroller-container")

  const firstClone = originalItems[originalItems.length - 1].cloneNode(true)
  const secondClone = originalItems[originalItems.length - 2].cloneNode(true)
  const lastClone = originalItems[0].cloneNode(true)
  const prelastClone = originalItems[1].cloneNode(true)
  firstClone.classList.add("clone")
  lastClone.classList.add("clone")
  secondClone.classList.add("clone")
  prelastClone.classList.add("clone")

  scroller.insertBefore(secondClone, originalItems[0])
  scroller.insertBefore(firstClone, originalItems[0])
  scroller.appendChild(lastClone)
  scroller.appendChild(prelastClone)

  //коллекция
  const allItems = document.querySelectorAll(".item")
  let currentIndex = 2
  let itemWidth = originalItems[0].offsetWidth + 30 //gap

  function centerItem(index) {
    const containerWidth = scroller.offsetWidth
    const scrollPosition = index * itemWidth - (containerWidth / 2 - itemWidth / 2)

    scroller.style.transition = "transform 0.5s ease"
    scroller.style.transform = `translateX(-${scrollPosition}px)`

    allItems.forEach((item) => item.classList.remove("active"))
    if (index > 0 && index < allItems.length - 1) {
      allItems[index].classList.add("active")
    }
  }

  //!!!!!!
  function goToNext() {
    currentIndex++

    if (currentIndex >= allItems.length - 2) {
      setTimeout(() => {
        scroller.style.transition = "none"
        currentIndex = 2
        centerItem(currentIndex)
      }, 0)
      scroller.style.transition = "transform 0s ease"
    }

    centerItem(currentIndex)
  }

  function goToPrev() {
    currentIndex--

    if (currentIndex <= 1) {
      setTimeout(() => {
        scroller.style.transition = "none"
        currentIndex = allItems.length - 3
        centerItem(currentIndex)
      }, 0)
      scroller.style.transition = "transform 0s ease"
    }

    centerItem(currentIndex)
  }

  function updateSizes() {
    itemWidth = originalItems[0].offsetWidth + 30
    centerItem(currentIndex)
  }

  updateSizes()

  prevBtn.addEventListener("click", goToPrev)
  nextBtn.addEventListener("click", goToNext)

  //мобилки
  let touchStartX = 0

  container.addEventListener(
    "touchstart",
    (e) => {
      touchStartX = e.changedTouches[0].screenX
    },
    { passive: true },
  )

  container.addEventListener(
    "touchend",
    (e) => {
      const touchEndX = e.changedTouches[0].screenX
      const threshold = 50

      if (touchEndX < touchStartX - threshold) {
        goToNext()
      } else if (touchEndX > touchStartX + threshold) {
        goToPrev()
      }
    },
    { passive: true },
  )

  window.addEventListener("resize", () => {
    scroller.style.transition = "none"
    updateSizes()
  })
})

document.addEventListener("DOMContentLoaded", () => {
  const settings = {
    root: null,
    rootMargin: "5px",
    threshold: 0.2,
  }

  const callback = (entries, viewer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("active")
      } else {
        entry.target.classList.remove("active")
      }
    })
  }

  const viewer = new IntersectionObserver(callback, settings)
  const targets = document.querySelectorAll(".animr, .animl, .animu, .animc, .anime")

  targets.forEach((target) => {
    viewer.observe(target)
  })
})
