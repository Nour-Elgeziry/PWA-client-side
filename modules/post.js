/* register.js */

import { getCookie } from '../js/core.js'
const apiURL = 'https://jackson-relax-8080.codio-box.uk'
export async function setup() {
		console.log('User Authorized')
		console.log('Post Main script')
		document.querySelector('h1').innerText = 'Post a New Item'
		document.querySelector('form').addEventListener('submit', await postItem(event))			
	
}

async function postItem(event) {
	event.preventDefault()
	try {
		// geting cookie 
		const cookie = getCookie('authorization')
		//geting loged in user name and sellerid
		const [username,sellerId] = await getCurrentUser(cookie)
		console.log('current user: ', username, sellerId)
		
		//adding form elements name and value to data object
		const elements = [...document.forms['post'].elements]
		
		//initializing formdata and appending it with form values
		const formData = new FormData()
		elements.forEach( el => { 
			if(el.name =='photo'){
				Array.from(el.files).forEach(file => { 					
					formData.append(el.name,file)
					 })				
			} else if(el.name){
				formData.append(el.name,el.value)
			}
							
		})	
		//insert seller id into data object
		formData.append('seller',sellerId)
		//insert status 
		formData.append('status','on sale')
		
		// Display the key/value pairs
		for (let pair of formData.entries()) {
			console.log('the values', pair[0]+ ', ' + pair[1]) 
		}
	
	 
		
		//initializing headers , methods and body
		const options = { method: 'POST', body: formData, headers: {Authorization: cookie }  }
		console.log('options',options)
		//setting the fetch url
		const postUrl = `${apiURL}/v2/items/`	
		console.log('fetch url', postUrl)		
		const response = await fetch(postUrl,options)		
		const json = await response.json()
		console.log('response', json)
		if(response.status === 422) throw new Error(`422 Unprocessable Entity: ${json.msg}`)
		window.location.href = '/#seller'
		
		
	} catch(err) {
		showMessage(err.message)
	}
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

