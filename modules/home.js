
/* home.js */

import { getCookie, login, showMessage } from '../js/core.js'

const apiURL = 'https://jackson-relax-8080.codio-box.uk'
const slides = document.getElementsByClassName('carousel__item')
let slidePosition = 0

export async function setup() {
	try {
		console.log('MAIN SCRIPT')
		//calling checkShow seller function to decide if seller page should be visible
		checkShowSeller()
		
		const url = `${apiURL}/v2/items/`
		const json = await fetch(url)
		const data = await json.json()		
		console.log("number of items = ", data.data.length)
		
		for(let item of data.data){		
			//fetch eact item info
			const itemUrl = `${item.ItemDetail}`
			const itemJson = await fetch(itemUrl)
			const itemData = await itemJson.json()
			
			const itemInfo = itemData.data
			console.log('item info ', itemInfo)
				
			// create carousel item div
			const div = document.createElement('div')
			//check if this is the first element to be added(by checking the index of the item) to add isvisible class
			if(data.data.indexOf(item) == 0){	
				console.log('item index == ', data.data.indexOf(item))				
				div.classList.add('carousel__item','carousel__item--visible')
			}else{
				console.log('item index ==: ', data.data.indexOf(item) )
				div.classList.add("carousel__item")
			}
			
			//setting an id attribute based on item index
			div.setAttribute("id", data.data.indexOf(item));

			//create h3 elemnt for item name
			const itemName = document.createElement('h3')
			//get item name
			const name = item.name
			// set innertext of h3 element to item name
			itemName.innerText = name
			//adding eventlistener
			itemName.addEventListener("click", function() {
				console.log('inside the item name event listener')
				sessionStorage.setItem('itemId', itemInfo.id)
				window.location.href = '/#productDetails'
			  })

			//create h3 elemnt for item status
			const itemStatus = document.createElement('h3')
			//get item status
			const status = itemInfo.status
			// set innertext of h3 element to item name
			itemStatus.innerText = `status: ${status}`
			//adding eventlistener
			itemStatus.addEventListener("click", function() {
				console.log('inside the item status event listener')
				sessionStorage.setItem('itemId', itemInfo.id)
				window.location.href = '/#productDetails'
			  })

			/*create ul elemnt for item sellerInfo
			//get seller link to fetch
			const sellerLink = itemInfo.seller
			console.log('sellerInfo link: ', sellerLink)

			//fetching the sellerInfo
			const sellerInfoJson = await fetch(sellerLink)
			const sellerInfo = await sellerInfoJson.json()
			console.log('sellerInfo: ', sellerInfo)

			const sellerName = sellerInfo.data.name
			const sellerPhone = sellerInfo.data.phone     SELLER PART IS REMOVED IN VERSION 2 (STAGE 2)

			//creating ul element for seller info
			const seller = document.createElement('ol')

			//li element for seller name
			const nameLi = document.createElement('li')
			nameLi.innerText = `Seller Name:  ${sellerName} `

			//li element for seller phone
			const phoneLi = document.createElement('li')
			phoneLi.innerText = `Seller Phone No.  ${sellerPhone} `

			//creating line break
			const br = document.createElement('br')
			// appending ul element with li children
			seller.appendChild(br)
			seller.appendChild(nameLi)
			seller.appendChild(br)
			seller.appendChild(phoneLi)
			*/
			// apend the parent div element (class = carousel)with the div element creted previously
			document.querySelector('div.carousel').appendChild(div)

			// append div with child h3 elements (name and statsu)
			document.querySelector(`#\\3${data.data.indexOf(item)}`).appendChild(itemName)
			document.querySelector(`#\\3${data.data.indexOf(item)}`).appendChild(itemStatus)
			//document.querySelector(`#\\3${data.data.indexOf(item)}`).appendChild(seller) //seller removed in version2

			// checking if item has an image
			if(itemInfo.imageLink){				
				// getting the image link
				const imageLink = itemInfo.imageLink[0]			
				console.log('image link: ', imageLink)

				// adujusting link to use https
				var position = 4;
				var imageLink2 = [imageLink.slice(0, position), 's', imageLink.slice(position)].join('');
				console.log('image link with https:', imageLink2);					

				//creating img element
				var img = document.createElement('img'); 
				img.src = imageLink2
				
				//adding eventlistener
				img.addEventListener("click", function() {
					console.log('inside the item image event listener')
					sessionStorage.setItem('itemId', itemInfo.id)
					window.location.href = '/#productDetails'
			  })

				document.querySelector(`#\\3${data.data.indexOf(item)}`).appendChild(img)
		}	
	}

	//carousel navigation
	document.
	  getElementById('carousel__button--next')
	  .addEventListener("click", function() {
		moveToNextSlide();
	  }); 
	document.
	  getElementById('carousel__button--prev')
	  .addEventListener("click", function() {
		moveToPrevSlide();
	  });

	// displaying item name 	
	document.querySelector('main h3').innerText = data.data[0].name
} catch(err) {
	console.log(err)
	//window.location.href = '/#login'
}
}

//item name event listenr
function itemNameClicked(){
	console.log('inside itemNameClicked function')
}

function checkShowSeller(){
	console.log('inside checkShowSeller function')
	// check if user is logged in to view sellerpage in menu
		if(getCookie('authorization') && !document.querySelector('#seller') ) {
			console.log('authorised')
			// create li element and add seller id
			const navLi = document.createElement('li')
			navLi.setAttribute("id",'seller')
			//create a element and add refrence to seller page
			const navA = document.createElement('a')
			navA.setAttribute("href",'#seller')
			navA.innerText = 'Seller'
			//append navigation ul(index.hrml) with li element created
			document.querySelector("#navUl").appendChild(navLi)	
			//append li element with the a element created
			navLi.appendChild(navA)
	}else if (!getCookie('authorization') && document.querySelector('#seller')){
		const seller = document.querySelector('#seller')
		seller.parentNode.removeChild(seller);
	}
	
}


function moveToNextSlide() {
	console.log('current slide position: ', slidePosition)
	const totalSlides = slides.length
	console.log('total slides', totalSlides)
	if (slidePosition === totalSlides - 1) {
		slidePosition = 0;
  } else {
		slidePosition++;
  }

  updateSlidePosition();
}

function moveToPrevSlide() {
	console.log('current slide position: ', slidePosition)
	const totalSlides = slides.length
	if (slidePosition === 0) {	
		slidePosition = totalSlides - 1;
  } else {
		slidePosition--;
  }

  updateSlidePosition();
}

function updateSlidePosition() {
  for (let slide of slides) {
    slide.classList.remove('carousel__item--visible');
    slide.classList.add('carousel__item--hidden');
  }
	const currentSlide = slides[slidePosition]
	console.log('slides[slidePosition]', currentSlide)
  slides[slidePosition].classList.add('carousel__item--visible');
}
