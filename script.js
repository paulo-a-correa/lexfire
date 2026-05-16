document.addEventListener('DOMContentLoaded', () => {
    // === 1. LÓGICA DOS MODAIS ===
    const buttons = document.querySelectorAll('.extinguisher-btn');
    const closeButtons = document.querySelectorAll('.close-btn');
    const modals = document.querySelectorAll('.modal-overlay');

    buttons.forEach(button => {
        button.addEventListener('click', () => {
            const targetId = button.getAttribute('data-modal');
            const targetModal = document.getElementById(targetId);
            if (targetModal) {
                targetModal.classList.add('active');
                // Opcional: impede o scroll do fundo, mas mantém o do modal
                document.body.style.overflow = 'hidden'; 
            }
        });
    });

    // Fechar Modais (Botão X e Clique Fora)
    const closeModal = (modal) => {
        modal.classList.remove('active');
        // Devolve o scroll se não houver outros modais abertos
        if (!document.querySelector('.modal-overlay.active')) {
            document.body.style.overflow = 'hidden'; // Ou 'auto' se sua home tiver scroll
        }
    };

    closeButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            closeModal(e.target.closest('.modal-overlay'));
        });
    });

    modals.forEach(modal => {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) closeModal(modal);
        });
    });

    // === MÁSCARA DE TELEFONE ===
    const phoneInput = document.getElementById('phone');
    if (phoneInput) {
        phoneInput.addEventListener('input', (e) => {
            let value = e.target.value.replace(/\D/g, "");
            value = value.replace(/^(\d{2})(\d)/g, "($1) $2");
            value = value.replace(/(\d)(\d{4})$/, "$1-$2");
            e.target.value = value;
        });
    }

    // === ENVIO FORM-SUBMIT (AJAX) ===
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const btn = contactForm.querySelector('.submit-btn');
            const phoneError = document.getElementById('phone-error');
            const apenasNumeros = phoneInput.value.replace(/\D/g, "");

            if (apenasNumeros.length < 11) {
                phoneInput.style.borderColor = "red";
                phoneError.style.display = 'block';
                return;
            }

            btn.innerText = "⏳ ENVIANDO...";
            btn.disabled = true;

            const formData = new FormData(this);
            const data = Object.fromEntries(formData.entries());

            fetch(this.action, {
                method: "POST",
                headers: { "Content-Type": "application/json", "Accept": "application/json" },
                body: JSON.stringify(data)
            })
            .then(response => {
                if (response.ok) {
                    btn.innerText = "✔️ SUCESSO!";
                    btn.style.backgroundColor = "#28a745";
                    contactForm.reset();
                    setTimeout(() => {
                        btn.innerText = "📤 SOLICITAR ATENDIMENTO";
                        btn.style.backgroundColor = "";
                        btn.disabled = false;
                    }, 4000);
                } else { throw new Error(); }
            })
            .catch(() => {
                btn.innerText = "❌ ERRO AO ENVIAR";
                btn.style.backgroundColor = "#dc3545";
                setTimeout(() => {
                    btn.innerText = "TENTAR NOVAMENTE";
                    btn.disabled = false;
                }, 3000);
            });
        });
    }
});

// === LÓGICA DO ACORDEÃO (ECOSSISTEMA) ===
const accordionHeaders = document.querySelectorAll('.accordion-header');

accordionHeaders.forEach(header => {
    header.addEventListener('click', () => {
        const item = header.parentElement;
        const content = item.querySelector('.accordion-content');
        
        // Alternar a classe active no item clicado
        item.classList.toggle('active');
        
        // Se estiver ativo, define o max-height para a altura do conteúdo
        if (item.classList.contains('active')) {
            content.style.maxHeight = content.scrollHeight + 20 + "px"; // +20 para compensar o padding
            content.style.padding = "0 20px 20px 20px";
        } else {
            // Se fechou, zera tudo
            content.style.maxHeight = "0";
            content.style.padding = "0 20px";
        }
        
        // Fechar os outros itens abertos (Opcional: estilo sanfona estrita)
        accordionHeaders.forEach(otherHeader => {
            if (otherHeader !== header) {
                const otherItem = otherHeader.parentElement;
                const otherContent = otherItem.querySelector('.accordion-content');
                otherItem.classList.remove('active');
                otherContent.style.maxHeight = "0";
                otherContent.style.padding = "0 20px";
            }
        });
    });
});

