// MrVR Official Website JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // パーティクル背景を即座に生成
    generateParticles();
    
    // 言語切り替えの処理
    const languageSelector = document.querySelector('.language-selector');
    const languageToggle = document.querySelector('.language-toggle');
    const languageDropdown = document.querySelector('.language-dropdown');
    
    if (languageToggle && languageDropdown) {
        // 言語切り替えのクリックイベント
        document.addEventListener('click', function(event) {
            const isClickInside = languageSelector.contains(event.target);
            
            if (!isClickInside && languageDropdown.style.display === 'block') {
                languageDropdown.style.display = 'none';
            }
        });
        
        // モバイル対応のタップ処理
        languageToggle.addEventListener('click', function(event) {
            event.preventDefault();
            
            if (window.innerWidth <= 768) {
                if (languageDropdown.style.display === 'block') {
                    languageDropdown.style.display = 'none';
                } else {
                    languageDropdown.style.display = 'block';
                }
            }
        });
    }

    // Navbar scroll effect
    const navbar = document.querySelector('.navbar');
    
    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            navbar.classList.add('navbar-scrolled');
        } else {
            navbar.classList.remove('navbar-scrolled');
        }
    });
    
    // Mobile menu toggle
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.navbar-nav');
    
    if (hamburger) {
        hamburger.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            this.setAttribute('aria-expanded', this.getAttribute('aria-expanded') === 'true' ? 'false' : 'true');
        });
    }
    
    // Close mobile menu when clicking on a nav link
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (navMenu.classList.contains('active')) {
                navMenu.classList.remove('active');
                hamburger.setAttribute('aria-expanded', 'false');
            }
        });
    });
    
    // スクロールによるアニメーション表示 - IntersectionObserverを使用
    const setupScrollAnimations = function() {
        // アニメーション用のクラスを持つ要素を取得
        const animatedElements = document.querySelectorAll(
            '.fade-in, .slide-up, .slide-right, .slide-left, ' + 
            '.hero-content, .hero-image, .project-card, .channel-card, ' +
            '.section-title, .featured-content, .featured-media-container, ' +
            '.webxr-guide, .webxr-banner, .webxr-banner-content, .webxr-badge-large'
        );
        
        // アニメーションを初期化 - 一旦非表示にする
        animatedElements.forEach(element => {
            // すでにアニメーションクラスを持っていない場合は追加
            if (!element.classList.contains('fade-in') && 
                !element.classList.contains('slide-up') && 
                !element.classList.contains('slide-right') && 
                !element.classList.contains('slide-left')) {
                
                // 要素の種類によって適切なアニメーションクラスを追加
                if (element.classList.contains('hero-content')) {
                    element.classList.add('slide-right');
                } else if (element.classList.contains('hero-image')) {
                    element.classList.add('slide-left');
                } else if (element.classList.contains('project-card') || 
                           element.classList.contains('channel-card')) {
                    element.classList.add('slide-up');
                } else if (element.classList.contains('section-title') ||
                           element.classList.contains('webxr-guide') ||
                           element.classList.contains('webxr-banner') ||
                           element.classList.contains('webxr-banner-content') ||
                           element.classList.contains('webxr-badge-large')) {
                    element.classList.add('fade-in');
                } else {
                    element.classList.add('fade-in');
                }
            }
            
            // アニメーションを一時停止
            element.style.animationPlayState = 'paused';
            element.style.opacity = '0';
        });
        
        // IntersectionObserverのオプション
        const observerOptions = {
            root: null, // ビューポートをルートとして使用
            rootMargin: '0px', // マージンなし
            threshold: 0.15 // 要素の15%が見えたらコールバックを実行
        };
        
        // IntersectionObserverのコールバック
        const observerCallback = (entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const element = entry.target;
                    
                    // 遅延を計算 - 順番に表示するための遅延
                    let delay = 0;
                    
                    // 親要素内での位置に基づいて遅延を設定
                    if (element.parentElement) {
                        const siblings = Array.from(element.parentElement.children);
                        const index = siblings.indexOf(element);
                        
                        // カード等の場合は連続して表示されるよう遅延を設定
                        if (element.classList.contains('project-card') || 
                            element.classList.contains('channel-card')) {
                            delay = index * 0.1; // 100msごとに遅延
                        }
                    }
                    
                    // data-delay属性がある場合はそれを優先
                    if (element.dataset.delay) {
                        delay = parseFloat(element.dataset.delay);
                    }
                    
                    // アニメーション開始
                    setTimeout(() => {
                        element.style.animationDelay = delay + 's';
                        element.style.animationPlayState = 'running';
                        element.style.opacity = '';
                    }, 50);
                    
                    // 一度表示されたら監視を解除
                    observer.unobserve(element);
                }
            });
        };
        
        // IntersectionObserverを作成
        const observer = new IntersectionObserver(observerCallback, observerOptions);
        
        // 監視対象の要素を登録
        animatedElements.forEach(element => {
            observer.observe(element);
        });
    };
    
    // スライドショー機能
    const setupSlideshow = function() {
        const slideshows = document.querySelectorAll('.slideshow-container');
        console.log('スライドショー要素を検索中...見つかった数:', slideshows.length);
        
        slideshows.forEach((slideshow, index) => {
            // チャンネルカード内のスライドショーは除外
            if (slideshow.closest('.channel-card')) {
                console.log('チャンネルカード内のスライドショーは無効化します');
                return;
            }
            
            const slides = slideshow.querySelectorAll('.slideshow-slide');
            console.log(`スライドショー #${index+1}のスライド数:`, slides.length);
            
            if (slides.length === 0) {
                console.error('スライドが見つかりません');
                return;
            }
            
            let currentSlide = 0;
            
            // 初期状態: 最初のスライドをアクティブに、他は非アクティブに
            slides.forEach((slide, i) => {
                if (i === 0) {
                    slide.classList.add('active');
                } else {
                    slide.classList.remove('active');
                }
            });
            
            // スライドショーのナビゲーションドットを作成
            const dotsContainer = document.createElement('div');
            dotsContainer.className = 'slideshow-dots';
            
            // 各スライドに対応するドットを作成
            slides.forEach((_, i) => {
                const dot = document.createElement('span');
                dot.className = 'slideshow-dot';
                if (i === 0) dot.classList.add('active');
                
                // ドットをクリックしたときの処理
                dot.addEventListener('click', () => {
                    slides[currentSlide].classList.remove('active');
                    dotsContainer.querySelectorAll('.slideshow-dot').forEach(dot => dot.classList.remove('active'));
                    
                    currentSlide = i;
                    
                    slides[currentSlide].classList.add('active');
                    dotsContainer.querySelectorAll('.slideshow-dot')[currentSlide].classList.add('active');
                    console.log(`スライドショー #${index+1}: ドットクリックでスライド ${currentSlide+1}に切り替え`);
                });
                
                dotsContainer.appendChild(dot);
            });
            
            // ドットコンテナをスライドショーに追加
            slideshow.appendChild(dotsContainer);
            
            // 次のスライドへ移動する関数
            const nextSlide = () => {
                slides[currentSlide].classList.remove('active');
                dotsContainer.querySelectorAll('.slideshow-dot')[currentSlide].classList.remove('active');
                
                currentSlide = (currentSlide + 1) % slides.length;
                
                slides[currentSlide].classList.add('active');
                dotsContainer.querySelectorAll('.slideshow-dot')[currentSlide].classList.add('active');
                console.log(`スライドショー #${index+1}: スライド ${currentSlide+1}に切り替え`);
            };
            
            // 前のスライドへ移動する関数
            const prevSlide = () => {
                slides[currentSlide].classList.remove('active');
                dotsContainer.querySelectorAll('.slideshow-dot')[currentSlide].classList.remove('active');
                
                currentSlide = (currentSlide - 1 + slides.length) % slides.length;
                
                slides[currentSlide].classList.add('active');
                dotsContainer.querySelectorAll('.slideshow-dot')[currentSlide].classList.add('active');
                console.log(`スライドショー #${index+1}: スライド ${currentSlide+1}に切り替え`);
            };
            
            // 矢印ナビゲーションを追加
            const prevArrow = document.createElement('button');
            prevArrow.className = 'slideshow-arrow slideshow-arrow-prev';
            prevArrow.innerHTML = '&#10094;';
            prevArrow.addEventListener('click', () => {
                prevSlide();
                resetTimer(); // タイマーをリセット
            });
            
            const nextArrow = document.createElement('button');
            nextArrow.className = 'slideshow-arrow slideshow-arrow-next';
            nextArrow.innerHTML = '&#10095;';
            nextArrow.addEventListener('click', () => {
                nextSlide();
                resetTimer(); // タイマーをリセット
            });
            
            slideshow.appendChild(prevArrow);
            slideshow.appendChild(nextArrow);
            
            // 自動スライドショーのインターバル設定
            let slideTimer;
            
            const startTimer = () => {
                slideTimer = setInterval(nextSlide, 5000);
            };
            
            const resetTimer = () => {
                clearInterval(slideTimer);
                startTimer();
            };
            
            // スライドショーを開始
            startTimer();
            
            // マウスが乗ったら一時停止、離れたら再開
            slideshow.addEventListener('mouseenter', () => {
                clearInterval(slideTimer);
            });
            
            slideshow.addEventListener('mouseleave', () => {
                startTimer();
            });
        });
    };
    
    // アニメーションとスライドショーのセットアップを実行
    setupScrollAnimations();
    setupSlideshow();
    
    // 従来のスクロールアニメーション（後方互換性のため）
    const revealOnScroll = function() {
        const sections = document.querySelectorAll('section');
        
        window.addEventListener('scroll', () => {
            const scrollPosition = window.scrollY + window.innerHeight * 0.85;
            
            sections.forEach(section => {
                const sectionTop = section.offsetTop;
                
                if (scrollPosition > sectionTop) {
                    section.classList.add('revealed');
                }
            });
        });
    };
    
    // 初回読み込み時にアニメーションを実行
    revealOnScroll();
    
    // WebXR detection
    const checkVRSupport = function() {
        const vrBtns = document.querySelectorAll('.vr-launch-btn');
        
        // WebXRがサポートされているか確認
        if ('xr' in navigator) {
            navigator.xr.isSessionSupported('immersive-vr')
                .then(supported => {
                    if (supported) {
                        vrBtns.forEach(btn => {
                            btn.title = 'このデバイスはVRに対応しています';
                            btn.classList.add('vr-supported');
                        });
                    } else {
                        vrBtns.forEach(btn => {
                            btn.title = 'このデバイスはVRに対応していません';
                        });
                    }
                })
                .catch(err => {
                    console.error('WebXR対応確認エラー:', err);
                });
        } else {
            vrBtns.forEach(btn => {
                btn.title = 'このブラウザはWebXRに対応していません';
            });
        }
    };
    
    checkVRSupport();
    
    // Filter functionality for apps/games
    const setupFilters = function() {
        const filterBtns = document.querySelectorAll('.filter-btn');
        const projectCards = document.querySelectorAll('.project-card');
        
        if (filterBtns.length && projectCards.length) {
            // 初期化: すべてのカードに基本スタイルを設定
            projectCards.forEach(card => {
                card.style.transition = 'all 0.3s ease';
            });
            
            filterBtns.forEach(btn => {
                btn.addEventListener('click', () => {
                    // アクティブクラスの切り替え
                    filterBtns.forEach(b => b.classList.remove('active'));
                    btn.classList.add('active');
                    
                    const filter = btn.getAttribute('data-filter');
                    
                    // 最初にすべてのカードを即座に非表示にしてからフィルタリング
                    projectCards.forEach(card => {
                        card.style.opacity = '0';
                        card.style.transform = 'translateY(20px)';
                    });
                    
                    // アニメーション完了後にフィルタリング
                    setTimeout(() => {
                        projectCards.forEach(card => {
                            const categories = card.getAttribute('data-category');
                            
                            if (filter === 'all' || categories.includes(filter)) {
                                card.style.display = 'flex';
                                // 順次表示するためのディレイ
                                const index = Array.from(projectCards).indexOf(card);
                                setTimeout(() => {
                                    card.style.opacity = '1';
                                    card.style.transform = 'translateY(0)';
                                }, index * 100);
                            } else {
                                card.style.display = 'none';
                            }
                        });
                    }, 200);
                });
            });
        }
    };
    
    setupFilters();

    // 粒子効果の生成
    const particleContainer = document.getElementById('particleContainer');
    // 粒子数を30に設定
    const numberOfParticles = 30;
    // グリッド線の数を20に増やす
    const gridSize = 20;

    // SEO機能: 画像のalt属性がない場合に自動設定
    const improveImageSEO = function() {
        const images = document.querySelectorAll('img:not([alt]), img[alt=""]');
        images.forEach(img => {
            // 親要素やクラス名から適切なalt属性を生成
            let altText = '';
            
            // 画像ファイル名からalt属性を生成
            const filename = img.src.split('/').pop().split('.')[0]
                .replace(/_/g, ' ')
                .replace(/-/g, ' ')
                .replace(/([A-Z])/g, ' $1')  // キャメルケースをスペースで区切る
                .trim();
            
            altText = filename.charAt(0).toUpperCase() + filename.slice(1); // 最初の文字を大文字に
            
            // 近くの見出しやテキストからコンテキストを取得
            let parentHeading = img.closest('div, section')?.querySelector('h1, h2, h3, h4, h5, h6');
            if (parentHeading) {
                altText = `${parentHeading.textContent} - ${altText}`;
            }
            
            // クラス名からヒントを得る
            if (img.className.includes('logo')) {
                altText = 'ミスターVRロゴ';
            } else if (img.className.includes('icon')) {
                altText = `${altText}アイコン`;
            }
            
            img.alt = altText;
        });
    };
    
    // SEO機能: 画像の遅延読み込み
    const setupLazyLoading = function() {
        // IntersectionObserverが使用可能な場合
        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        if (img.dataset.src) {
                            img.src = img.dataset.src;
                            img.removeAttribute('data-src');
                        }
                        observer.unobserve(img);
                    }
                });
            });
            
            // data-src属性を持つ画像を監視
            document.querySelectorAll('img[data-src]').forEach(img => {
                imageObserver.observe(img);
            });
        } else {
            // IntersectionObserver非対応のブラウザ用のフォールバック
            document.querySelectorAll('img[data-src]').forEach(img => {
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
            });
        }
    };
    
    // アウトバウンドリンクの管理（Google Analyticsなどとの連携用）
    const setupExternalLinks = function() {
        const links = document.querySelectorAll('a[href^="http"]');
        links.forEach(link => {
            // 自分のドメイン以外へのリンクには新しいタブで開くように設定し、rel属性を追加
            if (!link.href.includes(window.location.hostname)) {
                if (!link.hasAttribute('rel')) {
                    link.setAttribute('rel', 'noopener noreferrer');
                }
                if (!link.hasAttribute('target')) {
                    link.setAttribute('target', '_blank');
                }
                
                // アナリティクス用のイベント属性を追加（任意）
                link.setAttribute('data-outbound', 'true');
            }
        });
    };
    
    // ページパフォーマンスとユーザー体験向上用の機能
    const setupPerformance = function() {
        // ページの読み込み完了後に実行する低優先度タスク
        if ('requestIdleCallback' in window) {
            requestIdleCallback(() => {
                console.log('ページ読み込み完了 - パフォーマンス最適化を実行中');
                improveImageSEO();
                setupExternalLinks();
            });
        } else {
            // requestIdleCallback非対応ブラウザ用
            setTimeout(() => {
                improveImageSEO();
                setupExternalLinks();
            }, 1000);
        }
        
        // 画像の遅延読み込みを設定
        setupLazyLoading();
    };
    
    // ボタンホバーエフェクト強化
    const setupButtonEffects = function() {
        // 「ゲームをチェック」ボタン
        const checkGameButtons = document.querySelectorAll('.vr-launch-btn');
        
        checkGameButtons.forEach(button => {
            button.addEventListener('mouseenter', function() {
                this.style.transition = 'all 0.3s ease';
            });
            
            button.addEventListener('mouseleave', function() {
                this.style.transition = 'all 0.5s ease';
            });
        });
        
        // 「公式マニュアル」「今すぐプレイ」ボタン
        const actionButtons = document.querySelectorAll('.btn-secondary, .btn-play:not(.vr-launch-btn)');
        
        actionButtons.forEach(button => {
            button.addEventListener('mouseenter', function() {
                this.style.transition = 'all 0.3s ease';
            });
            
            button.addEventListener('mouseleave', function() {
                this.style.transition = 'all 0.5s ease';
            });
        });
    };
    
    // プロジェクトカードとSNSカードのホバーエフェクト強化
    const setupCardEffects = function() {
        const cards = document.querySelectorAll('.project-card, .channel-card');
        
        cards.forEach(card => {
            card.addEventListener('mouseenter', function() {
                this.style.zIndex = '10';
                this.querySelectorAll('img').forEach(img => {
                    img.style.transform = 'scale(1.05)';
                    img.style.transition = 'transform 0.4s ease';
                });
            });
            
            card.addEventListener('mouseleave', function() {
                this.style.zIndex = '1';
                this.querySelectorAll('img').forEach(img => {
                    img.style.transform = 'scale(1)';
                    img.style.transition = 'transform 0.4s ease';
                });
            });
        });
    };
    
    // ミスターVRの立ち絵アニメーション
    const setupCharacterAnimation = function() {
        const characterImage = document.querySelector('.hero-image img');
        if (characterImage) {
            // 既存のアニメーションに加えて、マウスに反応する動きを追加
            document.addEventListener('mousemove', function(e) {
                const mouseX = e.clientX / window.innerWidth;
                const mouseY = e.clientY / window.innerHeight;
                
                // マウス位置に応じて少し動く（大きく動かしすぎないように制限）
                const moveX = (mouseX - 0.5) * 5; // -2.5px 〜 2.5px
                const moveY = (mouseY - 0.5) * 5; // -2.5px 〜 2.5px
                const rotate = (mouseX - 0.5) * 2; // -1deg 〜 1deg
                
                // CSSのアニメーションと組み合わせるため、transform-originは変更しない
                characterImage.style.transform = `translateX(${moveX}px) translateY(${moveY}px) rotate(${rotate}deg)`;
            });
        }
    };

    // 実行
    setupScrollAnimations();
    setupSlideshow();
    revealOnScroll();
    checkVRSupport();
    setupFilters();
    improveImageSEO();
    setupLazyLoading();
    setupExternalLinks();
    setupPerformance();
    
    // 新しく追加した関数を実行
    setupButtonEffects();
    setupCardEffects();
    setupCharacterAnimation();
    
    // パーティクルを即座に表示するために、DOMContentLoadedイベントの最後に実行
    setTimeout(() => {
        const particleContainer = document.getElementById('particleContainer');
        if (particleContainer) {
            particleContainer.style.opacity = '1';
            particleContainer.style.transition = 'opacity 0.5s ease';
        }
    }, 100);
});

