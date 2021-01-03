import { showMessage, getCookie } from '../js/core.js'
const herokuApiUrl = 'https://auction-api-app.herokuapp.com'
const apiURL = 'https://jackson-relax-8080.codio-box.uk'


export function setup() {
	console.log('MAIN SCRIPT of Contact Seller details')		
	loadPage()		
}	

async function loadPage(){	
	console.log('Inside loadPage function')
	document.querySelector('form').addEventListener('submit', await postQuestion)	
}

async function postQuestion(event) {
	event.preventDefault()
	try {
		//geting item id stored in session storage
		const itemId = sessionStorage.getItem('itemId')
		console.log('recieved item id',itemId)
		
		// geting cookie 
		const cookie = getCookie('authorization')
		
		//adding form elements name and value to data object
		const question = document.forms['postQuestion'].elements[0].value
		console.log('The Question:', question)
		
		//initializing formdata and appending it with form values
		const formData = new FormData()
		
		//insert seller id into data object
		formData.append('question',question)
		// Display the key/value pairs
		for (let pair of formData.entries()) {
			console.log( pair[0]+ ', ' + pair[1]) 		
		}
		
		//initializing headers , methods and body
		const options = { method: 'POST', body: formData, headers: {Authorization: cookie }  }
		console.log('options',options)
		//setting the fetch url
		const postUrl = `${apiURL}/v2/items/question/${itemId}`	
		console.log('fetch url', postUrl)		
		const response = await fetch(postUrl,options)
		const json = await response.json()
		console.log('response', json.email)
		if(response.status === 422) throw new Error(`422 Unprocessable Entity: ${json.msg}`)
		
		window.location.href = '/#'
		}catch(err){
			console.log(err)
		}
}
	