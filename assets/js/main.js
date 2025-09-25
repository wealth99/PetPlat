document.addEventListener('DOMContentLoaded', () => {
    console.log('page load')
});

/**
 * 스크롤 위치에 따라 요소에 'on' 클래스를 추가하거나 제거하는 함수
 */
function checkElemVisibility() {
    // 애니메이션을 시작할 트리거 지점을 창 높이의 80%로 설정합니다.
    const triggerPoint = window.innerHeight * 0.99;
    const revealEls = document.querySelectorAll('.reveal');

    revealEls.forEach(el => {
        if (el.offsetParent === null) {
            return; // 렌더링되지 않은 요소는 건너뜁니다.
        }

        const elTop = el.getBoundingClientRect().top;

        // 요소의 상단이 트리거 지점보다 위에 나타나면 'on' 클래스를 추가합니다.
        if (elTop < triggerPoint) {
            // 원본 코드의 자식 요소 처리 로직을 유지합니다.
            // 참고: 현재 selector는 개별 요소를 선택하므로, 아래 children은 대부분 비어있을 수 있습니다.
            // 만약 '.list-box' 같은 컨테이너를 기준으로 자식들을 순차적으로 애니메이션하려면 selector 수정이 필요합니다.
            const children = el.querySelectorAll("h2, .box");

            if (children.length > 0) {
                children.forEach((child, i) => {
                    child.style.transitionDelay = `${i * 0.15}s`;
                    child.classList.add("on");
                });
            } else {
                el.classList.add("on");
            }
        } 
        // 요소가 화면 밖으로 나가면 'on' 클래스를 제거하여 애니메이션을 리셋합니다.
        else {
            const children = el.querySelectorAll("h2, .box");
            if (children.length > 0) {
                children.forEach(child => {
                    child.style.transitionDelay = "0s";
                    child.classList.remove("on");
                });
            } else {
                
                el.classList.remove("on");
            }
        }
    });
}

// name - 쿠키 이름, value - 쿠키 값, expires - 만료 시각 (Date 객체)
function setCookie(name, value, expires) {
    let cookieString = `${encodeURIComponent(name)}=${encodeURIComponent(value)}`;
    if (expires) {
        cookieString += `; expires=${expires.toUTCString()}`;
    }
    cookieString += '; path=/'; // 사이트 전체에서 유효하도록 설정
    document.cookie = cookieString;
}

function getCookie(name) {
    const cookies = document.cookie.split(';').map(cookie => cookie.trim());
    for (const cookie of cookies) {
        const [cookieName, cookieValue] = cookie.split('=');
        if (decodeURIComponent(cookieName) === name) {
            return decodeURIComponent(cookieValue);
        }
    }
    return null;
}

 // 탭
class Tab {
    constructor(container) {
        this.container = container;
        this.tablist = container.querySelector(':scope > [role="tablist"]');

        const panelContainer = container.querySelector(':scope > .tab-panels');

        if (!this.tablist || !panelContainer) return;

        this.tabs = Array.from(this.tablist.querySelectorAll('[role="tab"]'));
        this.panels = Array.from(panelContainer.querySelectorAll(':scope > [role="tabpanel"]'));

        if (this.tabs.length === 0) return;

        this.init();
    }

    init() {
        this.tablist.addEventListener('click', this.handleClick.bind(this));
        this.tablist.addEventListener('keydown', this.handleKeydown.bind(this));
    }

    handleClick(e) {
        const clickedTab = e.target.closest('[role="tab"]');
        if (clickedTab) {
            this.activateTab(clickedTab);
        }

        checkElemVisibility();
    }

    handleKeydown(e) {
        const currentTab = e.target.closest('[role="tab"]');

        if (!currentTab) return;

        let newIndex = this.tabs.indexOf(currentTab);
        let shouldPreventDefault = true;

        switch (e.key) {
            case 'ArrowLeft':
                newIndex = (newIndex - 1 + this.tabs.length) % this.tabs.length;
                break;
            case 'ArrowRight':
                newIndex = (newIndex + 1) % this.tabs.length;
                break;
            case 'Home': newIndex = 0; break;
            case 'End': newIndex = this.tabs.length - 1; break;
            default: shouldPreventDefault = false; break;
        }

        if (shouldPreventDefault) {
            e.preventDefault();

            this.tabs[newIndex].focus();
            this.activateTab(this.tabs[newIndex]);
        }
    }

    activateTab(tabToActivate) {
        this.tabs.forEach((tab, index) => {
            tab.setAttribute('aria-selected', 'false');
            tab.setAttribute('tabindex', '-1');
        });
        
        this.panels.forEach(panel => {
            panel.setAttribute('hidden', 'true');
        });

        const panelId = tabToActivate.getAttribute('aria-controls');
        const panelToActivate = this.container.querySelector(`#${panelId}`);
        const index = Array.from(tabToActivate.closest('ul').children).indexOf(tabToActivate.parentElement);

        if(!tabToActivate.closest('#sub-tabs')) {
            if(index === 0) {
                document.body.classList.remove('bg2');
            }

            if(index === 1) {
                document.body.classList.add('bg2');
            }
        }

        tabToActivate.setAttribute('aria-selected', 'true');
        tabToActivate.setAttribute('tabindex', '0');
        
        if (panelToActivate) {
            panelToActivate.removeAttribute('hidden');
        }
    }

    openTab(index) {
        if (index >= 0 && index < this.tabs.length) {
            const tabToActivate = this.tabs[index];

            console.log('tabToActivate: ', tabToActivate)

            this.activateTab(tabToActivate);
            tabToActivate.focus();
        } else {
            console.warn(`Tab index ${index} is out of bounds.`);
        }
    }
}