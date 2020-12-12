
/* home.js */

import { getCookie, login, showMessage } from '../js/core.js'

const apiURL = 'https://jackson-relax-8080.codio-box.uk'
const slides = document.getElementsByClassName('carousel__item')
let slidePosition = 0


export async function setup() {
	try {
		console.log('MAIN SCRIPT')
		const url = `${apiURL}/items/`
		console.log(url)
		const json = await fetch(url)
		const data = await json.json()		
		console.log("number of items = ", data.data.length)
		for(let item of data.data){
			console.log('item',item)			
			//check if this is the first element to be added(by checking the index of the item) to add isvisible class
			if(data.data.indexOf(item) == 0){	
				console.log('item index == 0')
				// create carousel item div
				const div = document.createElement('div')
				div.classList.add('carousel__item','carousel__item--visible')	
				
				/*create img element for item image
				const itemImage = document.createElement('img')
				const image = 
					*/			
				//create h3 elemnt for item name
				const itemName = document.createElement('h3')
				//get item name
				const name = item.name
				// set innertext of h3 element to item name
				itemName.innerText = name
				
				// apend the parent div element (class = carousel)with the div element creted previously
				document.querySelector('div.carousel').appendChild(div)
				// append div with child h3 element 
				document.querySelector('div.carousel__item').appendChild(itemName)										
				}
			else{
					console.log('item index ==1')
					// create carousel item div
					const div = document.createElement('div')					
					div.classList.add("carousel__item")	
					//create h3 elemnt for item name
					const itemName = document.createElement('h3')
					//get item name
					const name = item.name
					// set innertext of h3 element to item name
					itemName.innerText = name	
					// apend the parent div element (class = carousel)with the div element creted previously
					document.querySelector('div.carousel').appendChild(div)
					// append div with child h3 element 
					document.querySelector('div.carousel__item:not(.carousel__item--visible)').appendChild(itemName)	
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



function moveToNextSlide() {
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
	console.log('slides[slidePosition]', slides[slidePosition])
  slides[slidePosition].classList.add('carousel__item--visible');
}