// スクロール最適化のためのコード追加
let scrollTimeout;
let isScrolling = false;

window.addEventListener('scroll', function() {
    // スクロール開始時の処理
    if (!isScrolling) {
        isScrolling = true;
        document.body.classList.add('is-scrolling');
        
        // スクロール中は重いアニメーションを一時停止
        const particleContainer = document.getElementById('particleContainer');
        if (particleContainer) particleContainer.style.opacity = '0.6';
        
        // グリッド線も一時停止
        const gridContainer = document.getElementById('gridContainer');
        if (gridContainer) gridContainer.style.opacity = '0.12';
        
        // スライドショーのタイマーを一時停止
        document.querySelectorAll('.slideshow-container').forEach(slideshow => {
            slideshow.dispatchEvent(new Event('mouseenter'));
        });
        
        // カードのhover状態をリセット（ホバー中にスクロールを開始した場合）
        document.querySelectorAll('.project-card, .channel-card').forEach(card => {
            card.classList.remove('hovered');
        });
    }
    
    // スクロール終了の検出
    clearTimeout(scrollTimeout);
    scrollTimeout = setTimeout(function() {
        isScrolling = false;
        document.body.classList.remove('is-scrolling');
        
        // スクロール中も視認性を維持
        const particleContainer = document.getElementById('particleContainer');
        if (particleContainer) particleContainer.style.opacity = '0.6';
        
        // グリッド線も適度に表示
        const gridContainer = document.getElementById('gridContainer');
        if (gridContainer) gridContainer.style.opacity = '0.12';
        
        // スライドショーのタイマーを再開
        document.querySelectorAll('.slideshow-container').forEach(slideshow => {
            slideshow.dispatchEvent(new Event('mouseleave'));
        });
        
        // スクロール終了後にアニメーションを完全に再開
        if (particleContainer) particleContainer.style.opacity = '1';
        
        // グリッド線も完全に再開
        if (gridContainer) gridContainer.style.opacity = '0.15';
    }, 200);
});

