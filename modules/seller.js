/* seller.js*/

import { generateToken, getCookie, setCookie, showMessage, getLocation, decodeToken } from '../js/core.js'
const herokuApiUrl = 'https://auction-api-app.herokuapp.com'
const apiURL = 'https://jackson-relax-8080.codio-box.uk'

// vars used for carousel navigation
const slides = document.getElementsByClassName('carousel__item')
let slidePosition = 0


export function setup() {
	console.log('MAIN SCRIPT of seller')
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
	
	// get all items by this seller 
	const url = `${herokuApiUrl}/v2/items/seller/${sellerId}/items`
	const json = await fetch(url)
	const data = await json.json()
	console.log('data recieved :', data.data)
	
	
	//checking if there is items posted by this user
	if (data.data.length !== 0){	
	
	for(let item of data.data){
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
		div.setAttribute("id", data.data.indexOf(item))
		
		//  --- CREATING ITEM NAME ---
		// creating div element for item name
		const itemNameDiv = document.createElement('div')
		itemNameDiv.classList.add('itemName')
		//create h3 elemnt for item name
		const itemName = document.createElement('h3')
		//get item name from databse
		const name = item.name
		// set innertext of h3 element to item name
		itemName.innerText = name
		//append itemNameDiv with the h3 child
		itemNameDiv.appendChild(itemName)

		//  --- CREATING ITEM STATUS ---
		// creating div element for item status
		const itemStatusDiv = document.createElement('div')
		itemStatusDiv.classList.add('itemStatus')
		//create label element 
		const label = document.createElement('Label')
		label.classList.add('statusLabel')
		//create select element for item status and update 
		const itemStatus = document.createElement('select')
		itemStatus.classList.add(`status${data.data.indexOf(item)}`)
		
		// create option using DOM
		const options = document.createElement('option')
		const optionsText = document.createTextNode('--choose--')				
		// set option text
		options.appendChild(optionsText)
		// and option value
		options.setAttribute('value','options')

		// create for sale option using DOM
		const onSale = document.createElement('option')
		const onSaleText = document.createTextNode('On Sale')				
		// set option text
		onSale.appendChild(onSaleText)
		// and option value
		onSale.setAttribute('value','on sale')

		// create under offer option using DOM
		const underOffer = document.createElement('option')
		const underOfferText = document.createTextNode('Under offer')				
		// set option text
		underOffer.appendChild(underOfferText)
		// and option value
		underOffer.setAttribute('value','under offer')

		// create  sold option using DOM
		const sold = document.createElement('option')
		const soldText = document.createTextNode('Sold')				
		// set option text
		sold.appendChild(soldText)
		// and option value
		sold.setAttribute('value','sold')


		//pre set the status field to correct value
		if (item.status == 'on sale'){
			onSale.setAttribute('selected','selected')
		}else if (item.status == 'under offer') {
			underOffer.setAttribute('selected','selected')
		}else {sold.setAttribute('selected','selected') }				

		//append the label elem with the select child
		label.appendChild(itemStatus)
		//append itemStatusDiv with the label
		itemStatusDiv.appendChild(label)
		

		// apend the parent div element (class = carousel)with the div element creted previously
		document.querySelector('div.carousel').appendChild(div)

		// append div with child h3 elements (name and status)
		document.querySelector(`#\\3${data.data.indexOf(item)}`).appendChild(itemNameDiv)
		document.querySelector(`#\\3${data.data.indexOf(item)}`).appendChild(itemStatusDiv)	

		// add the option to the select box
		document.querySelector( `.status${data.data.indexOf(item)}` ).appendChild(options)
		document.querySelector( `.status${data.data.indexOf(item)}` ).appendChild(onSale)
		document.querySelector( `.status${data.data.indexOf(item)}` ).appendChild(underOffer)
		document.querySelector( `.status${data.data.indexOf(item)}` ).appendChild(sold)

		// checking if item has an image
		if(item.imageLink){
			// getting the image link
			const imageLink = item.imageLink			
			console.log('image link: ', imageLink)

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
			
			document.querySelector(`#\\3${data.data.indexOf(item)}`).appendChild(itemImageDiv)	
	}	
		
		//  ---CREATING DELETE BUTTON ---
		//creating div element for deletebutoon
		const deleteButtonDiv = document.createElement('div')
		deleteButtonDiv.classList.add('deleteButton')
		//creating button element
		const deleteButton = document.createElement('button')
		deleteButton.setAttribute('id',`deleteButton${data.data.indexOf(item)}`)		
		deleteButton.innerText = 'Delete Item'		
		//appending the parent div with the button
		deleteButtonDiv.appendChild(deleteButton)
		//appending the carouseldiv with the button child
		document.querySelector(`#\\3${data.data.indexOf(item)}`).appendChild(deleteButtonDiv)		
		//deleteButton event listener
		document.getElementById(`deleteButton${data.data.indexOf(item)}`).addEventListener("click", function() {		
			console.log('item id: ', item.id)
			const id = item.id
			deleteItem(id,cookie)		
			
	  })
		
		// ---CREATING ADD POST BUTTON
		//creating div element for postbutoon
		const postButtonDiv = document.createElement('div')
		postButtonDiv.setAttribute('id','postButton')
		//creating button element
		const postButton = document.createElement('button')		
		postButton.innerText = 'Post Item'		
		//appending the parent div with the button
		postButtonDiv.appendChild(postButton)
		//appending the carouseldiv with the button child
		document.querySelector(`#\\3${data.data.indexOf(item)}`).appendChild(postButtonDiv)			
		//post button event listener
		document.getElementById('postButton').addEventListener("click", function() {		
			window.location.href = '/#post'
		  })	

		//waiting for status value change
		document.querySelector(`.status${data.data.indexOf(item)}`).addEventListener("change", function() {
			console.log('item id: ', item.id,' the value:', this.value)
			const id = item.id
			const value = this.value
			updateStatus(id,value,cookie)
			})
	}
		
	
	//carousel navigation
	document.getElementById('carousel__button--next').addEventListener("click", function() {		
		moveToNextSlide()
	  })
	document.getElementById('carousel__button--prev').addEventListener("click", function() {
		moveToPrevSlide()
	  })
	}else {
		const actions = document.querySelector('div.carousel__actions').style.display = "none"
		console.log('actions class',actions)
		
		const title = document.createElement('h2')
		title.innerText = 'No items available'
		document.querySelector('div.carousel').appendChild(title)
		
		// ---CREATING ADD POST BUTTON
		//creating div element for postbutoon
		const postButtonDiv = document.createElement('div')
		postButtonDiv.setAttribute('id','postButton')
		//creating button element
		const postButton = document.createElement('button')		
		postButton.innerText = 'Post Item'		
		//appending the parent div with the button
		postButtonDiv.appendChild(postButton)
		//appending the carouseldiv with the button child
		document.querySelector('div.carousel').appendChild(postButtonDiv)			
		//post button event listener
		document.getElementById('postButton').addEventListener("click", function() {		
			window.location.href = '/#post'
		  })	

		
	}
	
} 
	
	
//function to get the current logged in user username and sellerid
async function getCurrentUser(cookie){
	console.log('Inside getCurrentUser function')
	try{
		console.log('the cookie inside the loadpage', cookie)
		
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

// function to update item status
async function updateStatus(id,value,cookie){	
	console.log('inside update status function')
	console.log('item id: ', id)
	console.log('status value: ', value)
	let stringify = JSON.stringify({status:value})
	
	const putUrl = `${herokuApiUrl}/v2/items/status/${id}`
	console.log('sent url: ', putUrl)
	const options = {method: 'PUT',body: stringify ,headers: { 'Content-Type': 'application/json',Authorization: cookie } }
	console.log('options = : ', options)
	const update = await fetch(putUrl,options)
	const data = await update.json()
	console.log('data recieved :', data) 			 
}

 async function deleteItem(id,cookie){
	console.log('inside delete item function and recived item id is : ', id)
	const deletUrl = `${herokuApiUrl}/v2/items/${id}`
	const options = {method: 'DELETE' ,headers: {Authorization: cookie } }
	const deleteFetch = await fetch(deletUrl,options)
	const data = await deleteFetch.json()
	console.log('data recieved :', data) 
	window.location.href = '/#'
}

//carousel navigation functions
function moveToNextSlide() {
	console.log('current slide position: ', slidePosition)
	const totalSlides = slides.length
	console.log('total slides', totalSlides)
  if (slidePosition === totalSlides - 1) {
    slidePosition = 0
  } else {
    slidePosition++
  }

  updateSlidePosition()
}

function moveToPrevSlide() {
	console.log('current slide position: ', slidePosition)
	const totalSlides = slides.length
	if (slidePosition === 0) {		
		slidePosition = totalSlides - 1
	} else {		
		slidePosition--
  }

  updateSlidePosition()
}

function updateSlidePosition() {
  for (let slide of slides) {
    slide.classList.remove('carousel__item--visible')
    slide.classList.add('carousel__item--hidden')
  }
	console.log('slides[slidePosition]', slides[slidePosition])
  slides[slidePosition].classList.add('carousel__item--visible')
}