// MODAL PORTFÓLIO
// === SISTEMA LIGHTBOX (PORTFÓLIO) ===
    
    // Banco de Imagens (Substitua as URLs pelas fotos reais dos projetos)
    const portfolioData = {
        diagnostico: [
            "https://images.unsplash.com/photo-1581092160562-40aa08e78837?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
            "https://images.unsplash.com/photo-1503387762-592deb58ef4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
        ],
        estrategia: [
            "https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
            "https://blogger.googleusercontent.com/img/a/AVvXsEi0xMAvsEYQm2TH-6nt8Gu3X_mDIycXGwGT9L0IoWCZovFkY067G9P3-Rp9p9pHLwwngmO4ARt694SFdeKOB8fSumoiVvooVy-3EAuTxo_yCAjaRaw3eUYuVcuab7X1bOegJMkneNWLi8EIhersEHCzUJ1c2B_9e1it2ySehYe4m7VGn8219r6b8llhWzRM=s16000"
        ],
        desenvolvimento: [
            "https://images.unsplash.com/photo-1503387762-592deb58ef4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
            "https://images.unsplash.com/photo-1581092160562-40aa08e78837?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
        ],
        atuacao: [
            "https://images.unsplash.com/photo-1581092795360-fd1ca04f0952?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
            "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEh2ghcvTwzfqA9aD7rNAbAPRNK-lrkdOtfWPitZukFHyjVx7QEX0O5UaqId9cJ3YtL6dwHRrK4cLkO7mFkhiPFjEsK6DBqpF4P2920LERy_ljhhFDnj1QZHhsQKpoi6xxCoBtFesGVSV2Sg2fC5eBXUztl35m2bsM-4-ScJdDcycmqSEiPwGzed_6-z7gKF/s16000/avcb.webp"
        ]
    };

    const lightbox = document.getElementById('custom-lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxClose = document.querySelector('.lightbox-close');
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');
    const btnVerProjetos = document.querySelectorAll('.btn-ver-projeto');

    let currentGallery = [];
    let currentIndex = 0;

    // Abrir Lightbox
    btnVerProjetos.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const galleryKey = e.target.getAttribute('data-gallery');
            currentGallery = portfolioData[galleryKey];
            
            if (currentGallery && currentGallery.length > 0) {
                currentIndex = 0;
                updateLightboxImage();
                lightbox.classList.add('active');
            }
        });
    });

    // Atualizar Imagem com Efeito Fade
    function updateLightboxImage() {
        lightboxImg.classList.remove('loaded'); // Tira opacidade
        
        setTimeout(() => {
            lightboxImg.src = currentGallery[currentIndex];
            // Quando a imagem carregar, volta a opacidade
            lightboxImg.onload = () => {
                lightboxImg.classList.add('loaded');
            };
        }, 300); // Tempo do fade-out
    }

    // Navegação
    prevBtn.addEventListener('click', () => {
        currentIndex = (currentIndex === 0) ? currentGallery.length - 1 : currentIndex - 1;
        updateLightboxImage();
    });

    nextBtn.addEventListener('click', () => {
        currentIndex = (currentIndex === currentGallery.length - 1) ? 0 : currentIndex + 1;
        updateLightboxImage();
    });

    // Fechar Lightbox
    lightboxClose.addEventListener('click', () => {
        lightbox.classList.remove('active');
        setTimeout(() => { lightboxImg.src = ""; }, 400); // Limpa imagem após fechar
    });

    // Fechar clicando fora da imagem
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) {
            lightbox.classList.remove('active');
            setTimeout(() => { lightboxImg.src = ""; }, 400);
        }
    });

    //PRELOADER
    // Remove o Preloader após o carregamento completo da página
    window.addEventListener('load', () => {
        const preloader = document.getElementById('preloader');
        
        // Pequeno delay para garantir que a renderização foi concluída
        setTimeout(() => {
            preloader.classList.add('loaded');
        }, 1000); 
    });