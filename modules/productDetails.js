import { generateToken, getCookie, setCookie, showMessage, getLocation, decodeToken } from '../js/core.js'
const apiURL = 'https://jackson-relax-8080.codio-box.uk'

const slides = document.getElementsByClassName('carousel__item')
let slidePosition = 0

export function setup() {
	console.log('MAIN SCRIPT of product details')
	const cookie = getCookie('authorization')	
	console.log('the cookie : ', cookie )

	if(getCookie('authorization')) {
		console.log('authorised')
		loadPage(cookie)		
	}else{window.location.href = '/#login'}
		
}

async function loadPage(cookie){	
	console.log('Inside loadPage function')
	// get username and sellerid
	const [username,sellerId] = await getCurrentUser(cookie)
	console.log('current Username is :', username)
	console.log('current sellerId is :', sellerId)
	//geting item id stored in session storage
	const itemId = sessionStorage.getItem('itemId')
	console.log('recieved item id',itemId)
	
	//fetching the api for item info
	const url = `${apiURL}/v2/items/${itemId}`
	const json = await fetch(url)
	const data = await json.json()
	const item = data.data
	console.log("item info", item)	
	
	// creating div element for item name
	const itemNameDiv = document.createElement('div')
	itemNameDiv.classList.add('itemName')
	//create h3 elemnt for item name
	const itemName = document.createElement('h3')
	//get item name from databse
	const name = item.name
	// set innertext of h3 element to item name
	itemName.innerText = `Name : ${name}`
	//append itemNameDiv with the h3 child
	itemNameDiv.appendChild(itemName)
	//appending main div with the itemNameDiv
	document.querySelector('div.productDetails').appendChild(itemNameDiv)
	
	// getting the image link
	const imageLink = item.imageLink			
	console.log('image link length: ', imageLink.length)
	if (imageLink.length > 1){
		for(const image of imageLink){
			console.log('image link: ', image)
			const itemImageDiv = document.createElement('div')
			if(imageLink.indexOf(image) == 0){				
				console.log('index of image:', imageLink.indexOf(image))
				// creating div element for item image
				itemImageDiv.classList.add('itemImage', 'carousel__item','carousel__item--visible')				
			}else{
				console.log('index of image:', imageLink.indexOf(image))
				// creating div element for item image
				itemImageDiv.classList.add("carousel__item")				
			}			
			// adujusting link to use https
			var position = 4
			var imageLink2 = [image.slice(0, position), 's', image.slice(position)].join('')
			console.log('image link with https:', imageLink2)
						
			// --- Creating Image ---

			//creating img element
			var img = document.createElement('img')
			img.src = imageLink2	
			//appending image element to the parent div
			itemImageDiv.appendChild(img)
			//appending main div with the itemImageDiv
			document.querySelector('div.carousel').appendChild(itemImageDiv)
			
		}
	}else{
		// adujusting link to use https
		var position = 4;
		var imageLink2 = [imageLink.slice(0, position), 's', imageLink.slice(position)].join('')
		console.log('image link with https:', imageLink2)		
		// --- Creating Image ---
		// creating div element for item image
		const itemImageDiv = document.createElement('div')
		itemImageDiv.classList.add('itemImage')
		//creating img element
		var img = document.createElement('img')
		img.src = imageLink2	
		//creatign line break and appending it to the parent div
		const lineBreak = document.createElement('br')
		itemImageDiv.appendChild(lineBreak)
		//appending image element to the parent div
		itemImageDiv.appendChild(img)
		//appending main div with the itemImageDiv
		document.querySelector('div.productDetails').appendChild(itemImageDiv)		
	}
		
	// creating div element for item description
	const itemdDescriptionDiv = document.createElement('div')
	itemdDescriptionDiv.classList.add('itemdDescription')
	//create h3 elemnt for item description
	const itemdDescription = document.createElement('h3')
	//get item description from databse
	const description = item.description
	// set innertext of h3 element to item description
	itemdDescription.innerText = `Description : ${description}`
	//append itemdDescription with the h3 child
	itemdDescriptionDiv.appendChild(itemdDescription)
	//appending main div with the itemNameDiv
	document.querySelector('div.productDetails').appendChild(itemdDescriptionDiv)
	
	
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

	
	
}

//function to get the current logged in user username and sellerid
async function getCurrentUser(cookie){
	console.log('Inside getCurrentUser function')
	try{
		console.log('the cookie inside the loadpage', cookie)
		
		const url = `${apiURL}/accounts/useraccount/currentuser`
		const options = {headers: { Authorization: cookie } }

		const response = await fetch(url,options)
		console.log('the response :', response)
		
		const data = await response.json()						
		console.log('the username is :', data.username)
		console.log('the sellerId is :', data.sellerId)
	
		if(response.status === 401) throw new Error(json.msg)
		if(response.status === 200) {
			console.log('success')
			return [data.username , data.sellerId]
		}
	}catch(err) {
		showMessage(err.message)
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