// Twitterウィジェットのカスタマイズ
window.twttr = (function(d, s, id) {
    var js, fjs = d.getElementsByTagName(s)[0],
        t = window.twttr || {};
    if (d.getElementById(id)) return t;
    js = d.createElement(s);
    js.id = id;
    js.src = "https://platform.twitter.com/widgets.js";
    fjs.parentNode.insertBefore(js, fjs);

    t._e = [];
    t.ready = function(f) {
        t._e.push(f);
    };

    return t;
}(document, "script", "twitter-wjs"));

// パーティクル生成関数
function generateParticles() {
    const particleContainer = document.getElementById('particleContainer');
    if (particleContainer) {
        const numberOfParticles = 30;
        
        for (let i = 0; i < numberOfParticles; i++) {
            const particle = document.createElement('div');
            particle.classList.add('particle');
            
            const xStart = Math.random() * 100;
            const yStart = Math.random() * 100;
            const xEnd = Math.random() * 100;
            const yEnd = Math.random() * 100;
            
            particle.style.setProperty('--x-start', `${xStart}vw`);
            particle.style.setProperty('--y-start', `${yStart}vh`);
            particle.style.setProperty('--x-end', `${xEnd}vw`);
            particle.style.setProperty('--y-end', `${yEnd}vh`);
            
            particle.style.animationDelay = `${Math.random() * 5}s`; // 遅延時間を短縮（10秒→5秒）
            
            const size = Math.random() * 3 + 1; // パーティクルのサイズをランダムに
            particle.style.width = `${size}px`;
            particle.style.height = `${size}px`;
            
            particleContainer.appendChild(particle);
        }
    }
    
    // グリッド線を生成
    generateGrid();
}

