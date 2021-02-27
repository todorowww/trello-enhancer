const input = document.createElement('input');
document.body.appendChild(input);

document.addEventListener('click', (e) => {
	const el = e.originalTarget;
	if (el.classList.contains('card-short-id')) {
		e.stopImmediatePropagation();
		e.preventDefault();
		input.value = el.textContent.replace('#', '');
		input.select();
		document.execCommand('Copy');
	}
}, true);

document.addEventListener('mouseup', (e) => {
	const el = e.originalTarget;
    let parent = el.parentElement;


    if (parent.getAttribute('class').indexOf('list-card') !== -1) {
        setTimeout(function() { 
            let href = el.parentElement.getAttribute('href');
            if (href === null) {
                href = el.parentElement.parentElement.getAttribute('href');
            }
            
            let cardDetails = document.getElementsByClassName('card-detail-window')[0];
            let header = document.getElementsByClassName('window-header')[0];
            
            let cardNumberDiv = document.createElement('div');
            cardNumberDiv.className = 'card-id-details'
            var textNode = document.createTextNode(getCardId(href));

            cardNumberDiv.appendChild(textNode);
            cardDetails.insertBefore(cardNumberDiv, header);

        }, 1000);
    }
}, true);

function getCardId(url) {
    let title = url.split('/');
    let s = title[title.length - 1];
    
    return s.substr(0, s.indexOf('-'));;
}