document.addEventListener('DOMContentLoaded', () => {
    console.log('page load')
});

/**
 * 스크롤 위치에 따라 요소에 'on' 클래스를 추가하거나 제거하는 함수
 */
function checkElemVisibility() {
    // 애니메이션을 시작할 트리거 지점을 창 높이의 80%로 설정합니다.
    const triggerPoint = window.innerHeight * 0.9;
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