// グリッド線生成関数
function generateGrid() {
    const gridContainer = document.querySelector('.grid-container');
    if (!gridContainer) {
        // グリッドコンテナがなければ作成
        const gridLines = document.querySelector('.grid-lines');
        if (gridLines) {
            const newGridContainer = document.createElement('div');
            newGridContainer.className = 'grid-container';
            gridLines.appendChild(newGridContainer);
            
            // グリッド線を生成
            const gridSize = 20; // グリッド線の数
            
            // X方向のグリッド線
            for (let i = 0; i <= gridSize; i++) {
                const gridLine = document.createElement('div');
                gridLine.className = 'grid-line-x';
                gridLine.style.top = `${(i / gridSize) * 100}%`;
                
                // 奥行き感を出すために不透明度を調整
                if (i % 5 === 0) {
                    gridLine.style.opacity = '0.8'; // 主要な線は濃く
                } else {
                    gridLine.style.opacity = '0.4'; // 補助線は薄く
                }
                
                newGridContainer.appendChild(gridLine);
            }
            
            // Z方向のグリッド線
            for (let i = 0; i <= gridSize; i++) {
                const gridLine = document.createElement('div');
                gridLine.className = 'grid-line-z';
                gridLine.style.left = `${(i / gridSize) * 100}%`;
                
                // 奥行き感を出すために不透明度を調整
                if (i % 5 === 0) {
                    gridLine.style.opacity = '0.8'; // 主要な線は濃く
                } else {
                    gridLine.style.opacity = '0.4'; // 補助線は薄く
                }
                
                newGridContainer.appendChild(gridLine);
            }
            
            // 奥行き感を強調するための追加のグリッド線
            for (let i = 0; i < 5; i++) {
                const depthLine = document.createElement('div');
                depthLine.className = 'grid-line-depth';
                depthLine.style.top = `${20 + i * 15}%`;
                depthLine.style.height = '1px';
                depthLine.style.width = '100%';
                depthLine.style.background = 'linear-gradient(90deg, rgba(0, 229, 255, 0.05), rgba(0, 229, 255, 0.7), rgba(0, 229, 255, 0.05))';
                depthLine.style.opacity = '0.3';
                depthLine.style.transform = 'translateZ(-50px)';
                newGridContainer.appendChild(depthLine);
            }
        }
    }
} 