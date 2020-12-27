import { generateToken, getCookie, setCookie, showMessage, getLocation, decodeToken } from '../js/core.js'
const apiURL = 'https://jackson-relax-8080.codio-box.uk'

const slides = document.getElementsByClassName('carousel__item')
let slidePosition = 0

export function setup() {
	console.log('MAIN SCRIPT of product details')
	checkShowContactSeller()
		
	loadPage()		
}	

async function loadPage(){	
	console.log('Inside loadPage function')
	
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
			//adujusting link to use https
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
		var imageLink2 = [imageLink[0].slice(0, position), 's', imageLink[0].slice(position)].join('')
		console.log('image link with https:', imageLink2)		
		// --- Creating Image ---
		// creating div element for item image
		const itemImageDiv = document.createElement('div')
		itemImageDiv.classList.add('itemImage', 'carousel__item','carousel__item--visible')
		//creating img element
		var img = document.createElement('img')
		img.src = imageLink2	
		//creatign line break and appending it to the parent div
		const lineBreak = document.createElement('br')
		itemImageDiv.appendChild(lineBreak)
		//appending image element to the parent div
		itemImageDiv.appendChild(img)
		//appending main div with the itemImageDiv
		document.querySelector('div.carousel').appendChild(itemImageDiv)		
	}
		
	// creating div element for item description
	const itemDescriptionDiv = document.createElement('div')
	itemDescriptionDiv.classList.add('itemDescription')
	//create h3 elemnt for item description
	const itemDescription = document.createElement('h3')
	//get item description from databse
	const description = item.description
	// set innertext of h3 element to item description
	itemDescription.innerText = `Description : ${description}`
	//append itemdDescription with the h3 child
	itemDescriptionDiv.appendChild(itemDescription)
	//appending main div with the itemNameDiv
	document.querySelector('div.productDetails').appendChild(itemDescriptionDiv)
	
	// getting the question link
	const questions = item.questions			
	console.log('questions length: ', questions.length)
	if (questions.length > 1){
		for(const question of questions){
			console.log('question: ', question)
			
			
			// --- Creating question ---

			// creating div element for item question
			const questionDiv = document.createElement('div')
			questionDiv.classList.add('itemdQuestion')
			//create label elemnt for item Question
			const itemdQuestion = document.createElement('label')
			
			// set innertext of label element to item question
			itemdQuestion.innerText = question
			//append itemdDescription with the h3 child
			questionDiv.appendChild(itemdQuestion)
			//appending main div with the itemNameDiv
			document.querySelector('div.productDetails').appendChild(questionDiv)
			
		}
	}else{
		// --- Creating question ---

		// creating div element for item question
		const questionDiv = document.createElement('div')
		questionDiv.classList.add('itemdQuestion')
		//create label elemnt for item Question
		const itemdQuestion = document.createElement('label')

		// set innertext of label element to item question
		itemdQuestion.innerText = `Question: ${questions[0].question}`
		//append itemdQuestionDiv with the label child
		questionDiv.appendChild(itemdQuestion)
		//appending main div with the itemQuestion
		document.querySelector('div.productDetails').appendChild(questionDiv)	
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

	
	
}

//
function checkShowContactSeller(){
	console.log('inside checkShowContactSeller function')
	// check if user is logged in to view sellerpage in menu
		if(getCookie('authorization') && !document.querySelector('#contactSeller') ) {
			console.log('authorised')
			// create btn element and add contactSeller id
			const contactSellerBtn = document.createElement('button')
			contactSellerBtn.setAttribute("id",'contactSeller')
			contactSellerBtn.innerText = 'Contact Seller'
			//adding element to html
			document.querySelector('div.productDetails').appendChild(contactSellerBtn)
			//event listener
			document.getElementById('contactSeller').addEventListener("click", function() {				
				window.location.href = '/#contactSeller'
	  })
			
	}else if (!getCookie('authorization') && document.querySelector('#contactSeller')){
		const contactSellerBtn = document.querySelector('#contactSeller')
		contactSellerBtn.parentNode.removeChild(contactSellerBtn);
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
