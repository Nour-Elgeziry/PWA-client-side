import { generateToken, getCookie, setCookie, showMessage, getLocation, decodeToken } from '../js/core.js'
const herokuApiUrl = 'https://auction-api-app.herokuapp.com'
const apiURL = 'https://jackson-relax-8080.codio-box.uk'

const slides = document.getElementsByClassName('carousel__item')
let slidePosition = 0

export function setup() {
	console.log('MAIN SCRIPT of product details')
		
	loadPage()		
}	

async function loadPage(){	
	console.log('Inside loadPage function')
		
	//geting item id stored in session storage
	const itemId = window.location.search.substring(1, window.location.search.length-1)
	console.log('recieved item id',itemId)
	
	//fetching the api for item info
	const url = `${herokuApiUrl}/v2/items/${itemId}`
	
	
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
	const itemDescription = document.createElement('h4')
	//get item description from databse
	const description = item.description
	// set innertext of h3 element to item description
	itemDescription.innerText = `Description : ${description}`
	//append itemdDescription with the h3 child
	itemDescriptionDiv.appendChild(itemDescription)
	//appending main div with the itemNameDiv
	document.querySelector('div.productDetails').appendChild(itemDescriptionDiv)
	
	
	
	//check if logged in 
	if(getCookie('authorization')){
		console.log('user logged in')
		//check if user is product owner
		const cookie = getCookie('authorization')
		console.log('the cookie: ', cookie)
		const [username,userSellerId] = await getCurrentUser(cookie)
		if(userSellerId == item.seller){
			console.log('user is the seller')
			//show question and under each one have an input text area element to answer
			//checking if there are questions
			if(item.questions){	
				console.log('questions are present:', item.questions)
				// getting the question link
				const questions = item.questions			
				console.log('questions length: ', questions.length)
				// loop through questions
				for(const question of questions){
					console.log('question: ', question)
					//check if question is anwered
					if(question.isanswered){
						console.log('question is answered')
						//show question and answer as label
						// --- Creating question ---

						// creating div element for item question
						const questionDiv = document.createElement('div')
						questionDiv.classList.add('itemdQuestion')
						//create label elemnt for item Question
						const itemdQuestion = document.createElement('h5')

						// set innertext of label element to item question
						itemdQuestion.innerText = ` Q: ${question.question}`
						//append itemdDescription with the h3 child
						questionDiv.appendChild(itemdQuestion)
						//appending main div with the itemNameDiv
						document.querySelector('div.productDetails').appendChild(questionDiv)

						// --- CREATING ANSwER ---
						// creating div element for item  answer
						const answerDiv = document.createElement('div')
						answerDiv.classList.add('answer')
						//create h3 elemnt for item name
						const itemAnswer = document.createElement('h5')
						//get item name from databse
						const answer = question.answer
						// set innertext of h3 element to item name
						itemAnswer.innerText = `Answer : ${answer}`
						//append questionDiv with the h5 child
						questionDiv.appendChild(itemAnswer)
						//creating line break
						const lineBreak = document.createElement('br')
						questionDiv.appendChild(lineBreak)
						
						

					}else{
						console.log('question is not answered')
						//show question with input text area to answer the question
						// --- Creating question ---

						// creating div element for item question
						const questionDiv = document.createElement('div')
						questionDiv.classList.add('itemdQuestion')
						//create label elemnt for item Question
						const itemdQuestion = document.createElement('h5')

						// set innertext of label element to item question
						itemdQuestion.innerText = ` Q: ${question.question}`
						//append itemdDescription with the h3 child
						questionDiv.appendChild(itemdQuestion)
						//appending main div with the itemNameDiv
						document.querySelector('div.productDetails').appendChild(questionDiv)

						// --- CREATING ANSWER ---
						// creating div element for item  answer
						const answerDiv = document.createElement('div')
						answerDiv.classList.add('answer')
						//create h3 elemnt for item name
						const itemAnswer = document.createElement('textarea')
						itemAnswer.setAttribute('id',"answerTextarea")
						itemAnswer.name = "answer"
						
						//create button to submit answer
						const button = document.createElement("input")
						button.setAttribute('type',"submit")
						button.setAttribute('id',"submitButton")
						button.innerText = "Submit"
						
						//appending main div with the answerDiv
						document.querySelector('div.productDetails').appendChild(answerDiv)
						
						// append tect area and button inside answer div
						document.querySelector('div.answer').appendChild(itemAnswer)
						document.querySelector('div.answer').appendChild(button)
						
						//adding eent listener to the button
						document.getElementById('submitButton').addEventListener("click", function() {	
							//check if textarea has content
							if(document.getElementById('answerTextarea').value){
								console.log('text area vale: ', document.getElementById('answerTextarea').value)
								// get content of text area
								const answer = document.getElementById('answerTextarea').value
								//api call to submit answer
								//get question id
								const questionId = question.id
								console.log('question id is :', questionId)
								//call sendAnswer FUNCTION
								 sendAnswer(answer,questionId,cookie)
								
								/*
								//set url to fetch
								const postUrl = `${apiURL}/v2/items/answer/${questionId}`
								//initializing headers , methods and body
								const options = { method: 'PUT', body: answer, headers: {Authorization: cookie }  }
								const response =  fetch(postUrl,options)
								console.log(response)
									*/
								
								
							}else{alert("Please add an answer before submitting");}							
					  })							
					}
			}// for each question			
		}else{
			//if no questions
			console.log('no questions')	  
		}
	}else{
		console.log('user isnt seller')
		//if not user == seller
		//check if questions
		if(item.questions){
			console.log('questions are present:', item.questions)
			const questions = item.questions
			for(const question of questions){
				//check if question is answered
				if(question.isanswered){
					console.log('question is answered')
					//show question and answer
					// --- Creating question ---
					// creating div element for item question
					const questionDiv = document.createElement('div')
					questionDiv.classList.add('itemdQuestion')
					//create label elemnt for item Question
					const itemdQuestion = document.createElement('h5')

					// set innertext of label element to item question
					itemdQuestion.innerText = ` Q: ${question.question}`
					//append itemdDescription with the h3 child
					questionDiv.appendChild(itemdQuestion)
					//appending main div with the itemNameDiv
					document.querySelector('div.productDetails').appendChild(questionDiv)

					// --- CREATING ANSwER ---
					// creating div element for item  answer
					const answerDiv = document.createElement('div')
					answerDiv.classList.add('answer')
					//create h3 elemnt for item name
					const itemAnswer = document.createElement('h5')
					//get item name from databse
					const answer = question.answer
					// set innertext of h3 element to item name
					itemAnswer.innerText = `Answer : ${answer}`
					//append itemNameDiv with the h3 child
					questionDiv.appendChild(itemAnswer)
					//creating line break
					const lineBreak = document.createElement('br')
					questionDiv.appendChild(lineBreak)
					

					
					
				}else{
					console.log('question is not answer')
					// --- Creating question ---

					// creating div element for item question
					const questionDiv = document.createElement('div')
					questionDiv.classList.add('itemQuestion')
					//create label elemnt for item Question
					const itemQuestion = document.createElement('h5')

					// set innertext of label element to item question
					itemQuestion.innerText = ` Q: ${question.question}`
					//append itemDescription with the h3 child
					questionDiv.appendChild(itemQuestion)
					//appending main div with the itemNameDiv
					document.querySelector('div.productDetails').appendChild(questionDiv)
				}
				
			}
		}else{console.log('no questions')}
		
		//show contact seller button
		const contactSellerBtn = document.createElement('button')
		contactSellerBtn.setAttribute("id",'contactSeller')
		contactSellerBtn.innerText = 'Contact Seller'
		//adding element to html
		document.querySelector('div.productDetails').appendChild(contactSellerBtn)
		//event listener
		//event listener
		document.getElementById('contactSeller').addEventListener("click", function() {				
			window.location.href = '/#contactSeller'
  })			
		}
	}else{
		//show questions
		if(item.questions){
			console.log('questions are present:', item.questions)
			const questions = item.questions
			for(const question of questions){
				//check if question is answered
				if(question.isanswered){
					console.log('question is answered')
					//show question and answer
					// --- Creating question ---
					// creating div element for item question
					const questionDiv = document.createElement('div')
					questionDiv.classList.add('itemdQuestion')
					//create label elemnt for item Question
					const itemdQuestion = document.createElement('h5')

					// set innertext of label element to item question
					itemdQuestion.innerText = ` Q: ${question.question}`
					//append itemdDescription with the h3 child
					questionDiv.appendChild(itemdQuestion)
					//appending main div with the itemNameDiv
					document.querySelector('div.productDetails').appendChild(questionDiv)

					// --- CREATING ANSwER ---
					
					//create h3 elemnt for item name
					const itemAnswer = document.createElement('h5')
					//get item name from databse
					const answer = question.answer
					// set innertext of h3 element to item name
					itemAnswer.innerText = `Answer : ${answer}`
					//append itemNameDiv with the h3 child
					questionDiv.appendChild(itemAnswer)
					
				}else{
					console.log('question is not answer')
					// --- Creating question ---

					// creating div element for item question
					const questionDiv = document.createElement('div')
					questionDiv.classList.add('itemdQuestion')
					//create label elemnt for item Question
					const itemdQuestion = document.createElement('h5')

					// set innertext of label element to item question
					itemdQuestion.innerText = ` Q: ${question.question}`
					//append itemdDescription with the h3 child
					questionDiv.appendChild(itemdQuestion)
					//appending main div with the itemNameDiv
					document.querySelector('div.productDetails').appendChild(questionDiv)
				}
				
			}
		}else{console.log('no questions')}
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

//function to get the current logged in user username and sellerid
async function getCurrentUser(cookie){
	console.log('Inside getCurrentUser function')
	try{
		console.log('the cookie inside the getcurrenUser', cookie)
		
		const url = `${herokuApiUrl}/accounts/useraccount/currentuser`
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

async function sendAnswer(answer,questionId,cookie){
	//set url to fetch
	console.log('insdie sendAnswer function')
	const postUrl = `${herokuApiUrl}/v2/items/answer/${questionId}`
	//initializing headers , methods and body
	const options = { method: 'PUT', body: answer, headers: {Authorization: cookie }  }
	const response =  await fetch(postUrl,options)
	console.log(response)
	window.location.href = '/#'
}

