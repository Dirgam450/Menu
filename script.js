// JSON dosyasından verileri yükle
async function loadMenu() {
    try {
        const response = await fetch("menu.json");
        if (!response.ok) {
            throw new Error("Menü yüklenemedi");
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Veri yükleme hatası:", error);
        showError("Üzgünüz, menü yüklenirken bir hata oluştu. Lütfen tekrar deneyin.");
        return null;
    }
}

// Hata mesajı göster
function showError(message) {
    const loadingElement = document.getElementById("loading");
    loadingElement.innerHTML = `
        <div class="text-center py-20">
            <div class="text-red-500 text-6xl mb-4">⚠️</div>
            <p class="text-xl text-red-600">${message}</p>
            <button onclick="location.reload()" class="mt-4 bg-red-500 text-white px-6 py-2 rounded-lg hover:bg-red-600 transition-colors">
                Tekrar Dene
            </button>
        </div>
    `;
}

// Navigasyon menüsü oluştur
function createNavigation(categories) {
    const nav = document.getElementById("category-nav");
    nav.innerHTML = categories.map(category => `
        <li>
            <a href="#${category.name.replace(/\s+/g, "-")}" 
               class="text-gray-700 hover:text-amber-600 font-medium transition-colors duration-200 px-3 sm:px-4 py-2 rounded-lg hover:bg-amber-50 text-sm sm:text-base whitespace-nowrap">
                ${category.name}
            </a>
        </li>
    `).join("");
}

// Yemek kartı oluştur
function createDishCard(dish) {
    const iconsHtml = dish.icons.map(icon => `<span class="text-base sm:text-lg">${icon}</span>`).join(" ");
    
    return `
        <div class="dish-card bg-white rounded-xl shadow-md overflow-hidden">
            <div class="relative">
                <img src="${dish.image}" alt="${dish.name}" 
                     class="w-full h-40 sm:h-48 object-cover"
                     onerror="this.src=\'https://via.placeholder.com/300x200/f3f4f6/9ca3af?text=Resim+Yok\'">
                <div class="absolute top-2 sm:top-3 left-2 sm:left-3 bg-white rounded-full px-2 sm:px-3 py-1 shadow-md">
                    <span class="text-amber-600 font-bold text-sm sm:text-base">${dish.price}</span>
                </div>
                ${iconsHtml ? `<div class="absolute top-2 sm:top-3 right-2 sm:right-3 bg-white rounded-full px-2 py-1 shadow-md flex gap-1">${iconsHtml}</div>` : ""}
            </div>
            <div class="p-4 sm:p-6">
                <h3 class="text-lg sm:text-xl font-bold text-gray-800 mb-2">${dish.name}</h3>
                <p class="text-gray-600 leading-relaxed text-sm sm:text-base">${dish.description}</p>
            </div>
        </div>
    `;
}

// Kategori bölümü oluştur
function createCategorySection(category) {
    const dishesHtml = category.dishes.map(dish => createDishCard(dish)).join("");
    
    return `
        <section id="${category.name.replace(/\s+/g, "-")}" class="category-section mb-12 sm:mb-16">
            <div class="text-center mb-6 sm:mb-8">
                <h2 class="text-2xl sm:text-3xl font-bold text-gray-800 mb-3 sm:mb-4">${category.name}</h2>
                <div class="w-16 sm:w-24 h-1 bg-gradient-to-r from-amber-500 to-orange-500 mx-auto rounded-full"></div>
            </div>
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
                ${dishesHtml}
            </div>
        </section>
    `;
}

// Menüyü göster
function displayMenu(menuData) {
    const menuContent = document.getElementById("menu-content");
    const categoriesHtml = menuData.categories.map(category => createCategorySection(category)).join("");
    
    menuContent.innerHTML = categoriesHtml;
    
    // Yükleme ekranını gizle
    document.getElementById("loading").style.display = "none";
    
    // Navigasyon menüsü oluştur
    createNavigation(menuData.categories);
    
    // Yumuşak kaydırma efekti ekle
    addSmoothScrolling();
}

// Yumuşak kaydırma efekti ekle
function addSmoothScrolling() {
    document.querySelectorAll("a[href^=\"#\"]").forEach(anchor => {
        anchor.addEventListener("click", function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute("href"));
            if (target) {
                target.scrollIntoView({
                    behavior: "smooth",
                    block: "start"
                });
            }
        });
    });
}

// Etkileşimli efektler ekle
function addInteractiveEffects() {
    // Kaydırma sırasında görünürlük efekti
    const observerOptions = {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px"
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = "1";
                entry.target.style.transform = "translateY(0)";
            }
        });
    }, observerOptions);
    
    // Yemek kartlarını gözlemle
    setTimeout(() => {
        document.querySelectorAll(".dish-card").forEach(card => {
            card.style.opacity = "0";
            card.style.transform = "translateY(20px)";
            card.style.transition = "opacity 0.6s ease, transform 0.6s ease";
            observer.observe(card);
        });
    }, 100);
}

// Uygulamayı başlat
async function initApp() {
    const menuData = await loadMenu();
    
    if (menuData) {
        displayMenu(menuData);
        addInteractiveEffects();
    }
}

// Sayfa yüklendiğinde uygulamayı çalıştır
document.addEventListener("DOMContentLoaded", initApp);

