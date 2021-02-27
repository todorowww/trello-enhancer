// Trello Enhancer

// Listeners

document.addEventListener('click', (e) => {
	const el = e.originalTarget;
	if (el.classList.contains('card-short-id') || el.classList.contains('card-id-details')) {
		e.stopImmediatePropagation();
        e.stopPropagation();
		e.preventDefault();

        const input = document.createElement('input');
        document.body.appendChild(input);
		input.value = el.textContent.replace('#', '');
		input.select();
		document.execCommand('copy');
        document.removeChild(input);
	}
}, true);

document.addEventListener('mouseup', (e) => {
	const el = e.originalTarget;
    let parent = el.parentElement;


    if (parent.getAttribute('class').indexOf('list-card') !== -1) {
        detailsReady().then(function() { 
            let href = el.parentElement.getAttribute('href');
            if (href === null) {
                href = el.parentElement.parentElement.getAttribute('href');
            }
            
            let cardDetails = document.getElementsByClassName('card-detail-window')[0];
            let header = document.getElementsByClassName('window-header')[0];
            
            let cardNumberDiv = document.createElement('div');
            cardNumberDiv.className = 'card-id-details';
            cardNumberDiv.title = "Click to copy card ID";
            var textNode = document.createTextNode(getCardId(href));

            cardNumberDiv.appendChild(textNode);
            cardDetails.insertBefore(cardNumberDiv, header);

        }, function (error) {
            console.error(error);
        });
    }
}, true);

window.addEventListener('load', function() {
    let target = document.querySelector('body');
    
    let options = { attributes: true, childList: true, subtree: true, characterData: true }

    let observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (mutation.addedNodes.length > 0) {
                let node = mutation.addedNodes[0];
                let classes = node.classList;

                if (classes) {
                    if ((node.className.indexOf('list-card') > -1) && (node.className.indexOf('js-member-droppable') > -1)) {
                        if (node.querySelectorAll('.card-short-id').length === 0) {
                            hrefReady(node).then(function(href) {
                                let card = node.querySelectorAll('span.list-card-title.js-card-name')[0];
                                let shortIdSpan = document.createElement('span');
                                shortIdSpan.innerHTML = '#' + getCardId(href);
                                shortIdSpan.className = 'card-short-id hide';
                                card.insertBefore(shortIdSpan, card.firstChild);
                            }, function(error) {
                                console.error(error);
                            });
                        }
                    }
                }
            }
        });
    });

    observer.observe(target, options);

});

// Functions

function getCardId(url) {
    let title = url.split('/');
    let s = title[title.length - 1];
    
    return s.substr(0, s.indexOf('-'));
}


// Promises

function detailsReady() {
    let promise = new Promise(function(resolve, reject) {
        let timeout = 50;
        let listener = function(interval) {
            let modal = document.getElementsByClassName('window-title');
            if (modal.length !== 0) {
                resolve('true');
            }
            else {
                interval = interval + 1 || 1;
                if (interval < timeout) {
                    setTimeout(function() { listener(interval); }, 100);
                } else {
                    reject('Details timeout!');
                }
            }
        };

        listener();
    });

    return promise;
}

function hrefReady(obj) {
    let  promise = new Promise(function(resolve,reject) {
        let timeout = 50;
        let listener = function(interval) {
            if (obj.getAttribute('href') != undefined) {
                resolve(obj.getAttribute('href'));
            } else {
                interval = interval + 1 || 1;
                if (interval < timeout) {
                    setTimeout(function() { listener(interval); }, 100);
                } else {
                    reject('HREF timeout');
                }
            }
        };

        listener();
    });

    return promise;
}